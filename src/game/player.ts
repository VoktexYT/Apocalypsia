import * as THREE from 'three';
import * as CANNON from 'cannon';

import AudioLoader from '../loader/audio';
import Bullet from '../sprite/bullet';
import HtmlPage from '../html-page/html-page';
import * as init from '../three/init-three';
import * as object from './instances';
import randomChoice from '../module/random.choice';


export default class Player 
{
    public camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    public is_moving = false;
    public flash_light = new THREE.SpotLight(0xFF0000, 1);
    public cannon_body: CANNON.Body | null = null;
    
    
    private velocity = 0.1;

    private three_box_color = 0xFF0000;
    
    private health = 100;
    private max_health = 100;
    private previous_health = this.health;

    private size = [1, 2.4, 1];
    private spawn_position = [19.930721091735315, 1, 21.867035238570725];

    private head_move_intensity = 10;

    private camera_move_y = 0;

    private mesh = new THREE.Mesh();
    
    
    private angleX = THREE.MathUtils.degToRad(0);
    private angleY = THREE.MathUtils.degToRad(0);

    private axisX = new THREE.Vector3(1, 0, 0);
    private axisY = new THREE.Vector3(0, 1, 0);
    
    private quaternionX = new THREE.Quaternion();
    private quaternionY =  new THREE.Quaternion();
    private finalQuaternion = new THREE.Quaternion();
    
    private camera_is_enabled = false;
    private end_of_load = false;

    private cursor_page = new HtmlPage("cursor-page");
    private health_page = new HtmlPage("health-page");

    private all_bullets: Array<Bullet> = [];

    private flash_light_object = new THREE.Object3D();

    private audioLoader = new AudioLoader(this.camera);
    private every_music: Array<THREE.Audio> = [];

    private near_death_sound:     THREE.Audio | null = null;
    private walk_sound:   THREE.Audio | null = null;


    /**
     * This function is used to load player componants
     * @returns { Promise<void> } When every items was charged, return promise
     */
    load() : Promise<void> 
    {
        return new Promise<void>(
            (resolve)=> 
            {
                this.set_three_box();
                this.set_cannon_collide_box();
                // this.set_audio();
                this.set_flash_light();

                this.end_of_load = true;
                resolve();
            }
        );
    }
        

    /**
     * This function is used to load audio
     */
    set_audio() : void 
    {
        this.audioLoader.load(
            {
                path: "./assets/sound/nearDeath.mp3",
                is_loop: false,
                volume: 0.2
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.near_death_sound = sound;
                }
            }
        );
        
