import AudioLoader from '../../loader/audio';
import * as CANNON from 'cannon';
import clone from '../../module/skeleton.clone';
import * as init from '../../three/init-three';
import MaterialTextureLoader from '../../loader/material';
import * as instances from '../../game/instances';
import { randInt } from 'three/src/math/MathUtils';
import randomChoice from '../../module/random.choice';
import * as THREE from 'three';

import * as types from '../../type/types';



interface properties
{
    zombie_type: 1 | 2,

    zombie_position: [
        types.POSITIVE_NUMBER, 
        types.POSITIVE_NUMBER,
        types.POSITIVE_NUMBER
    ],

    zombie_scale: [
        types.POSITIVE_NUMBER,
        types.POSITIVE_NUMBER,
        types.POSITIVE_NUMBER
    ]
}

interface play_animation_properties
{
    name: string,
    speed: types.POSITIVE_NUMBER,
    is_loop: true | false
}


export default class Zombie 
{
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

    zombie_loader = instances.zombieLoader
    zombie_loader_properties = this.zombie_loader.properties

    COLLIDE_BOX: THREE.Mesh | null = null;

    size = new THREE.Vector3();

    audioLoader = new AudioLoader(instances.player.camera);

    cannon_shape = new CANNON.Box(new CANNON.Vec3());

    next_road_interval: number = 0;
    road_interval: number = Date.now();

    initialPosition = new THREE.Vector3().copy(this.object.position);

    first = true;


    constructor(properties: properties, public instances_mesh: THREE.InstancedMesh, public mesh_index: number, public object: THREE.Object3D) 
    {
        this.properties = properties;

        if (this.properties.zombie_type === 2) 
        {
            this.velocity = randInt(200, 400);
        }
    }

