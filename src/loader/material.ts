import * as THREE from 'three'
import { TextureLoader } from 'three'


export interface TexturesPath {
    map?: string,
    emissiveMap?: string,
    roughnessMap?: string,
    displacementMap?: string,
    metalnessMap?: string,
    normalMap?: string,
    aoMap?: string
};

interface TexturesThree {
    map?: THREE.Texture,
    emissiveMap?: THREE.Texture,
    roughnessMap?: THREE.Texture,
    displacementMap?: THREE.Texture,
    metalnessMap?: THREE.Texture,
    normalMap?: THREE.Texture,
    aoMap?: THREE.Texture
};


export default class MaterialLoader {
    private _texture_paths: TexturesPath   = {};
    private _three_textures: TexturesThree = {};
    material: THREE.MeshStandardMaterial

    constructor(texturePaths: TexturesPath) {
        this._texture_paths = texturePaths;

        this.material = this.createMaterial();
    }

    private createMaterial(): THREE.MeshStandardMaterial {
        const textureLoader = new TextureLoader();

        for (const [key, path] of Object.entries(this._texture_paths)) {
            if (path) {
                if (!(key in this._three_textures)) {
                    const texture = textureLoader.load(path);
                    texture.format = THREE.RGBAFormat
                    this._three_textures[key as keyof TexturesThree] = texture;

                }
            }
        }

        return new THREE.MeshStandardMaterial(this._three_textures);
    }
}
