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

function randomChoice<T>(items: T[]): T | undefined {
    if (items.length === 0) return undefined;
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}


export default class Zombie {
    is_finish_load: Boolean
    entity: Entity

    animation_name = ""
    is_animation = false

    is_attack = false

    damage = 0.4

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

    update_animation() {
        // Create zombie animations
        if (this.is_finish_load) {
            const zombieMesh = this.entity.get_mesh();
            if (zombieMesh !== null) {
                const mixer = this.entity.get_mixer();
                if (mixer !== null) {
                    mixer.update(0.04)
                }
            }
        }
    }

    attack_player() {
        object.player.set_health_point(-this.damage)
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
    
        if (!this.is_attack) {
            // Adjust the position
            this.body.position.x += diffX / 500;
            this.body.position.z += diffZ / 500;
        }

        mesh.position.set(
            this.body.position.x,
            this.body.position.y-1.2,
            this.body.position.z
        );

        // Ajust angle
        const angle = Math.atan2(diffX, diffZ);
        const angleInRange = (angle + Math.PI) % (2 * Math.PI) - Math.PI;
        this.body.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            angleInRange
        );

        mesh.quaternion.copy(this.body.quaternion);

        const player_dist = Math.sqrt(Math.pow(diffX, 2)+Math.pow(diffZ, 2))
        
        // Check if player is near
        if (this.is_finish_load) {
            if (player_dist < 2) {
                if (!this.animation_name.includes("attack")) {
                    this.is_attack = true
                    this.animation_name = "attack" + randomChoice(["1", "2", "3"])
                    this.entity.play_animation(this.animation_name)
                } else {
                    this.attack_player()
                }
                
            } 
    
            else {
                if (this.animation_name !== "walk") {
                    this.is_attack = false
                    this.animation_name = "walk"
                    this.entity.play_animation(this.animation_name)
                }
              
            }
        }



        this.update_animation()
        
    }
    
    
}