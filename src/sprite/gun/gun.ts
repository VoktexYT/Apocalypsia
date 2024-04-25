import * as THREE from 'three';

import * as object from '../../game/instances';
import * as init from '../../three/init-three';

import MaterialTextureLoader from '../../loader/material';
import ObjectLoader from '../../loader/object';



interface gun_settings 
{
    id: string,

    scale: [number, number, number],
    normal_position_radian: [number, number, number],
    normal_position_translate: [number, number, number],
    shooting_position_radian: [number, number, number],
    shooting_position_translate: [number, number, number],

    bullet_charge_max: number,
    bullet_charge_now: number,
    bulet_damage: number,
    fire_interval: number
    reload_interval: number,

    mesh?: THREE.Object3D | null,
    material?: MaterialTextureLoader | null,
    loader?: ObjectLoader | null
}


export default class Gun
{
    is_finish_load: boolean = false;
    is_shooting_position: boolean = false;
    is_fire: boolean = false;
    fire_backward: boolean = false;
    is_gun_used: boolean = false;

    is_pistol_weapon: boolean = false;
    fixed_rotation: boolean = true;

    mass: number = 1;
    backward_intensity: number = 0.1;
    movement: number = 0;
    mesh: THREE.Object3D | null | undefined = null;

    riffle_mesh: THREE.Object3D | null = null;
    pistol_mesh: THREE.Object3D | null = null;

    gun_loader = object.gunLoader;
    gun_loader_properties = this.gun_loader.properties;

    PISTOL: gun_settings = {
        id: "pistol",
        scale: [0.05, 0.05, 0.05],
        normal_position_radian: [Math.PI/2, Math.PI, 0],
        shooting_position_radian: [Math.PI/2, Math.PI, 0],
        normal_position_translate: [0.7, -0.8, -0.8],
        shooting_position_translate: [0, -0.55, -0.8],
        bullet_charge_max: 4,
        bullet_charge_now: 4,
        bulet_damage: 1,
        fire_interval: 600,
        reload_interval: 500
    };

    RIFLE: gun_settings = {
        id: "rifle",
        scale: [0.004, 0.004, 0.004],
        normal_position_radian: [Math.PI, -Math.PI/100, Math.PI],
        shooting_position_radian: [Math.PI, 0, Math.PI],
        normal_position_translate: [0, -0.8, -1],
        shooting_position_translate: [-0.55, -0.59, -1],
        bullet_charge_max: 10,
        bullet_charge_now: 10,
        bulet_damage: 0.5,
        reload_interval: 1000,
        fire_interval: 180
    };

    actual_settings: gun_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    
    /**
     * This function is used to set value to PISTOL and RIFLE Object and create mesh.
     * @returns Promise if mesh is load
     */
    async load() : Promise<void> 
    {
        return new Promise<void>(
            async (resolve) => 
            {
                this.PISTOL.loader = this.gun_loader_properties.pistol_loader;
                this.PISTOL.material = this.gun_loader_properties.pistol_material;
                this.PISTOL.mesh = this.gun_loader_properties.pistol_mesh;

                this.RIFLE.loader = this.gun_loader_properties.rifle_loader;
                this.RIFLE.material = this.gun_loader_properties.rifle_material;
                this.RIFLE.mesh = this.gun_loader_properties.rifle_mesh;
                
                this.actual_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;

                await this.setup_gun_mesh().then(
                    () => 
                    {
                        this.is_finish_load = true;
                        resolve();
                    }
                );
            }
        );
    }

    /**
     * This function is used to update actual settings var
     */
    private update_actual_settings() : void
    {
        this.actual_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    }

    /**
     * This function is used to move gun when player body or head is moving
     */
    private update_position() : void
    {
        if (!this.mesh) return;

        this.update_actual_settings();

        this.mesh.position.copy(object.player.camera.position);
        this.mesh.quaternion.copy(object.player.camera.quaternion);

        if (this.is_shooting_position)
        {
            const translateY = Math.sin(this.movement) / (200 - Number(object.player.is_moving) * 160);

            this.mesh.translateX(this.actual_settings.shooting_position_translate[0]);
            this.mesh.translateY(this.actual_settings.shooting_position_translate[1] + translateY);
            this.mesh.translateZ(this.actual_settings.shooting_position_translate[2]);
            this.mesh.rotateX(this.actual_settings.shooting_position_radian[0]);
            this.mesh.rotateY(this.actual_settings.shooting_position_radian[1]);
            this.mesh.rotateZ(this.actual_settings.shooting_position_radian[2]);
        } 
        
        else
        {
            const translateY =  Math.sin(this.movement) / (100 - Number(object.player.is_moving) * 80);
            this.mesh.translateX(this.actual_settings.normal_position_translate[0]);
            this.mesh.translateY(this.actual_settings.normal_position_translate[1] + translateY);
            this.mesh.translateZ(this.actual_settings.normal_position_translate[2]);
            this.mesh.rotateX(this.actual_settings.normal_position_radian[0]);
            this.mesh.rotateY(this.actual_settings.normal_position_radian[1]);
            this.mesh.rotateZ(this.actual_settings.normal_position_radian[2]);
        }

        if (this.fire_backward) 
        {
            if (this.is_pistol_weapon) 
            {
                this.mesh.translateY(this.backward_intensity);
            } 
            
            else 
            {
                this.mesh.translateZ(-this.backward_intensity);
            }
        }

        this.movement += 0.1;
    }


