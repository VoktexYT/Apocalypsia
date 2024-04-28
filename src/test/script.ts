import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import MaterialLoader from '../loader/material';
import { randInt } from 'three/src/math/MathUtils';


class Script {
    private number_of_zombies = 1000;
    private loader = new FBXLoader();
    private mesh: THREE.InstancedMesh | undefined;

    private zombie = new THREE.Object3D();

    private is_loaded: boolean = false;

    constructor
    (
        private scene: THREE.Scene, 
        private renderer: THREE.WebGLRenderer,
        private axes_helper: THREE.AxesHelper,
    )
    {
        this.renderer.setClearColor(0xFFFFFF);
    }

    start()
    {
        this.loader.load("./assets/entity/zombie/models/Base mesh fbx.fbx", (fbx) => {        

            // Load Geometry
            const geometries: Array<THREE.BufferGeometry> = [];
            fbx.traverse((child) => {
                if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
                    geometries.push(child.geometry);
                }
            });
            const geometry: THREE.BufferGeometry = mergeGeometries(geometries);

            // Load Material
            const root_path = "./assets/entity/zombie/textures/";
            const material: THREE.Material = new MaterialLoader({
                map:             root_path + `1/LOW/1_Albedo.png`,
                emissiveMap:     root_path + `1/LOW/1_Emission.png`,
                roughnessMap:    root_path + `1/LOW/1_gloss.png`,
                displacementMap: root_path + `1/LOW/1_Height.png`,
                metalnessMap:    root_path + `1/LOW/1_metalik marmoset.png`,
                normalMap:       root_path + `1/LOW/1_Normal.png`,
                aoMap:           root_path + `1/LOW/1_Occlusion.png`
            }).material;
        
            // Setup Mesh
            this.mesh = new THREE.InstancedMesh(geometry, material, this.number_of_zombies);
            this.scene.add(this.mesh);
            this.is_loaded = true;

            for (let i=0; i<this.number_of_zombies; i++)
            {
                this.zombie.scale.x = 0.01;
                this.zombie.scale.y = 0.01;
                this.zombie.scale.z = 0.01;

                this.zombie.position.x = Math.random() * 200 - 100;
                this.zombie.position.y = 0;
                this.zombie.position.z = Math.random() * 200 - 100;

                this.zombie.updateMatrix()
                this.mesh.setMatrixAt(i, this.zombie.matrix)
            }
        });
    }

    update() 
    {
        if (!this.is_loaded || !this.mesh) return;

        for (let i = 0; i < this.number_of_zombies; i++) {
            this.mesh.getMatrixAt(i, this.zombie.matrix);
            this.zombie.matrix.decompose(this.zombie.position, this.zombie.quaternion, this.zombie.scale);
            
            this.zombie.position.z += 0.01
            
            this.zombie.updateMatrix();
            this.mesh.setMatrixAt(i, this.zombie.matrix);
        }
    
        this.mesh.instanceMatrix.needsUpdate = true;
    }
}


export default Script;
