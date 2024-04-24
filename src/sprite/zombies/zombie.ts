import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../../three/init-three'

import * as object from '../../game/instances'

import clone from '../../module/skeleton.clone'



// Loader
import MaterialTextureLoader from '../../loader/material'
import AudioLoader from '../../loader/audio'


import { randInt } from 'three/src/math/MathUtils'
import randomChoice from '../../module/random.choice'


interface properties {
    zombie_type: number,
    zombie_position: [number, number, number],
    zombie_scale: [number, number, number]
}


export default class Zombie {
    mixer: THREE.AnimationMixer | null = null;

    last_action: THREE.AnimationAction | null = null;
    is_finish_load = false;

    walk_animation_speed = randInt(4, 10) / 100;

    animation_name = "";
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

    zombie_loader = object.zombieLoader
    zombie_loader_properties = this.zombie_loader.properties

    // COLLIDE_BOX: THREE.Mesh;
    size = new THREE.Vector3();

    audioLoader = new AudioLoader(object.player.camera);

    cannon_shape = new CANNON.Box(new CANNON.Vec3());

    next_road_interval: number = 0;

    road_interval: number = Date.now();

    constructor(properties: properties, public mesh: THREE.Mesh) {
        this.properties = properties;

        if (this.properties.zombie_type === 2) {
            this.velocity = randInt(200, 400);
        }
    }

    get_damage(damage: number) {
        if (this.is_death) return;

        this.is_hurt = true;
        this.is_hurt_time = Date.now();

        this.health -= damage;

        if (this.health <= 0) {
            this.is_death = true;
            this.zombie_loader_properties.death_sound?.play()
            init.cannon_world.remove(this.body);
            this.is_death_time = Date.now();
        } else {
            this.animation_name = "gethit";
            this.play_animation(this.animation_name, 0.04);
        }
    }

    setup_mesh() {
        if (this.properties.zombie_type === 1) {
            const material = this.zombie_loader_properties.material_zombie1_low;
            if (material)
                this.change_material(material);
        } else {
            const material = this.zombie_loader_properties.material_zombie2_low;
            if (material)
                this.change_material(material);
        }

        this.mesh.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2]
        );
        
        const scale = this.properties.zombie_scale;
        this.mesh.scale.set(scale[0], scale[1], scale[2]);

        // frustumCulled
        this.mesh.frustumCulled = true;

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
                
        
        const road_sound = this.zombie_loader_properties.road_sound;
        
        if (road_sound)
            this.mesh.add(road_sound);

        this.is_finish_load = true;
    }

    change_material(new_material_loader: MaterialTextureLoader) {
        if (!this.mesh) return

        this.mesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;

            child.material = new_material_loader.material;
            child.material.transparent = false;
        })
    }

    play_animation(animationName: string, speed: number, is_loop?: boolean) {
        this.animationSpeed = speed;
        const objectLoader = this.zombie_loader_properties.objectLoader;

        if (objectLoader && Object.keys(objectLoader.animations).includes(animationName) && this.mesh !== null) {
            const mixer = new THREE.AnimationMixer(
                this.mesh
            );
            
            const action = mixer.clipAction(objectLoader.animations[animationName]);

            if (this.last_action !== null) {
                this.last_action.crossFadeTo(action, 0.5, false);
            }

            if (!is_loop) {
                action.clampWhenFinished = true;
                action.setLoop(THREE.LoopOnce, 0);
            }

            console.log("ACTION PLAY: ", action)

            action.play();
            
            this.last_action = action;
            this.mixer = mixer;
        }
    }

    update_animation() {
        if (this.is_finish_load && ![this.mesh, this.mixer].includes(null)) {
            this.mixer?.update(this.animationSpeed);
        }
    }

    attack_player() {
        let damage: number;

        if (this.properties.zombie_type === 2) {
            damage = -this.damage/1.5;
        } else {
            damage = -this.damage
        }

        object.player.set_health_point(damage);
    }

    update_textures(player_dist: number) {
        if (player_dist > this.obtimisation_range && !this.material_change) {
            this.material_change = true;
            if (this.properties.zombie_type === 1) {
                const material = this.zombie_loader_properties.material_zombie1_low;

                if (material)
                    this.change_material(material);
            } else {
                const material = this.zombie_loader_properties.material_zombie2_low;

                if (material)
                    this.change_material(material);
            }
        }
        
        if (player_dist <= this.obtimisation_range && this.material_change) {
            this.material_change = false;
            if (this.properties.zombie_type === 1) {
                const material = this.zombie_loader_properties.material_zombie1_high;
                if (material)
                    this.change_material(material);
            } else {
                const material = this.zombie_loader_properties.material_zombie2_high;

                if (material)
                    this.change_material(material);
            }
        }
    }

    update_sound() {
        if (Date.now() - this.road_interval > this.next_road_interval && !this.is_death) {
            this.road_interval = Date.now();
            this.next_road_interval = randInt(1000, 10000);
            const road_sound = this.zombie_loader_properties.road_sound;

            if (road_sound && !road_sound.isPlaying) {
                road_sound.play()
            }
        }
    }

    update_rotation(diffX: number, diffZ: number, mesh: THREE.Object3D) {
        if (!this.is_death) {
            const angle = Math.atan2(diffX, diffZ);
            const angleInRange = (angle + Math.PI) % (2 * Math.PI) - Math.PI;
            this.body.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                angleInRange
            );
            mesh.quaternion.copy(this.body.quaternion);
        }
    }
    
    update() {
        const objectLoader = this.zombie_loader_properties.objectLoader;
        const player_body = object.player.cannon_body;
        const mesh = this.mesh;

        if (objectLoader && !objectLoader.finishLoad) return;

        if (!this.is_finish_load) {
            return
        }

        if (!player_body || !mesh) return;

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

        this.update_rotation(diffX, diffZ, mesh)
        
        const player_dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffZ, 2));
        const zombie_distance_attack = this.properties.zombie_type === 1 ? 2: 4;

        if (player_dist < zombie_distance_attack  && !this.is_death) {
            if (!this.animation_name.includes("attack")) {
                this.is_attack = true;
                this.animation_name = "attack" + randomChoice(["1", "2", "3"]);

                if (this.properties.zombie_type === 2) {
                    this.animation_name = "attack4";
                    this.play_animation(this.animation_name, 0.12, true);
                } else {
                    this.play_animation(this.animation_name, 0.08, true);
                }


            } else {
                this.attack_player();
            }
            
        } 

        else if (!this.is_hurt && !this.is_death) {
            if (this.animation_name !== "walk") {
                this.is_attack = false;
                this.animation_name = "walk";
                this.play_animation(this.animation_name, this.walk_animation_speed, true);
            }
        }

        else if (this.is_death && !this.is_play_animation_death) {
            if (!this.animation_name.includes("death")) {
                this.is_play_animation_death = true;
                this.animation_name = "death" + randomChoice(["1", "2"]);
                this.play_animation(this.animation_name, 0.08);
            }
        }

        if (this.is_hurt) {
            if (Date.now() - this.is_hurt_time > 500) {
                this.is_hurt = false;
            }
        }

        if (this.is_death && Date.now() - this.is_death_time > 3000) {
            const mesh = this.mesh;
            if (!mesh) return;
            init.scene.remove(mesh);
        }

        this.update_animation();
        // this.update_textures(player_dist);
        // this.update_sound()
        
    }
}