    /**
     * This function is used to setup zombie mesh
     */
    setup_mesh() : void
    {
        // MATERIAL
        if (this.properties.zombie_type === 1) 
        {
            const material = this.zombie_loader_properties.material_zombie1_low;

            if (material)
            {
                this.change_material(material);
            }
        } 
        
        else {
            const material = this.zombie_loader_properties.material_zombie2_low;

            if (material)
            {
                this.change_material(material);
            }
        }

        this.body.material = this.material;
        
        // SCALE
        const scale = this.properties.zombie_scale;
        this.object.scale.set(
            scale[0], 
            scale[1], 
            scale[2]
        );

        // POSITION
        this.body.position.set(
            this.properties.zombie_position[0],
            this.properties.zombie_position[1],
            this.properties.zombie_position[2],
        );

        this.object.position.copy(this.body.position);

        // SIZE
        const scaledGeometry = this.instances_mesh.geometry.clone();
        scaledGeometry.scale(this.object.scale.x, this.object.scale.y, this.object.scale.z);
        const boundingBox = new THREE.Box3().setFromObject(new THREE.Mesh(scaledGeometry));
        this.size.x = boundingBox.max.x - boundingBox.min.x;
        this.size.y = boundingBox.max.y - boundingBox.min.y;
        this.size.z = boundingBox.max.z - boundingBox.min.z;

        // SHAPE
        this.cannon_shape = new CANNON.Box(new CANNON.Vec3(
            this.size.x/2, this.size.y/2, this.size.z/2
        ));
        this.body.addShape(this.cannon_shape);

        // BOX
        this.COLLIDE_BOX = new THREE.Mesh(
            new THREE.BoxGeometry(this.size.x, this.size.y, this.size.z),
            new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.5 })
        )
        
        // ADD SCENE
        init.cannon_world.addBody(this.body);
                
        // const road_sound = this.zombie_loader_properties.road_sound;
        
        // if (road_sound)
        // {
        //     this.object.add(road_sound);
        // }

        this.is_finish_load = true;
        init.scene.add(this.COLLIDE_BOX)

        this.object.updateMatrix();
        this.instances_mesh.setMatrixAt(this.mesh_index, this.object.matrix);
    }

    /**
     * This function is used to get damage
     * @param damage nombre of damage point
     * @returns void if zombie is death
     */
    get_damage(damage: number) : void
    {
        if (this.is_death) return;

        this.is_hurt = true;
        this.is_hurt_time = Date.now();

        this.health -= damage;

        if (this.health <= 0) 
        {
            this.is_death = true;
            this.zombie_loader_properties.death_sound?.play()
            init.cannon_world.remove(this.body);
            this.is_death_time = Date.now();
        } 
        
        else 
        {
            this.animation_name = "gethit";
            this.play_animation(
                {
                    name: this.animation_name, 
                    speed: 0.04,
                    is_loop: false
                }
            );
        }
    }

    /**
     * This function is used to change zombie's textures
     */
    change_material(new_material_loader: MaterialTextureLoader) : void
    {
        // if (!this.instances_mesh) return
        // this.instances_mesh.material = new_material_loader.material;
        // this.instances_mesh.material.transparent = false;

        this.object.traverse(
            (child) => 
                {
                    if (!(child instanceof THREE.Mesh)) return;

                    child.material = new_material_loader.material;
                    child.material.transparent = false;
                }
        )
    }

    /**
     * This function is usd to play zombie animation 
     * @param animationName 
     * @param speed 
     * @param is_loop 
     */
    play_animation(settings: play_animation_properties) : void
    {
        this.animationSpeed = settings.speed;

        const objectLoader = this.zombie_loader_properties.objectLoader;

        const animation_is_exist = (objectLoader && Object.keys(objectLoader.animations).includes(settings.name));

        if (animation_is_exist && this.object) 
        {
            const mixer = new THREE.AnimationMixer(
                this.object
            );
            
            const action = mixer.clipAction(objectLoader.animations[settings.name]);

            if (this.last_action) 
            {
                this.last_action.crossFadeTo(action, 0.5, false);
            }

            if (!settings.is_loop) 
            {
                action.clampWhenFinished = true;
                action.setLoop(THREE.LoopOnce, 0);
            }

            action.play();
            
            this.last_action = action;
            this.mixer = mixer;
        }
    }

    /**
     * This function is used to update zombie animations
     */
    update_animation() : void
    {
        if (this.is_finish_load && ![this.object, this.mixer].includes(null)) 
        {
            this.mixer?.update(this.animationSpeed);
        }
    }

    /**
     * This function is used to make damage to player
     */
    attack_player() : void
    {
        let damage: number;

        if (this.properties.zombie_type === 2) 
        {
            damage = -this.damage/1.5;
        }
        
        else
        {
            damage = -this.damage
        }

        instances.player.increment_health_point(damage);
    }

    /**
     * This function is used to obtimise zombie texture.
     * When zombie is near of player, his texture will be high resolution
     * When zombie is far from the player, his texture will be low resolution
     * @param player_dist the player distance
     */
    update_textures(player_dist: number) : void
    {
        if (player_dist > this.obtimisation_range && !this.material_change) 
        {
            this.material_change = true;

            if (this.properties.zombie_type === 1) 
            {
                const material = this.zombie_loader_properties.material_zombie1_low;

                if (material)
                {
                    this.change_material(material);
                }
            } 
            
            else 
            {
                const material = this.zombie_loader_properties.material_zombie2_low;

                if (material) 
                {
                    this.change_material(material);
                }
            }
        }
        
        if (player_dist <= this.obtimisation_range && this.material_change)
        {
            this.material_change = false;

            if (this.properties.zombie_type === 1) 
            {
                const material = this.zombie_loader_properties.material_zombie1_high;
                if (material) 
                {
                    this.change_material(material);
                }
            } 
            
            else 
            {
                const material = this.zombie_loader_properties.material_zombie2_high;

                if (material)
                {
                    this.change_material(material);
                }
            }
        }
    }

    /**
     * This function is used to make a zombie sound
     */
    update_sound() : void
    {
        if (Date.now() - this.road_interval > this.next_road_interval && !this.is_death) 
        {
            this.road_interval = Date.now();
            this.next_road_interval = randInt(1000, 10000);
            const road_sound = this.zombie_loader_properties.road_sound;

            if (road_sound && !road_sound.isPlaying) 
            {
                road_sound.play();
            }
        }
    }

    /**
     * This function is used to rotateY zombie in the player direction
     * @param diffX distance x from player to zombie
     * @param diffZ distance z from player to zombie
     */
    update_rotation(diffX: number, diffZ: number) : void
    {
        if (!this.is_death) 
        {
            const angle = Math.atan2(diffX, diffZ);
            const angleInRange = (angle + Math.PI) % (2 * Math.PI) - Math.PI;

            this.body.quaternion.setFromAxisAngle(
                new CANNON.Vec3(0, 1, 0),
                angleInRange
            );

            this.object.quaternion.copy(this.body.quaternion);

            this.COLLIDE_BOX?.quaternion.copy(this.body.quaternion)
        }
    }

    /**
     * This function is used to player attack animation.
     * It plays correct animation for each zombie type 1, 2
     */
    play_attack_animation() : void
    {
        this.is_attack = true;
        this.animation_name = "attack" + randomChoice(["1", "2", "3"]);

        if (this.properties.zombie_type === 2) 
        {
            this.animation_name = "attack4";
            this.play_animation(
                {
                    name: this.animation_name,
                    speed: 0.12,
                    is_loop: true
                }
            );
        } 
        
        else 
        {
            this.play_animation(
                {
                    name: this.animation_name,
                    speed: 0.08,
                    is_loop: true
                }
            );
        }
    }

    /**
     * This function is used to play walk animation
     */
    play_walk_animation() : void
    {
        this.is_attack = false;
        this.animation_name = "walk";
        this.play_animation(
            {
                name: this.animation_name,
                speed: this.walk_animation_speed,
                is_loop: true
            }
        );
    }

    /**
     * This function is used to play death animation
     */
    play_death_animation() : void 
    {
        this.is_play_animation_death = true;
        this.animation_name = "death" + randomChoice(["1", "2"]);
        this.play_animation(
            {
                name: this.animation_name,
                speed: 0.08,
                is_loop: false
            }
        );
    }

    /**
     * This function is used to play animation when a even is true
     * @param player_dist This is the distance between zombie and player
     */
    update_animation_event(player_dist: number) : void
    {
        const zombie_distance_attack = this.properties.zombie_type === 1 ? 2: 4;

        if (player_dist < zombie_distance_attack  && !this.is_death) 
        {
            if (!this.animation_name.includes("attack")) 
            {
                this.play_attack_animation()
            } 
            
            else
            {
                this.attack_player();
            }
            
        }

        else if (!this.is_hurt && !this.is_death)
        {
            if (this.animation_name !== "walk")
            {
                this.play_walk_animation();
            }
        }

        else if (this.is_death && !this.is_play_animation_death)
        {
            if (!this.animation_name.includes("death")) 
            {
                this.play_death_animation();
            }
        }
    }

    /**
     * This function is used to put a little break when zombie take damage 500ms
     */
    update_hurt() : void
    {
        if (this.is_hurt) 
        {
            if (Date.now() - this.is_hurt_time > 500) 
            {
                this.is_hurt = false;
            }
        }
    }

    /**
     * This function is used to destroy zombie instance when it is killed
     * @returns void if the zombie object isn't exist
     */
    update_death() : void 
    {
        if (this.is_death && Date.now() - this.is_death_time > 3000) 
        {
            if (!this.object) return;
            init.scene.remove(this.object);
        }
    }

    /**
     * This function is used to update zombie position
     * @param diffX The distance of x axis between player and zombie
     * @param diffZ The distance of z axis between player and zombie
     */
    update_movement(diffX: number, diffZ: number) : void
    {
        if (!this.is_attack && !this.is_hurt && !this.is_death) 
        {
            this.body.position.x += diffX / this.velocity;
            this.body.position.z += diffZ / this.velocity;
        }

        // this.body.position.x += 0.05;
    
        this.object.position.set(
            this.body.position.x,
            this.body.position.y-1.2,
            this.body.position.z
        );

        if (this.COLLIDE_BOX)
        {
            this.COLLIDE_BOX.position.copy(this.body.position)
        }


    }

    /**
     * This function is used to update zombie mesh instance with object matrix properties
     */
    update_instance_mesh()
    {
        // this.object.updateMatrix();
        // this.object.updateMatrixWorld(true);
    }

    /**
     * This is the zombie update function
     * @returns 
     */
    update() : void
    {
        this.instances_mesh.getMatrixAt(this.mesh_index, this.object.matrix);
        this.object.matrix.decompose(this.object.position, this.object.quaternion, this.object.scale);

        const objectLoader = this.zombie_loader_properties.objectLoader;
        const player_body = instances.player.cannon_body;

        if (
            (objectLoader && !objectLoader.finishLoad) ||
            !this.is_finish_load ||
            !player_body || 
            !this.object
        ) return;

        const playerX = player_body.position.x;
        const playerZ = player_body.position.z;
        const zombieX = this.body.position.x;
        const zombieZ = this.body.position.z;

        const diffX = playerX - zombieX;
        const diffZ = playerZ - zombieZ;

        const player_dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffZ, 2));


        this.update_movement(diffX, diffZ);
        this.update_rotation(diffX, diffZ);

        this.update_hurt();
        this.update_death();
        this.update_animation_event(player_dist);
        this.update_textures(player_dist);
        this.update_sound();

        this.object.updateMatrix();
        this.instances_mesh.setMatrixAt(this.mesh_index, this.object.matrix);
    }
}