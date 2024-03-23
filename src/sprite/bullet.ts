import * as THREE from 'three'
import * as CANNON from 'cannon'
import * as init from '../game/init-three'
import * as object from '../game/object'


export default class Bullet {
    velocity = 5
    color = 0x0000FF
    size = 0.1
    is_delete = false

    dirrection: THREE.Vector3
    mesh: THREE.Mesh
    boxBody: CANNON.Body
    boxMaterial: CANNON.Material

    constructor(position: Array<number>, direction: THREE.Vector3) {
        this.dirrection = direction

        // THREE.JS BOX
        const box = new THREE.BoxGeometry(this.size, this.size, this.size);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(box, material);

        // CANNON.JS BOX
        const boxShape = new CANNON.Box(new CANNON.Vec3(
            box.parameters.width/2 + 0.01,
            box.parameters.height/2 + 0.01,
            box.parameters.depth/2 + 0.01
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
            const zombiePosition = zombie.body.position;
            const bulletPosition = this.boxBody.position

            const distance = Math.sqrt(
                Math.pow(zombiePosition.x - bulletPosition.x, 2) + Math.pow(zombiePosition.z - bulletPosition.z, 2)
            )

            collisionDetected = distance < 1;

            if (collisionDetected) {
                break
            }
        }

        return collisionDetected;
    }

    update() {
        // UPDATE BULLET POSITION
        const dir_pos = this.dirrection.multiplyScalar(this.velocity)
        this.boxBody.position.x += dir_pos.x / 10;
        this.boxBody.position.y += dir_pos.y / 10;
        this.boxBody.position.z += dir_pos.z / 10;
        this.mesh.position.copy(this.boxBody.position)

        // CHECK IF BULLET COLLIDE WITH A ZOMBIE
        const intersectsZombie = this.checkCollisionWithZombie();
        if (intersectsZombie && !this.is_delete) {
            this.delete()
            
            for (const zombie of object.every_zombie) {
                zombie.get_damage(1)
            }
        }
    }
    
    delete() {
        init.scene.remove(this.mesh)
        init.cannon_world.remove(this.boxBody);
        this.is_delete = true

    }
}