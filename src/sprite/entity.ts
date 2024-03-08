import * as THREE from 'three'
import * as path from 'path';
import * as setup from '../game/setup'

import { TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';



export interface TexturesPath {
    map?: string,
    emissiveMap?: string,
    roughnessMap?: string,
    displacementMap?: string,
    metalnessMap?: string,
    normalMap?: string,
    aoMap?: string
}

interface Textures {
    map?: THREE.Texture,
    emissiveMap?: THREE.Texture,
    roughnessMap?: THREE.Texture,
    displacementMap?: THREE.Texture,
    metalnessMap?: THREE.Texture,
    normalMap?: THREE.Texture,
    aoMap?: THREE.Texture
}

export interface MixerPack {
    mixer?: THREE.AnimationMixer,
    animation_properties?: THREE.Group<THREE.Object3DEventMap>
}


// export default 
export default class Entity {
    private _velocity: Number
    private _hp: Number
    private _name: String
    private _texturesLoader: Array<THREE.Texture>
    private _baseMeshPath: String
    private _baseMeshAnimationPath: Array<string>
    private _textures: Textures
    private _material: THREE.MeshStandardMaterial | null
    private _mesh: THREE.Object3D | null
    private _animations: {[key: string]: THREE.AnimationClip}
    private _mixer: THREE.AnimationMixer | null
    private _start_position: [number, number, number]
    private _scale: [number, number, number]

    constructor() {
        this._velocity = 0;
        this._hp = 0;
        this._name = "";
        this._texturesLoader = [];
        this._baseMeshPath = "";
        this._baseMeshAnimationPath = [];
        this._textures = {};
        this._material = null;
        this._mesh = null;
        this._animations = {};
        this._mixer = null
        this._start_position = [0, 0, 0]
        this._scale = [0, 0, 0]
    }

    set_velocity(velocity: Number): this {
        this._velocity = velocity;
        return this;
    }

    set_health_point(hp: Number): this {
        this._hp = hp;
        return this;
    }

    set_position(x: number, y: number, z: number): this {
        this._start_position = [x, y, z];
        return this;
    }

    set_scale(x: number, y: number, z: number): this {
        this._scale = [x, y, z]
        return this
    }

    set_name(name: String): this {
        this._name = name;
        return this;
    }

    set_textures(textureFilesPath: TexturesPath): this {
        const textureLoader = new TextureLoader();
        
        if (this._textures !== null) {
            if (textureFilesPath.aoMap !== undefined) {
                this._textures.aoMap = textureLoader.load(textureFilesPath.aoMap)
            }
    
            if (textureFilesPath.displacementMap !== undefined) {
                this._textures.displacementMap = textureLoader.load(textureFilesPath.displacementMap)
            }
    
            if (textureFilesPath.emissiveMap !== undefined) {
                this._textures.emissiveMap = textureLoader.load(textureFilesPath.emissiveMap)
            }
    
            if (textureFilesPath.map !== undefined) {
                this._textures.map = textureLoader.load(textureFilesPath.map)
            }
    
            if (textureFilesPath.metalnessMap !== undefined) {
                this._textures.metalnessMap = textureLoader.load(textureFilesPath.metalnessMap)
            }
    
            if (textureFilesPath.normalMap !== undefined) {
                this._textures.normalMap = textureLoader.load(textureFilesPath.normalMap)
            }
    
            if (textureFilesPath.roughnessMap !== undefined) {
                this._textures.roughnessMap = textureLoader.load(textureFilesPath.roughnessMap)
            }
    
            this.set_material()
        }
        

        return this;
    }

    private set_material() {
        if (this._textures !== null) {
            this._material = new THREE.MeshStandardMaterial(this._textures);
        }
    }

    get_material(): THREE.MeshStandardMaterial | null {
        return this._material;
    }

    get_mesh(): THREE.Object3D | null {
        return this._mesh;
    }

    get_animations(): {[key: string]: THREE.AnimationClip} {
        return this._animations
    }

    get_mixer(): THREE.AnimationMixer | null {
        return this._mixer;
    }

    play_animation(animationName: string) {
        if (Object.keys(this._animations).includes(animationName) && this._mesh !== null) {
            const mixer = new THREE.AnimationMixer(this._mesh);
            const action = mixer.clipAction(this._animations[animationName]);
            action.play();
            this._mixer = mixer;
        }
    }

    load(baseMeshPathFBX: string, baseMeshAnimationPath: Array<[string, string]>): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const THIS = this;
            this._baseMeshPath = baseMeshPathFBX;
            this._baseMeshAnimationPath = baseMeshAnimationPath[0];
    
            // Load Zombie
            const fbxLoader = new FBXLoader();
            let idxAnimationLoad = 0;

            fbxLoader.load(
                baseMeshPathFBX,
                (object) => {
                    object.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = THIS.get_material();
                            if (child.material) {
                                child.material.transparent = false;
                            }
                        }
                    });
    
                    object.scale.set(
                        this._scale[0],
                        this._scale[1],
                        this._scale[2]
                    );

                    object.position.set(
                        this._start_position[0],
                        this._start_position[1],
                        this._start_position[2]
                    )

                    THIS._mesh = object;
                    this._baseMeshAnimationPath = baseMeshAnimationPath[0];

                    for (const animsPath of baseMeshAnimationPath) {
                        fbxLoader.load(animsPath[0],
                            (animation) => {
                                this._animations[animsPath[1]] = animation.animations[0]

                                if (idxAnimationLoad === baseMeshAnimationPath.length-1) {
                                    setup.scene.add(object);
                                    resolve(true);
                                } else {
                                    idxAnimationLoad++
                                }
                            }
                        );
                    }
                },

                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }
    
}

