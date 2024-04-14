import * as THREE from 'three';

import * as object from '../game/object';
import * as init from '../game/init-three';
import * as weapon_loader from '../load/object/object.gun';

import { material_pistol, material_rifle } from '../load/material/material.gun';

import MaterialTextureLoader from '../loader/material';
import FbxObjectLoader from '../loader/object';
import AudioLoader from '../loader/audio';


interface gun_settings {
    id: string,

    scale: [number, number, number],
    normal_position_radian: [number, number, number],
    normal_position_translate: [number, number, number],
    shooting_position_radian: [number, number, number],
    shooting_position_translate: [number, number, number],

    bullet_charge_max: number,
    bullet_charge_now: number,
    fire_interval: number
    reload_interval: number,

    loader: FbxObjectLoader,
    mesh: THREE.Object3D | null,
    material: MaterialTextureLoader
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
    mesh: THREE.Object3D | null = null;

    audioLoader = new AudioLoader(object.player.camera);

    reload_weapons_sound: THREE.Audio | null = null;
    switch_weapons_sound: THREE.Audio | null = null;
    empty_weapons_sound:  THREE.Audio | null = null;
    fire_weapons_sound:   THREE.Audio | null = null;


    PISTOL: gun_settings = {
        id: "pistol",
        scale: [0.05, 0.05, 0.05],
        normal_position_radian: [Math.PI/2, Math.PI, 0],
        shooting_position_radian: [Math.PI/2, Math.PI, 0],
        normal_position_translate: [0.7, -0.8, -0.8],
        shooting_position_translate: [0, -0.55, -0.8],
        bullet_charge_max: 4,
        bullet_charge_now: 4,
        fire_interval: 600,
        reload_interval: 500,
        loader: weapon_loader.pistol_loader,
        mesh: weapon_loader.pistol_loader.mesh,
        material: material_pistol
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
        reload_interval: 1000,
        fire_interval: 150,
        loader: weapon_loader.rifle_loader,
        mesh: weapon_loader.rifle_loader.mesh,
        material: material_rifle
    };
    
    actual_settings: gun_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;

    private update_actual_settings() {
        this.actual_settings = this.is_pistol_weapon ? this.PISTOL : this.RIFLE;
    }

    constructor() {
        this.set_audio();
    }

    update() {
        if (!this.actual_settings.loader.finishLoad) return;
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
            if (!this.switch_weapons_sound?.isPlaying)
                this.switch_weapons_sound?.play();
        }
    }

    private setup_mesh() {
        this.mesh = this.is_pistol_weapon ? this.PISTOL.loader.mesh: this.RIFLE.loader.mesh;
        if (!this.mesh) return;

        this.update_actual_settings();
        
        this.mesh.scale.set(
            this.actual_settings.scale[0],
            this.actual_settings.scale[1],
            this.actual_settings.scale[2],
        );
        
        this.change_material(this.actual_settings.material);

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

            this.audioLoader.loadSound("./assets/sound/fire.mp3", false, 0.8);
        } else {
            this.fire_backward = true;

            setTimeout(() => {
                this.fire_backward = false;
            }, 100);

            if (!this.empty_weapons_sound?.isPlaying) {
                this.empty_weapons_sound?.play();
            }
        }
    }

    reload_gun_event() {
        setTimeout(() => {
            this.actual_settings.bullet_charge_now = this.actual_settings.bullet_charge_max
        }, 1100);

        if (!this.reload_weapons_sound?.isPlaying) {
            this.reload_weapons_sound?.setPlaybackRate(0.8);
            this.reload_weapons_sound?.play();
        }
    }

    set_audio() {
        this.audioLoader.loadSound("./assets/sound/switchWeapon.mp3", false, 0.4, (loaded, sound) => {
            if (loaded && sound) {
                this.switch_weapons_sound = sound;
            }
        });

        this.audioLoader.loadSound("./assets/sound/empty-gun.mp3", false, 0.4, (loaded, sound) => {
            if (loaded && sound) {
                this.empty_weapons_sound = sound;
            }
        });

        this.audioLoader.loadSound("./assets/sound/reload-gun.mp3", false, 0.6, (loaded, sound) => {
            if (loaded && sound) {
                this.reload_weapons_sound = sound;
            }
        });

        this.audioLoader.loadSound("./assets/sound/fire.mp3", false, 0.8, (loaded, sound) => {
            if (loaded && sound) {
                this.fire_weapons_sound = sound;
            }
        })
    }
}
