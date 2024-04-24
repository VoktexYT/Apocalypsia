import * as THREE from 'three';
import Zombie from './zombie';
import { randInt } from 'three/src/math/MathUtils';



export class ZombieInstanceMesh {
    number_of_entities: number = 1
    instanced_mesh: THREE.InstancedMesh | null = null;

    all_zombies: Array<Zombie> = [];

    create() {
        const instanced_mesh = this.instanced_mesh;

        if (instanced_mesh) {
            for (let i = 0; i < this.number_of_entities; i++) {
                const matrix4 = new THREE.Matrix4();
                instanced_mesh.getMatrixAt(i, matrix4);

                const geometry = instanced_mesh.geometry
                geometry.applyMatrix4(matrix4)

                const mesh = new THREE.Mesh(geometry, instanced_mesh.material)

                const scale: number = randInt(13, 15) / 1000;
                const type: number = randInt(1, 2);
                const position: [number, number, number] = [randInt(-12, 8), 1, randInt(-1, 16)];

                const zombie = new Zombie({
                    zombie_type: type,
                    zombie_position: position,
                    zombie_scale: [
                        scale, 
                        scale, 
                        scale
                    ]
                }, mesh)

                zombie.setup_mesh();

                this.all_zombies.push(zombie);
            }
        }

        console.log(this.all_zombies)
    }
}
