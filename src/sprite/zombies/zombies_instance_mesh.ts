import * as THREE from 'three';
import Zombie from './zombie';
import { randInt } from 'three/src/math/MathUtils';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

import * as instances from '../../game/instances';

import * as types from '../../type/types';

import * as init from '../../three/init-three';



export class ZombieInstanceMesh 
{
    number_of_entities: number = 10
    instanced_mesh: THREE.InstancedMesh | null = null;
    all_zombies: Array<Zombie> = [];
    object: THREE.Object3D = new THREE.Object3D();

    is_load = false;
    is_create = false;

    /**
     * This function is used to laod instances mesh of zombie
     */
    load()
    {
        // get Geometry, Material, number of zombie
        const number_of_zombies = this.number_of_entities;
        const material = instances.zombieLoader.properties.material_zombie1_low?.material;

        const geometries: THREE.BufferGeometry[] = [];
        let geometry: THREE.BufferGeometry | undefined;

        const zombie_fbx = instances.zombieLoader.properties.fbx;
        if (zombie_fbx) 
        {
            zombie_fbx.traverse(
                (child) =>
                    {
                        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) 
                        {
                            geometries.push(child.geometry);
                        }
                    }
            );
        }

        if (geometries.length > 0)
        {
            geometry = mergeGeometries(geometries);
        }

        this.instanced_mesh = new THREE.InstancedMesh(geometry, material, number_of_zombies);
        this.is_load = true;
    }

    /**
     * This function is used to create an instances
     */
    create()
    {
        const instanced_mesh = this.instanced_mesh;
        
        if (instanced_mesh) 
        {
            instanced_mesh.frustumCulled = false;
            init.scene.add(instanced_mesh);

            for (let i = 0; i < this.number_of_entities; i++) 
            {
                const matrix4 = new THREE.Matrix4();
                instanced_mesh.getMatrixAt(i, matrix4);

                const geometry = instanced_mesh.geometry
                geometry.applyMatrix4(matrix4)

                const scale: number = randInt(13, 15) / 1000;
                const type = randInt(1, 2);
                const position: [number, number, number] = [randInt(-12, 8), 2, randInt(-1, 16)];

                if (type === 1 || type === 2)
                {
                    const zombie = new Zombie(
                        {
                            zombie_type: type,
                            // zombie_position: [17, 2, 14],
                            zombie_position: position,
                            zombie_scale: [
                                scale, 
                                scale, 
                                scale
                            ]
                        },
                        instanced_mesh,
                        i,
                        this.object
                    );

                    zombie.setup_mesh();
                    this.all_zombies.push(zombie);
                }
            }
        }
        this.is_create = true;
    }

    /**
    //  * This function is used to update instances mesh
     */
    update()
    {
        if (this.is_load && this.is_create && this.instanced_mesh)
        {
            this.instanced_mesh.instanceMatrix.needsUpdate = true;
        }
    }
}
