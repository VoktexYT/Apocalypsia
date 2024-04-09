import * as THREE from 'three'
import * as CANNON from 'cannon'
import * as init from '../game/init-three'
import * as object from '../game/object'
import Zombie from './zombie'


export default class Bullet {
    velocity:   number = 1
    slow:       number = 2
    color:      number = 0xFFFF00
    opacity:    number = 0
    size:       number = 0.01
    time_alive: number = 1000 // ms

    material_friction:    number = 0;
    material_restitution: number = 0;

    body_mass: number = 0;
    body_fixed_rotation: boolean = true;

    is_delete: boolean = false
    fireTime:  number  = Date.now()

    dirrection: THREE.Vector3
    mesh: THREE.Mesh
    boxBody: CANNON.Body
    zombie_collide: Zombie | undefined

    constructor(position: Array<number>, direction: THREE.Vector3) {
        this.dirrection = direction

        // Three.js box
        const box = new THREE.BoxGeometry( this.size, this.size, this.size );
        const material = new THREE.MeshBasicMaterial({ color: this.color, opacity: this.opacity, transparent: true });
        this.mesh = new THREE.Mesh(box, material);

        // Cannon.js Collide Box
        const shapeSize: number = this.size / 2;
        const shapeVec3 = new CANNON.Vec3( shapeSize, shapeSize, shapeSize);
        const boxShape = new CANNON.Box(shapeVec3);

        const boxMaterial = new CANNON.Material("bullet");
        boxMaterial.friction = this.material_friction;
        boxMaterial.restitution = this.material_restitution;
        
        this.boxBody = new CANNON.Body({ 
            mass:          this.body_mass,
            fixedRotation: this.body_fixed_rotation,
            shape:         boxShape,
            material:      boxMaterial
        });

        this.boxBody.collisionFilterGroup = (1 << 0)
        this.boxBody.collisionFilterMask = ~(1 << 0)

        this.boxBody.position.set(
            position[0],
            position[1],
            position[2],
        );

        // Init bullet
        init.scene.add(this.mesh)
        init.cannon_world.addBody(this.boxBody);
        
        // Set collide between bullet and zombies
        for (const zombie of object.every_zombie) {
            const contactMaterial = new CANNON.ContactMaterial(
                this.boxBody.material, 
                zombie.body.material, 
                {
                    friction: this.material_friction, 
                    restitution: this.material_restitution
                }
            );

            init.cannon_world.addContactMaterial(contactMaterial);
        }
        
    }

    checkCollisionWithZombie(): boolean {
        let collisionDetected: boolean = false;

        for (const zombie of object.every_zombie) {

            if (zombie.mesh && !zombie.is_death) {
                const bulletPos  = this.boxBody.position;
                const bulletSize = this.size / 2;
                const zombiePos  = zombie.body.position;
                const zombieSize = zombie.size;

                const is_collide = (
                    (bulletPos.x - bulletSize < zombiePos.x + zombieSize.x / 2 && bulletPos.x + bulletSize > zombiePos.x - zombieSize.x / 2) &&
                    (bulletPos.y-bulletSize < zombiePos.y + zombieSize.y / 2 && bulletPos.y + bulletSize > zombiePos.y - zombieSize.y / 2) &&
                    (bulletPos.z - bulletSize < zombiePos.z + zombieSize.z / 2 && bulletPos.z + bulletSize > zombiePos.z - zombieSize.z / 2)
                );

                if (is_collide) {
                    this.zombie_collide = zombie;
                    collisionDetected = is_collide;
                    break;
                }
            }
        }

        return collisionDetected;
    }

    check_bullet_range() {
        if (Date.now() - this.fireTime > this.time_alive)
            this.delete();
    }

    update() {
        if (this.is_delete) return;

        // Move bullet
        const dir_pos = this.dirrection.multiplyScalar(this.velocity);
        
        this.boxBody.position.x += dir_pos.x / this.slow;
        this.boxBody.position.y += dir_pos.y / this.slow;
        this.boxBody.position.z += dir_pos.z / this.slow;

        this.mesh.position.copy(this.boxBody.position);

        // Check collide with zombies
        const intersectsZombie = this.checkCollisionWithZombie();

        if (intersectsZombie && !this.is_delete && this.zombie_collide) {
            this.delete();
            this.zombie_collide.get_damage(1);
            this.zombie_collide = undefined;
        }

        this.check_bullet_range();
    }
    
    delete() {
        init.scene.remove(this.mesh);
        init.cannon_world.remove(this.boxBody);
        this.is_delete = true;
    }
}