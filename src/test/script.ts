import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import MaterialLoader from '../loader/material';
import { randInt } from 'three/src/math/MathUtils';

class Script {
    private number_of_zombies = 1;
    private mesh: THREE.InstancedMesh | undefined;
    private zombie = new THREE.Object3D();
    private mixers: THREE.AnimationMixer[] = []; // Array to hold mixers for each instance
    
    private range = 4;
    private loader = new FBXLoader();
    private is_loaded: boolean = false;
    private mixer: THREE.AnimationMixer | undefined;    
    private attack_animation: THREE.AnimationAction | undefined;

    constructor(
        private scene: THREE.Scene,
        private renderer: THREE.WebGLRenderer,
        private axes_helper: THREE.AxesHelper,
    ) {
        this.renderer.setClearColor(0xFFFFFF);
    }

    start() {
        // this.loader.load("./assets/entity/zombie/animation/zombie@atack1.fbx", (fbx) => {   
    
        //     fbx.scale.set(0.01, 0.01, 0.01);
        //     fbx.position.set(
        //         Math.random() * this.range - (this.range / 2),
        //         0,
        //         Math.random() * this.range - (this.range / 2)
        //     );
    
        //     this.mixer = new THREE.AnimationMixer(fbx);
        //     this.attack_animation = this.mixer.clipAction(fbx.animations[0]);
        //     this.attack_animation.play()
        //     this.scene.add(fbx);
        // });

        const THIS = this;
        const loader = new FBXLoader();

        // Chargement du modèle FBX
        loader.load('./assets/entity/zombie/animation/zombie@atack1.fbx', function (object) {
            console.log(object)
        });
        
    }
    

    update() 
    {
        if (!this.is_loaded || !this.mixer) return;
        this.mixer.update(0.04);
    }
}

export default Script;