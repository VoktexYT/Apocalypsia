import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../game/init-three'

import * as object from '../game/object'

import randomChoice from '../random.choice'
import clone from '../skeleton.clone'

// Loader
import zombie_fbx_loader from '../load/object/object.zombie'
import MaterialTextureLoader from '../loader/material'
import AudioLoader from '../loader/audio'


import * as ZOMBIE_MATERIAL from '../load/material/material.zombie'
import { randInt } from 'three/src/math/MathUtils'

interface properties {
    zombie_type: number,
    zombie_position: [number, number, number],
    zombie_scale: [number, number, number]
}


export default class Zombie {
    mesh: THREE.Object3D | null = null;
    mixer: THREE.AnimationMixer | null = null;

    last_action: THREE.AnimationAction | null = null;
    is_finish_load = false;

    is_make_sound = false;

    walk_animation_speed = randInt(4, 10) / 100;

    animation_name = "";
    is_animation = false;
    is_attack = false;
    is_hurt = false;
    is_play_animation_death = false;
    is_death = false;
    
    is_hurt_time = Date.now();
    is_death_time = Date.now();
    
    animationSpeed = 0;
    health = randInt(3, 6);
    damage = randInt(0.4, 0.6);
    velocity = randInt(300, 500);

    obtimisation_range = 5;
    
    material = new CANNON.Material("zombie");
    body: CANNON.Body = new CANNON.Body({ mass: 1, fixedRotation: true });
    properties: properties;
    material_change = true;

    COLLIDE_BOX: THREE.Mesh;
    size = new THREE.Vector3();

    audioLoader = new AudioLoader(object.player.camera);
    zombie_death_sound: THREE.Audio | null = null;

    cannon_shape = new CANNON.Box(new CANNON.Vec3());

    constructor(properties: properties) {
        this.properties = properties;
        this.COLLIDE_BOX = new THREE.Mesh();

        this.set_sound();
    }

    set_sound() {
        this.audioLoader.loadSound("./assets/sound/zombie_death.mp3", false, 0.3, (loader, sound) => {
            if (loader && sound) {
                this.zombie_death_sound = sound;
            }
        })
    }

    get_damage(damage: number) {
        if (this.is_death) return;

        this.is_hurt = true;
        this.is_hurt_time = Date.now();

        this.health -= damage;

        if (this.health <= 0) {
            this.is_death = true;
            
            this.zombie_death_sound?.play();

            init.cannon_world.remove(this.body);
            init.scene.remove(this.COLLIDE_BOX);

            this.is_death_time = Date.now();
        } else {
            this.animation_name = "gethit";
            this.play_animation(this.animation_name, 0.04);
        }
    }

    setup_mesh() {
        const copy_original = zombie_fbx_loader.getObject();
        if (!copy_original) return;

        this.mesh = clone(copy_original);
        
        if (this.properties.zombie_type === 1) {
            this.change_material(ZOMBIE_MATERIAL.material_zombie1_low);
        } else {
            this.change_material(ZOMBIE_MATERIAL.material_zombie2_low);
        }

        this.mesh.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2]
        );
        
        const scale = this.properties.zombie_scale;
        this.mesh.scale.set(scale[0], scale[1], scale[2]);

        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        boundingBox.getSize(this.size);

        this.size.x /= 2;

        this.cannon_shape = new CANNON.Box(new CANNON.Vec3(
            this.size.x/2, this.size.y/2, this.size.z/2
        ));
        
        this.body.addShape(this.cannon_shape);

        this.body.material = this.material;
        
        this.body.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2],
        );
                
        init.cannon_world.addBody(this.body);
        init.scene.add(this.mesh);

        // DEBUG
        const BOX = new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z);
        const MATERIAL = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 0 });
        this.COLLIDE_BOX = new THREE.Mesh(BOX, MATERIAL);
        this.COLLIDE_BOX.position.copy(this.body.position);
        init.scene.add(this.COLLIDE_BOX);
                
        this.is_finish_load = true;

        console.info("[load]:", "Zombie is loaded");
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
        if (Object.keys(zombie_fbx_loader.getAnimations()).includes(animationName) && this.mesh !== null) {
            const mixer = new THREE.AnimationMixer(this.mesh);
            
            const action = mixer.clipAction(zombie_fbx_loader.getAnimations()[animationName]);
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
    

    update() {
        if (!zombie_fbx_loader.isFinishedLoading()) return
        if (!this.is_finish_load) {
            this.setup_mesh()
            this.is_finish_load = true
        }

        const player_body = object.player.cannon_body
        const mesh = this.mesh;

        if (!player_body || !mesh) return
        
        this.COLLIDE_BOX.position.copy(this.body.position)
        this.COLLIDE_BOX.quaternion.copy(this.body.quaternion)

        const playerX = player_body.position.x;
        const playerZ = player_body.position.z;
        const zombieX = this.body.position.x;
        const zombieZ = this.body.position.z;

    
        const diffX = playerX - zombieX;
        const diffZ = playerZ - zombieZ;
    
        if (!this.is_attack && !this.is_hurt && !this.is_death) {
            this.body.position.x += diffX / this.velocity;
            this.body.position.z += diffZ / this.velocity;
        }

        mesh.position.set(
            this.body.position.x,
            this.body.position.y-1.2,
            this.body.position.z
        );

        // Ajust angle
        if (!this.is_death) {
            const angle = Math.atan2(diffX, diffZ);
            const angleInRange = (angle + Math.PI) % (2 * Math.PI) - Math.PI;
            this.body.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                angleInRange
            );

            mesh.quaternion.copy(this.body.quaternion);
        }
        
        const player_dist = Math.sqrt(Math.pow(diffX, 2)+Math.pow(diffZ, 2))

        // Check if player is near
        if (this.is_finish_load) {
            
            if (player_dist < 2 && !this.is_death) {
                if (!this.animation_name.includes("attack")) {
                    this.is_attack = true
                    this.animation_name = "attack" + randomChoice(["1", "2", "3"])
                    this.play_animation(this.animation_name, 0.08, true)
                } else {
                    this.attack_player()
                }
                
            } 
    
            else if (!this.is_hurt && !this.is_death) {
                if (this.animation_name !== "walk") {
                    this.is_attack = false
                    this.animation_name = "walk"
                    this.play_animation(this.animation_name, this.walk_animation_speed, true)
                }
            }

            else if (this.is_death && !this.is_play_animation_death) {
                if (!this.animation_name.includes("death")) {
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

        // Texture obtimisation
        if (player_dist > this.obtimisation_range && !this.material_change) {
            this.material_change = true
            if (this.properties.zombie_type === 1) {
                this.change_material(ZOMBIE_MATERIAL.material_zombie1_low)
            } else {
                this.change_material(ZOMBIE_MATERIAL.material_zombie2_low)
            }
        }
        
        if (player_dist <= this.obtimisation_range && this.material_change) {
            this.material_change = false
            if (this.properties.zombie_type === 1) {
                this.change_material(ZOMBIE_MATERIAL.material_zombie1_high)
            } else {
                this.change_material(ZOMBIE_MATERIAL.material_zombie2_high)
            }
        }
    }
}