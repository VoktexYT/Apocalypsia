import * as THREE from 'three';

import * as object from '../../game/instances';
import * as init from '../../three/init-three';

import MaterialTextureLoader from '../../loader/material';
import ObjectLoader from '../../loader/object';



interface gun_settings {
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


export default class Gun {
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
        fire_interval: 150
    };

    actual_settings: gun_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    

    load() {
        this.PISTOL.loader = this.gun_loader_properties.pistol_loader;
        this.PISTOL.material = this.gun_loader_properties.material_pistol;
        this.PISTOL.mesh = this.gun_loader_properties.pistol_mesh;

        this.RIFLE.loader = this.gun_loader_properties.riffle_loader;
        this.RIFLE.material = this.gun_loader_properties.material_riffle;
        this.RIFLE.mesh = this.gun_loader_properties.riffle_mesh;
        
        this.actual_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    }

    private update_actual_settings() {
        this.actual_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    }


    update() {
        console.log(this.gun_loader_properties)
        const actual_settings_loader = this.actual_settings.loader;
        
        if (actual_settings_loader && !actual_settings_loader.finishLoad) return;
        if (!this.is_finish_load) this.setup_mesh();
        if (!this.mesh) return;
        
        this.mesh.position.copy(object.player.camera.position);
        this.mesh.quaternion.copy(object.player.camera.quaternion);

        if (this.is_shooting_position) {
            this.mesh.translateX(this.actual_settings.shooting_position_translate[0]);
            this.mesh.translateY(this.actual_settings.shooting_position_translate[1] + Math.sin(this.movement) / (200 - Number(object.player.is_moving) * 160));
            this.mesh.translateZ(this.actual_settings.shooting_position_translate[2]);
            this.mesh.rotateX(this.actual_settings.shooting_position_radian[0]);
            this.mesh.rotateY(this.actual_settings.shooting_position_radian[1]);
            this.mesh.rotateZ(this.actual_settings.shooting_position_radian[2]);
        } else {
            this.mesh.translateX(this.actual_settings.normal_position_translate[0]);
            this.mesh.translateY(this.actual_settings.normal_position_translate[1] + Math.sin(this.movement) / (100 - Number(object.player.is_moving) * 80));
            this.mesh.translateZ(this.actual_settings.normal_position_translate[2]);
            this.mesh.rotateX(this.actual_settings.normal_position_radian[0]);
            this.mesh.rotateY(this.actual_settings.normal_position_radian[1]);
            this.mesh.rotateZ(this.actual_settings.normal_position_radian[2]);
        }

        if (this.fire_backward) {
            if (this.is_pistol_weapon) {
                this.mesh.translateY(this.backward_intensity);
            } else {
                this.mesh.translateZ(this.backward_intensity);
            }
        }

        this.movement += 0.1;
    }

    private change_material(new_material_loader: MaterialTextureLoader) {
        const mesh = this.mesh;
        if (!mesh) return;

        mesh.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            child.material = new_material_loader.material;
            child.material.transparent = false;
        })
    }

    switch_gun() {        
        if (this.mesh) {
            this.is_pistol_weapon = !this.is_pistol_weapon;
            this.is_finish_load = false;
            init.scene.remove(this.mesh);

            const switch_weapons_sound = this.gun_loader_properties.switch_weapons_sound;
            if (switch_weapons_sound && !switch_weapons_sound?.isPlaying)
                switch_weapons_sound?.play();
        }
    }

    private setup_mesh() {
        this.mesh = this.is_pistol_weapon ? this.PISTOL.mesh: this.RIFLE.mesh;
        
        if (!this.mesh) return;

        console.log("SETUP GUN MESH")

        this.update_actual_settings();
        
        this.mesh.scale.set(
            this.actual_settings.scale[0],
            this.actual_settings.scale[1],
            this.actual_settings.scale[2],
        );
        
        const material = this.actual_settings.material;
        if (material)
            this.change_material(material);

        init.scene.add(this.mesh);
        this.is_finish_load = true;

        console.info("[load]:", "gun is loaded");
    }

    fire_event() {
        this.is_gun_used = false;

        if (this.actual_settings.bullet_charge_now > 0) {
            this.actual_settings.bullet_charge_now -= 1;
            this.is_fire = true;
            this.fire_backward = true;
            this.is_gun_used = true;
            object.player.flash_light.intensity = 2;

            setTimeout(() => {
                this.is_fire = false;
            }, this.actual_settings.fire_interval);

            setTimeout(() => {
                this.fire_backward = false;
                object.player.flash_light.intensity = 1;
            }, 100);

            
            const audio_loader = this.gun_loader_properties.audioLoader

            if (audio_loader) {
                if (this.is_pistol_weapon)
                    audio_loader.loadSound("./assets/sound/fire3.mp3", false, 0.8);
                else
                    audio_loader.loadSound("./assets/sound/fire2.mp3", false, 0.8);
            }
  
        } else {
            this.fire_backward = true;

            setTimeout(() => {
                this.fire_backward = false;
            }, 100);

            if (!this.gun_loader_properties.empty_weapons_sound?.isPlaying) {
                this.gun_loader_properties.empty_weapons_sound?.play();
            }
        }
    }

    reload_gun_event() {
        setTimeout(() => {
            this.actual_settings.bullet_charge_now = this.actual_settings.bullet_charge_max
        }, 1100);

        if (!this.gun_loader_properties.reload_weapons_sound?.isPlaying) {
            this.gun_loader_properties.reload_weapons_sound?.setPlaybackRate(0.8);
            this.gun_loader_properties.reload_weapons_sound?.play();
        }
    }
}
