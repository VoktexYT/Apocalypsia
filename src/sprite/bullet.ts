import * as THREE from 'three'
import * as CANNON from 'cannon'
import * as init from '../game/init-three'
import * as object from '../game/object'
import Zombie from './zombie'


export default class Bullet {
    velocity = 1
    color = 0xFFFF00
    opacity = 1
    size = 0.01
    is_delete = false

    fireTime = Date.now()

    dirrection: THREE.Vector3
    mesh: THREE.Mesh
    boxBody: CANNON.Body
    boxMaterial: CANNON.Material
    zombie_collide: Zombie | undefined

    constructor(position: Array<number>, direction: THREE.Vector3) {
        this.dirrection = direction

        // THREE.JS BOX
        const box = new THREE.BoxGeometry(this.size, this.size, this.size);
        const material = new THREE.MeshBasicMaterial({ color: this.color, opacity: this.opacity, transparent: true });
        this.mesh = new THREE.Mesh(box, material);

        // CANNON.JS BOX
        const boxShape = new CANNON.Box(new CANNON.Vec3(
            this.size/2, this.size/2, this.size/2
        ));

        this.boxMaterial = new CANNON.Material("bullet")
        this.boxMaterial.friction = 0
        this.boxMaterial.restitution = 0
        
        this.boxBody = new CANNON.Body({ 
            mass: 0,
            
            fixedRotation: true,
            shape: boxShape,
            material: this.boxMaterial
        });

        this.boxBody.collisionFilterGroup = (1 << 0)
        this.boxBody.collisionFilterMask = ~(1 << 0)

        this.boxBody.position.set(
            position[0],
            position[1],
            position[2],
        );

        // CREATE
        init.scene.add(this.mesh)
        init.cannon_world.addBody(this.boxBody);
        
        // SETUP CONTACT SETTINGS
        for (const zombie of object.every_zombie) {
            const contactMaterial = new CANNON.ContactMaterial(this.boxBody.material, zombie.body.material, { friction: 0, restitution: 0 }); // Define contact material
            init.cannon_world.addContactMaterial(contactMaterial);
        }
        
    }

    checkCollisionWithZombie(): boolean {
        let collisionDetected: boolean = false

        for (const zombie of object.every_zombie) {

            if (zombie.mesh && !zombie.is_death) {
                const bulletPos = this.boxBody.position
                const bulletSize = this.size / 2
                const zombiePos = zombie.body.position
                const zombieSize = zombie.size
                

                if (
                    (bulletPos.x-bulletSize < zombiePos.x+zombieSize.x/2 && bulletPos.x+bulletSize > zombiePos.x-zombieSize.x/2) &&
                    (bulletPos.y-bulletSize < zombiePos.y+zombieSize.y/2 && bulletPos.y+bulletSize > zombiePos.y-zombieSize.y/2) &&
                    (bulletPos.z-bulletSize < zombiePos.z+zombieSize.z/2 && bulletPos.z+bulletSize > zombiePos.z-zombieSize.z/2)
                ) {
                    this.zombie_collide = zombie
                    collisionDetected = true
                    break
                }
            }
        }

        return collisionDetected;
    }

    check_bullet_range() {
        
        if (Date.now() - this.fireTime > 1000) { // after 2 sec
            this.delete()
        }
    }

    update() {
        if (this.is_delete) return

        // UPDATE BULLET POSITION
        const dir_pos = this.dirrection.multiplyScalar(this.velocity)
        this.boxBody.position.x += dir_pos.x / 5;
        this.boxBody.position.y += dir_pos.y / 5;
        this.boxBody.position.z += dir_pos.z / 5;
        this.mesh.position.copy(this.boxBody.position)

        // CHECK IF BULLET COLLIDE WITH A ZOMBIE
        const intersectsZombie = this.checkCollisionWithZombie();
        if (intersectsZombie && !this.is_delete && this.zombie_collide) {
            this.delete()
            this.zombie_collide.get_damage(1)
            this.zombie_collide = undefined
        }

        this.check_bullet_range()
    }
    
    delete() {
    
        init.scene.remove(this.mesh)
        init.cannon_world.remove(this.boxBody);
        this.is_delete = true
    }
}