        this.audioLoader.load(
            {
                path: "./assets/sound/walk.mp3",
                is_loop: false,
                volume: 0.1
            },

            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.walk_sound = sound;
                }
            }
        );


        this.audioLoader.load(
            {
                path: "./assets/sound/backgroundMusic2.mp3",
                is_loop: false,
                volume: 0.3
            },
            
            (loaded, sound) => 
            {
                if (loaded && sound) {
                    this.every_music.push(sound);
                }
            }
        );

        this.audioLoader.load(
            {
                path: "./assets/sound/backgroundMusic3.mp3",
                is_loop: false,
                volume: 0.2
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.every_music.push(sound);
                }
            }
        );

        this.audioLoader.load(
            {
                path: "./assets/sound/backgroundMusic4.mp3",
                is_loop: false,
                volume: 0.2
            },
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.every_music.push(sound);
                }
            }
        );
    }

    /**
     * This function is used to create three.js box
     */
    set_three_box() : void 
    {
        const three_material = new THREE.MeshBasicMaterial({ color: this.three_box_color });
        const three_geometrie = new THREE.BoxGeometry(
            this.size[0], 
            this.size[1],
            this.size[2]
        );

        this.mesh = new THREE.Mesh(three_geometrie, three_material);
        init.scene.add(this.mesh);
    }

    /**
     * This function is used to create flash light
     */
    set_flash_light() : void
    {
        this.flash_light = new THREE.SpotLight(0xFF0000);

        this.flash_light.position.copy(this.camera.position);
        this.flash_light.intensity = 1;
        this.flash_light.distance = 20;
        this.flash_light.angle = Math.PI / 3.5;
        this.flash_light.penumbra = 1;
        this.flash_light.decay = 1;
        this.flash_light.castShadow = true;
        this.flash_light.shadow.mapSize.width = 1024;
        this.flash_light.shadow.mapSize.height = 1024;
        this.flash_light.shadow.camera.near = 500;
        this.flash_light.shadow.camera.far = 4000;
        this.flash_light.shadow.camera.fov = 30;
        this.flash_light.target = this.flash_light_object;

        init.scene.add(this.flash_light);
        init.scene.add(this.flash_light_object);
    }

    /**
     * This function is used to create Cannon.js box collide
     */
    set_cannon_collide_box() : void
    {
        const cannon_shape = new CANNON.Box(
            new CANNON.Vec3(
                this.size[0] / 2,
                this.size[1] / 2,
                this.size[2] / 2
            )
        );

        this.cannon_body = new CANNON.Body({ mass: 1, fixedRotation: true });
        this.cannon_body.position.set(
            this.spawn_position[0], 
            this.spawn_position[1], 
            this.spawn_position[2]
        );
        
        this.cannon_body.addShape(cannon_shape);

        init.cannon_world.addBody(this.cannon_body);

        this.mesh.position.copy(this.cannon_body.position);
    }

    /**
     * This function is used to play infinite background music
     * @returns void if music are not loaded
     */
    update_background_music() : void
    {
        if (this.every_music.length !== 3) return;

        const is_any_music_playing = this.every_music.some(m => m.isPlaying);

        if (!is_any_music_playing) 
        {
            const index = Math.floor(Math.random() * this.every_music.length);
            const randomMusic = this.every_music[index];
            randomMusic.play();
        }
    }

    /**
     * THis function is used to update position
     * @returns void if cannon.js body is not loaded
     */
    update_position() : void
    {
        if (this.cannon_body === null) return;

        this.mesh.position.copy(this.cannon_body.position);
        this.mesh.quaternion.copy(this.cannon_body.quaternion);

        const y_move = 1 + Math.sin(1.5 * this.camera_move_y) / this.head_move_intensity;

        this.camera.position.set(
            this.cannon_body.position.x,
            this.cannon_body.position.y + y_move,
            this.cannon_body.position.z,
        );

        this.flash_light.position.copy(this.camera.position);

        if (this.is_moving)
        {
            this.camera_move_y += 0.1;
        }
    }

    /**
     * This function is used to check if user cusor is on middle screen
     * @returns void if event is already played or the active camra is not player camera
     */
    cursor_page_event() : void
    {
        if (this.camera_is_enabled) return;

        const is_cursor_center_screen = (
            object.window_event.current_cursor_position[0] > (window.innerWidth / 2) - 10 &&
            object.window_event.current_cursor_position[0] < (window.innerWidth / 2) + 10 &&
            object.window_event.current_cursor_position[1] > (window.innerHeight / 2) - 10 &&
            object.window_event.current_cursor_position[1] < (window.innerHeight / 2) + 10
        );
        
        this.cursor_page.searchHTML();

        if (is_cursor_center_screen)
        {
            this.camera_is_enabled = true;
            this.cursor_page.disable();
        }

        else 
        {
            this.cursor_page.enable();
        }
    }

    /**
     * This function is used to get camera orientation and direction
     * @returns { THREE.Vector3 } Return camera orientation except y asis
     */
    get_dirrection() : THREE.Vector3
    {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.setY(0).normalize();
        return direction;
    }
    
    /**
     * This function is used to check user input and execute function for each key events
     */
    update_keyboard_event() : void 
    {
        const keyStates = object.window_event.key_states;
        const direction = this.get_dirrection();

        this.is_moving = false;

        const key_states_func = 
        {
            "KeyS": () => 
            {
                this.move_body_along_direction(
                    direction.clone().negate()
                );
            },

            "KeyA": () =>
            {
                this.move_body_along_direction(
                    new THREE.Vector3()
                    .crossVectors(
                        this.camera.up, 
                        direction
                    )
                );
            },

            "KeyW": () =>
            {
                this.move_body_along_direction(direction);
            },

            "KeyD": () =>
            {
                this.move_body_along_direction(
                    new THREE.Vector3()
                    .crossVectors(
                        this.camera.up, 
                        direction
                    ).negate()
                );
            },

            "KeyR": () =>
            {
                object.gun.reload_gun_event();
            },
        };



        for (let [key, value] of Object.entries(keyStates)) 
        {
            if (value && Object.keys(key_states_func).includes(key))
            {
                if (typeof key === "string")
                {
                    (key_states_func as 
                        { 
                            [key: string]: () => void
                        }
                    )[key]();
                }
            }
        }
        

        if (!this.is_moving)
        {
            this.walk_sound?.stop();
        }

        object.gun.is_shooting_position = keyStates['Space'];
    }

    /**
     * This function is used to check user input and execute function for each key events
     */
    update_mouse_event() : void
    {
        const mouseStates = object.window_event.mouse_state;

        if (mouseStates["left"])
        {
            this.shoot_event();
        }
    }

    
    /**
     * This function is used to move cannon body to a dirrection
     * @param direction The camera orientation
     * @returns void if cannon body isn't loaded
     */
    move_body_along_direction(direction: THREE.Vector3) : void
    {
        if (this.cannon_body === null) return
        
        this.is_moving = true;
        
        const dir_pos = direction.multiplyScalar(this.velocity);
        this.cannon_body.position.x += dir_pos.x;
        this.cannon_body.position.z += dir_pos.z;

        if (!this.walk_sound?.isPlaying) 
        {
            this.walk_sound?.setPlaybackRate(1.3);
            this.walk_sound?.play();
        }
    }


    /**
     * This function is used to make a shoot
     * @returns void if player isn't loaded or gun is firing
     */
    shoot_event() : void
    {
        if (object.gun.is_fire || !this.cannon_body || !object.gun.mesh) return;

        object.gun.fire_event();

        if (object.gun.is_gun_used) 
        {
            const position = this.camera.position;
            const direction = this.camera.getWorldDirection(new THREE.Vector3());

            let position_random = new THREE.Vector3(
                position.x, position.y, position.z
            );

            if (!object.gun.is_shooting_position) 
            {
                const posX = randomChoice([-0.5, -0.3, 0, 0.3, 0.5]);
                const posY = randomChoice([-0.5, -0.3, 0, 0.3, 0.5]);

                position_random.x += posX ? posX: 0;// random choice can be underfined ^ ^
                position_random.y += posY ? posY: 0;
            }

            this.all_bullets.push(
                new Bullet(
                [
                    position_random.x,
                    position_random.y,
                    position_random.z,
                ], 

                direction)
            );
        }
    }

    /**
     * This function is used to update flash light position
     */
    update_flash_light_position() : void
    {
        const distance = 1;
        const direction = new THREE.Vector3();

        this.camera.getWorldDirection(direction);

        const ray = new THREE.Ray(this.camera.position, direction);
        const newPosition = ray.at(distance, new THREE.Vector3());

        this.flash_light_object.position.copy(newPosition);
    }

    /**
     * This function is used to move camera in every direction
     * @returns void if the active camera isn't player camera
     */
    move_player_head() : void
    {
        if (!this.camera_is_enabled) return;
    
        const { current_cursor_position, previous_cursor_position, cursor_sensibility, smooth_factor } = object.window_event;
        const delta_x = (current_cursor_position[0] - previous_cursor_position[0]) * cursor_sensibility * smooth_factor;
        const delta_y = (current_cursor_position[1] - previous_cursor_position[1]) * cursor_sensibility * smooth_factor;
    
        this.angleY -= THREE.MathUtils.degToRad(delta_x);
        this.angleX -= THREE.MathUtils.degToRad(delta_y);
        
        const max_angle_x = THREE.MathUtils.degToRad(60);
        const min_angle_x = -max_angle_x;
        this.angleX = THREE.MathUtils.clamp(this.angleX, min_angle_x, max_angle_x);
    
        this.quaternionY.setFromAxisAngle(this.axisY, this.angleY);
        this.quaternionX.setFromAxisAngle(this.axisX, this.angleX);

        this.finalQuaternion.multiplyQuaternions(this.quaternionY, this.quaternionX);
    
        this.camera.quaternion.copy(this.finalQuaternion);
    }

    /**
     * This function is used to update actual health point
     * @param hp
     * @returns void if health page isn't loaded 
     */
    increment_health_point(health_point: number) : void
    {
        this.health_page.searchHTML();
        this.health_page.enable();
        const dom = this.health_page.dom_element;
        if (!dom) return;

        this.health += health_point;

        if (this.health < 0) 
        {
            this.health = 0;
            this.health_page.disable();
            init.change_game_running_to(false);
            window.location.reload();
        }

        else if (this.health > this.max_health) 
        {
            this.health = this.max_health;
        }

        else if (this.health < this.max_health && !this.near_death_sound?.isPlaying)
        {
            this.near_death_sound?.play();
        }
        
        const opacity_percent = (1 - this.health / this.max_health);
        dom.style.opacity = opacity_percent.toString();
    }

    /**
     * This function is used to auto regenerate player in the game
     */
    auto_regenerate() : void
    {
        if (this.previous_health === this.health && this.health < this.max_health)
        {
            this.increment_health_point(0.1);
        }
    }

    /**
     * This function is used to make a sound when user change weapon
     */
    update_change_weapon_sound() : void
    {
        const wheel_event = object.window_event.wheel_states

        if (wheel_event.up || wheel_event.down) 
        {
            wheel_event.up = false;
            wheel_event.down = false;
            object.gun.switch_gun();
        }
    }


    /**
     * This is the update function for player
     * @returns void if player isn't load
     */
    update() : void
    {
        if (!this.end_of_load) return;

        this.cursor_page_event();
        this.update_flash_light_position();
        this.update_position();

        this.update_keyboard_event();
        this.update_mouse_event();

        this.auto_regenerate();
        this.update_background_music();
        this.update_change_weapon_sound();
        
        this.all_bullets.forEach(
            (bullet) => 
            {
                bullet.update();
            }
        );

        this.previous_health = this.health;

    }
}
