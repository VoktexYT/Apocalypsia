import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../game/init-three'

import * as object from '../game/object'

import randomChoice from '../random.choice'

// Loader
import zombie_fbx_loader from '../load/object/object.zombie'
import MaterialTextureLoader from '../loader/material'

import * as ZOMBIE_MATERIAL from '../load/material/material.zombie'

interface properties {
    zombie_type: number,
    zombie_position: [number, number, number],
    zombie_scale: [number, number, number]
}


export default class Zombie {
    mesh: THREE.Group<THREE.Object3DEventMap> | null = null
    mixer: THREE.AnimationMixer | null = null

    last_action: THREE.AnimationAction | null = null
    is_finish_load = false

    animation_name = ""
    is_animation = false
    is_attack = false
    is_hurt = false
    is_play_animation_death = false
    is_death = false
    
    is_hurt_time = Date.now()
    is_death_time = Date.now()
    
    animationSpeed = 0
    health = 4
    damage = 0.4
    
    material = new CANNON.Material("zombie")
    body: CANNON.Body = new CANNON.Body({ mass: 1, fixedRotation: true })
    properties: properties
    material_change = true

    constructor(properties: properties) {
        this.properties = properties
    }

    setup_mesh() {
        const copy_original = zombie_fbx_loader.copy()
        if (!copy_original) return

        console.log("ORIGINAL: ", copy_original.scale)

        this.mesh = copy_original
        this.change_material(ZOMBIE_MATERIAL.material_zombie1_low)

        this.mesh.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2]
        )


        this.mesh.scale.set(
            this.properties.zombie_scale[0],
            this.properties.zombie_scale[1],
            this.properties.zombie_scale[2]
        )

        console.log("ORIGINAL: ", copy_original.scale)

            
            
            
        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const box_prop = new CANNON.Vec3(
            size.x / 4, 
            size.y / 2,
            size.z / 4
        )

        const shape = new CANNON.Box(box_prop);
        
        this.body.addShape(shape);
        this.body.material = this.material
        
        this.body.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2],
        )
                
        init.cannon_world.addBody(this.body);
        init.scene.add(this.mesh);
                
        this.is_finish_load = true
        console.info("[load]:", "Zombie is loaded")
    }

    change_material(new_material_loader: MaterialTextureLoader) {
        const mesh = this.mesh
        if (!mesh) return

        mesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return

            child.material = new_material_loader.material;
            child.material.transparent = false;
        })
    }

    play_animation(animationName: string, speed: number, is_loop?: boolean) {
        this.animationSpeed = speed
        if (Object.keys(zombie_fbx_loader.animations).includes(animationName) && this.mesh !== null) {
            const mixer = new THREE.AnimationMixer(this.mesh);
            const action = mixer.clipAction(zombie_fbx_loader.animations[animationName]);
            if (this.last_action !== null) {
                this.last_action.crossFadeTo(action, 0.5, false);
            }

            if (!is_loop) {
                action.clampWhenFinished = true
                action.setLoop(THREE.LoopOnce, 0)
            }

            action.play();
            
            this.last_action = action
            this.mixer = mixer;
        }
    }

    update_animation() {
        if (this.is_finish_load) {
            const zombieMesh = this.mesh;
            if (zombieMesh !== null) {
                if (this.mixer !== null) {
                    this.mixer.update(this.animationSpeed)
                }
            }
        }
    }

    attack_player() {
        object.player.set_health_point(-this.damage)
    }

    get_damage(damage: number) {
        if (this.is_death) return

        this.is_hurt = true
        this.is_hurt_time = Date.now()

        this.health -= damage

        if (this.health <= 0) {
            this.is_death = true
            this.is_death_time = Date.now()
        } else {
            this.animation_name = "gethit"
            this.play_animation(this.animation_name, 0.04)
        }
    }
    

    update() {
        if (!zombie_fbx_loader.finish_load) return
        if (!this.is_finish_load) {
            this.setup_mesh()
            this.is_finish_load = true
        }



        const mesh = this.mesh;
        const playerX = object.player.cylinderBody?.position.x;
        const playerZ = object.player.cylinderBody?.position.z;
        const zombieX = this.body.position.x;
        const zombieZ = this.body.position.z;
        if (!mesh || !playerX || !playerZ) return;
    
        const diffX = playerX - zombieX;
        const diffZ = playerZ - zombieZ;
    
        if (!this.is_attack && !this.is_hurt && !this.is_death) {
            // Adjust the position
            this.body.position.x += diffX / 400;
            this.body.position.z += diffZ / 400;
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
            if (player_dist < 2 && !this.is_death) {
                if (!this.animation_name.includes("attack")) {
                    this.is_attack = true
                    this.animation_name = "attack" + randomChoice(["1", "2", "3"])
                    this.play_animation(this.animation_name, 0.08, true)
                } else {
                    // this.attack_player()
                }
                
            } 
    
            else if (!this.is_hurt && !this.is_death) {
                if (this.animation_name !== "walk") {
                    this.is_attack = false
                    this.animation_name = "walk"
                    this.play_animation(this.animation_name, 0.04, true)
                }
            }

            else if (this.is_death && !this.is_play_animation_death) {
                if (!this.animation_name.includes("death")) {
                    this.body.sleep()
                    init.cannon_world.remove(this.body)
                    this.is_play_animation_death = true
                    this.animation_name = "death" + randomChoice(["1", "2"])
                    this.play_animation(this.animation_name, 0.08)
                }
            }
        }

        if (this.is_hurt) {
            if (Date.now() - this.is_hurt_time > 500) {
                this.is_hurt = false
            }
        }

        if (this.is_death && Date.now() - this.is_death_time > 3000) {
            const mesh = this.mesh
            if (!mesh) return
            init.scene.remove(mesh)
        }

        this.update_animation()

        // Obtimisation
        if (player_dist > 10 && !this.material_change) {
            this.material_change = true
            this.change_material(ZOMBIE_MATERIAL.material_zombie1_low)
        }
        
        if (player_dist <= 10 && this.material_change) {
            this.material_change = false
            this.change_material(ZOMBIE_MATERIAL.material_zombie1_high)
        }
    }
}