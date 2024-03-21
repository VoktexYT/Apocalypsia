import * as THREE from 'three'
import * as setup from '../game/init-three'
import * as init from '../game/init-three'
import * as object from '../game/object'
import Entity from './entity'
import * as CANNON from 'cannon'


interface properties {
    zombie_type: number,
    zombie_position: [number, number, number],
    zombie_scale: [number, number, number]
}

export default class Zombie {
    is_finish_load: Boolean
    entity: Entity

    animation_name = ""

    body: CANNON.Body = new CANNON.Body({ mass: 1, fixedRotation: true })

    constructor(settings: properties) {
        this.is_finish_load = false

        const ZT = settings.zombie_type

        this.entity = new Entity()
            .set_position(settings.zombie_position[0], settings.zombie_position[1], settings.zombie_position[2])
            .set_scale(settings.zombie_scale[0], settings.zombie_scale[1], settings.zombie_scale[2])
            .set_textures({
                map:             `./assets/entity/zombie/textures/${ZT}/${ZT}_Albedo.png`,
                emissiveMap:     `./assets/entity/zombie/textures/${ZT}/${ZT}_Emission.png`,
                roughnessMap:    `./assets/entity/zombie/textures/${ZT}/${ZT}_gloss.png`,
             displacementMap:    `./assets/entity/zombie/textures/${ZT}/${ZT}_Height.png`,
                metalnessMap:    `./assets/entity/zombie/textures/${ZT}/${ZT}_metalik marmoset.png`,
                normalMap:       `./assets/entity/zombie/textures/${ZT}/${ZT}_Normal.png`,
                aoMap:           `./assets/entity/zombie/textures/${ZT}/${ZT}_Occlusion.png`
            })
        
        this.entity.load(
            "assets/entity/zombie/models/Base mesh fbx.fbx",
            [
                ["./assets/entity/zombie/animation/zombie@atack1.fbx", "attack1"],
                ["./assets/entity/zombie/animation/zombie@atack2.fbx", "attack2"],
                ["./assets/entity/zombie/animation/zombie@atack3.fbx", "attack3"],
                ["./assets/entity/zombie/animation/zombie@atack4.fbx", "attack4"],
                ["./assets/entity/zombie/animation/zombie@death1.fbx", "death1"],
                ["./assets/entity/zombie/animation/zombie@death2.fbx", "death2"],
                ["./assets/entity/zombie/animation/zombie@gethit.fbx", "gethit"],
                ["./assets/entity/zombie/animation/zombie@idle1.fbx", "idle1"],
                ["./assets/entity/zombie/animation/zombie@idle2.fbx", "idle2"],
                ["./assets/entity/zombie/animation/zombie@roar.fbx", "roar"],
                ["./assets/entity/zombie/animation/zombie@walk.fbx", "walk"]
            ]
        ).then((finishLoad) => {
            const mesh = this.entity.get_mesh()
            if (!mesh) return

            this.is_finish_load = finishLoad;

            const boundingBox = new THREE.Box3().setFromObject(mesh);
            const size = new THREE.Vector3();
            const scale = mesh.scale
            boundingBox.getSize(size);

            const box_prop = new CANNON.Vec3(
                size.x / 4, 
                size.y / 2,
                size.z / 4
            )

            const shape = new CANNON.Box(box_prop);
        
            this.body.addShape(shape);

            this.body.position.set(-2, 1, -2)

            init.cannon_world.addBody(this.body);

            console.info("[load]:", "Zombie is loaded")
        });
    }

    update() {
        const mesh = this.entity.get_mesh();
        const playerX = object.player.cylinderBody?.position.x;
        const playerZ = object.player.cylinderBody?.position.z;
        const zombieX = this.body.position.x;
        const zombieZ = this.body.position.z;
        if (!mesh || !playerX || !playerZ) return;
    
        const diffX = playerX - zombieX;
        const diffZ = playerZ - zombieZ;
    
        // Adjust the position
        this.body.position.x += diffX / 500;
        this.body.position.z += diffZ / 500;
    
        const angle = Math.atan2(diffX, diffZ);
    
        const angleInRange = (angle + Math.PI) % (2 * Math.PI) - Math.PI;
    
        // Update the quaternion
        this.body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            angleInRange
        );
    
        // Update the mesh position
        mesh.position.set(
            this.body.position.x,
            this.body.position.y-1.2, // Keep the y position of the mesh aligned with the collision box
            this.body.position.z
        );
        mesh.quaternion.copy(this.body.quaternion);

        const player_dist = Math.sqrt(Math.pow(diffX, 2)+Math.pow(diffZ, 2))
    }
    
    
}