    /**
     * This is the update function of gun class
     */
    update() 
    {
        if (!this.is_finish_load) return;
        this.update_position();
    }

    /**
     * This function is used to switch gun : make a sound, set visible gun to true or false
     */
    switch_gun() 
    {
        this.is_pistol_weapon = !this.is_pistol_weapon;
        this.is_finish_load = false;

        const switch_weapons_sound = this.gun_loader_properties.switch_weapons_sound;

        if (switch_weapons_sound && !switch_weapons_sound?.isPlaying)
        {
            switch_weapons_sound?.play();
        }

        if (this.pistol_mesh && this.riffle_mesh) 
        {
            if (this.is_pistol_weapon)
            {
                this.pistol_mesh.visible = true;
                this.riffle_mesh.visible = false;
            } 
            
            else 
            {
                this.pistol_mesh.visible = false;
                this.riffle_mesh.visible = true;
            }
        }

        this.mesh = this.is_pistol_weapon ? this.pistol_mesh: this.riffle_mesh;
        this.is_finish_load = true;
    }

    /**
     * This function is used to create three gun mesh
     * @returns 
     */
    private async setup_gun_mesh() : Promise<void> 
    {
        return new Promise<void>(
            (resolve) => 
            {
                const pistol_mesh = this.PISTOL.mesh;
                const riffle_mesh = this.RIFLE.mesh;

                if (!pistol_mesh || !riffle_mesh) return;

                this.update_actual_settings()

                pistol_mesh.scale.set(
                    this.PISTOL.scale[0],
                    this.PISTOL.scale[1],
                    this.PISTOL.scale[2],
                )

                riffle_mesh.scale.set(
                    this.RIFLE.scale[0],
                    this.RIFLE.scale[1],
                    this.RIFLE.scale[2],
                )

                pistol_mesh.position.set(
                    0, -10, 0
                )

                riffle_mesh.position.set(
                    0, -10, 0
                )

                const pistol_material = this.PISTOL.material;
                const riffle_material = this.RIFLE.material;

                pistol_mesh.traverse(
                    (child) => 
                    {
                        if (!(child instanceof THREE.Mesh)) return;

                        if (pistol_material) 
                        {
                            child.material = pistol_material.material;
                            child.material.transparent = false;
                        }
                    }
                );
            
                riffle_mesh.traverse(
                    (child) => 
                    {
                        if (!(child instanceof THREE.Mesh)) return;

                        if (riffle_material) 
                        {
                            child.material = riffle_material.material;
                            child.material.transparent = false;
                        }
                    }
                );

                this.riffle_mesh = riffle_mesh;
                this.pistol_mesh = pistol_mesh;

                init.scene.add(pistol_mesh, riffle_mesh);
                

                if (this.is_pistol_weapon) 
                {
                    this.mesh = pistol_mesh;
                }
                
                else
                {
                    this.mesh = riffle_mesh;
                }

                resolve();
            }
        )
    }

    /**
     * This function is used to simulate a fire. Setup fire interval, reload. Make a sound and backward effect.
     */
    fire_event() 
    {
        this.is_gun_used = false;

        if (this.actual_settings.bullet_charge_now > 0) 
        {
            this.actual_settings.bullet_charge_now -= 1;
            this.is_fire = true;
            this.fire_backward = true;
            this.is_gun_used = true;
            object.player.flash_light.intensity = 2;

            setTimeout(
                () => 
                    {
                        this.is_fire = false;
                    },
                this.actual_settings.fire_interval
            );

            setTimeout(
                () => 
                    {
                        this.fire_backward = false;
                        object.player.flash_light.intensity = 1;
                    }, 
                100
            );

            
            const audio_loader = this.gun_loader_properties.audioLoader

            if (audio_loader) 
            {
                if (this.is_pistol_weapon) 
                {
                    audio_loader.load(
                        {
                            path: "./assets/sound/fire3.mp3",
                            is_loop: false,
                            volume: 0.8
                        }
                    );
                }
                    
                else 
                {
                    audio_loader.load(
                        {
                            path: "./assets/sound/fire2.mp3",
                            is_loop: false,
                            volume: 0.8
                        }
                    );
                }   
            }
        } 

        else
        {
            this.fire_backward = true;

            setTimeout(
                () => 
                    {
                        this.fire_backward = false;
                    }, 
                100
            );

            if (!this.gun_loader_properties.empty_weapons_sound?.isPlaying) 
            {
                this.gun_loader_properties.empty_weapons_sound?.play();
            }
        }
    }

    /**
     * This function is used to reload gun
     */
    reload_gun_event() 
    {
        setTimeout(
            () => 
                {
                    this.actual_settings.bullet_charge_now = this.actual_settings.bullet_charge_max
                }, 
            1100
        );

        if (!this.gun_loader_properties.reload_weapons_sound?.isPlaying) 
        {
            this.gun_loader_properties.reload_weapons_sound?.setPlaybackRate(0.8);
            this.gun_loader_properties.reload_weapons_sound?.play();
        }
    }
}
