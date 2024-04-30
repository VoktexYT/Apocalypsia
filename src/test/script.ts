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

    private object3D: THREE.Object3D | undefined;


    constructor(
        private scene: THREE.Scene,
        private renderer: THREE.WebGLRenderer,
        private axes_helper: THREE.AxesHelper,
    ) {
        this.renderer.setClearColor(0xFFFFFF);
    }

    // start() {
        // this.loader.load("./assets/entity/zombie/animation/zombie@atack1.fbx", (fbx) => {
    
        //     const geometries: Array<THREE.BufferGeometry> = [];
        //     fbx.traverse((child) => {
        //         if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
        //             geometries.push(child.geometry);
        //         }
        //     });
        //     const geometry: THREE.BufferGeometry = mergeGeometries(geometries);
    
        //     const root_path = "./assets/entity/zombie/textures/";
        //     const material: THREE.Material = new MaterialLoader({
        //         map: root_path + `1/HIGH/1_Albedo.png`,
        //         emissiveMap: root_path + `1/HIGH/1_Emission.png`,
        //         roughnessMap: root_path + `1/HIGH/1_gloss.png`,
        //         displacementMap: root_path + `1/HIGH/1_Height.png`,
        //         metalnessMap: root_path + `1/HIGH/1_metalik marmoset.png`,
        //         normalMap: root_path + `1/HIGH/1_Normal.png`,
        //         aoMap: root_path + `1/HIGH/1_Occlusion.png`
        //     }).material;
    
        //     this.mesh2 = new THREE.Mesh(geometry, material);
        //     // this.mesh = new THREE.InstancedMesh(geometry, material, this.number_of_zombies);
        //     // this.scene.add(this.mesh);
        //     this.scene.add(this.mesh2);
        //     this.is_loaded = true;

        //     this.mesh2.scale.set(0.01, 0.01, 0.01);
        //     this.mesh2.position.set(
        //         Math.random() * this.range - (this.range / 2),
        //         0,
        //         Math.random() * this.range - (this.range / 2)
        //     );
    
        //     // for (let i = 0; i < this.number_of_zombies; i++) {
        //     //     this.zombie.scale.set(0.01, 0.01, 0.01);
        //     //     this.zombie.position.set(
        //             // Math.random() * this.range - (this.range / 2),
        //             // 0,
        //             // Math.random() * this.range - (this.range / 2)
        //     //     );
    
        //         // this.zombie.updateMatrix();
        //         // this.mesh.setMatrixAt(i, this.zombie.matrix);
    
        //         // Animation
        //         const mixer = new THREE.AnimationMixer(fbx);
        //         const action = mixer.clipAction(fbx.animations[0]);
        //         action.play();
        //         // console.log(action.isRunning())
        //         this.mixers.push(mixer);
        //         console.log(this.mixers)
    
        // //         console.log("Animation mixer created and animation played");
        // //     }
        // });
    // }

    // update() {
        // for (let i = 0; i < this.number_of_zombies; i++) {
        //     this.mesh.getMatrixAt(i, this.zombie.matrix);
        //     this.zombie.matrix.decompose(this.zombie.position, this.zombie.quaternion, this.zombie.scale);
        //     this.zombie.updateMatrix();
        //     this.mesh.setMatrixAt(i, this.zombie.matrix);
        // }

        // this.mesh.instanceMatrix.needsUpdate = true;
    // }

    start() {
        // Load the FBX model
        this.loader.load("./assets/entity/zombie/animation/zombie@atack1.fbx", (fbx) => {
            // const geometries: Array<THREE.BufferGeometry> = [];

            // fbx.traverse((child) => {
            //     if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
            //         geometries.push(child.geometry);
            //     }
            // });
            // const geometry = mergeGeometries(geometries);
    
            // Load materials
            // const root_path = "./assets/entity/zombie/textures/";
            // const material = new MaterialLoader({
            //     map: root_path + `1/HIGH/1_Albedo.png`,
            //     emissiveMap: root_path + `1/HIGH/1_Emission.png`,
            //     roughnessMap: root_path + `1/HIGH/1_gloss.png`,
            //     displacementMap: root_path + `1/HIGH/1_Height.png`,
            //     metalnessMap: root_path + `1/HIGH/1_metalik marmoset.png`,
            //     normalMap: root_path + `1/HIGH/1_Normal.png`,
            //     aoMap: root_path + `1/HIGH/1_Occlusion.png`
            // }).material;
    
            // Create mesh
            this.is_loaded = true;
    
            // Set initial scale and position
            fbx.scale.set(0.01, 0.01, 0.01);
            fbx.position.set(
                Math.random() * this.range - (this.range / 2),
                0,
                Math.random() * this.range - (this.range / 2)
            );
    
            // Create Animation Mixer and play animation
            this.mixer = new THREE.AnimationMixer(fbx);
            this.attack_animation = this.mixer.clipAction(fbx.animations[0]);
            this.attack_animation.play()
            this.scene.add(fbx);
        });
    }
    

    update() 
    {
        if (!this.is_loaded || !this.mixer) return;
        this.mixer.update(0.04);
    }
}

export default Script;
