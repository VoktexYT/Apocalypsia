import * as THREE from 'three'

import * as object from '../game/object'
import * as init from '../game/init-three';
import * as weapon_loader from '../load/object/object.gun'

import { material_pistol, material_rifle } from '../load/material/material.gun';

import MaterialTextureLoader from '../loader/material'
import FbxObjectLoader from '../loader/object'


interface gun_settings {
    scale:                        [number, number, number],
    normal_position_radian:       [number, number, number],
    normal_position_translate:    [number, number, number],
    shooting_position_radian:     [number, number, number],
    shooting_position_translate:  [number, number, number],

    bullet_charge_max: number,
    bullet_charge_now: number,
    fire_interval:     number

    loader: FbxObjectLoader,
    mesh: THREE.Object3D | null,
}

export default class Gun {
    is_finish_load:       boolean = false;
    is_shooting_position: boolean = false;
    is_fire:              boolean = false;
    fire_backward:        boolean = false;
    is_gun_used:          boolean = false;

    mass: number = 1
    fixed_rotation: boolean = true;

    backward_intensity: number = 0.1;

    PISTOL: gun_settings = {
        scale:                       [0.05, 0.05, 0.05],
        normal_position_radian:      [Math.PI/2, Math.PI, 0],
        shooting_position_radian:    [Math.PI/2, Math.PI, 0],
        normal_position_translate:   [0.7, -0.8, -0.8],
        shooting_position_translate: [0, -0.55, -0.8],
        bullet_charge_max: 4,
        bullet_charge_now: 4,
        fire_interval:     600,
        loader: weapon_loader.pistol_loader,
        mesh: null
    }

    RIFLE: gun_settings = {
        scale:                       [0.004, 0.004, 0.004],
        normal_position_radian:      [Math.PI, -Math.PI/100, Math.PI],
        shooting_position_radian:    [Math.PI, 0, Math.PI],
        normal_position_translate:   [0, -0.8, -1],
        shooting_position_translate: [-0.55, -0.59, -1],
        bullet_charge_max: 10,
        bullet_charge_now: 10,
        fire_interval:     150,
        loader: weapon_loader.pistol_loader,
        mesh: null
    }
    
    is_reload = false;
    movement: number = 0;

    mesh: THREE.Object3D | null = null;
    rifle_loader: FbxObjectLoader = weapon_loader.rifle_loader;
    rifle_mesh: THREE.Object3D | null = this.rifle_loader.getObject()

    has_pistol: boolean = false;
    actual_loader: FbxObjectLoader = this.has_pistol ? this.PISTOL.loader : this.rifle_loader;

    constructor() {
        this.setup_mesh()
    }

    update() {
        if (!this.actual_loader.isFinishedLoading()) return;
        if (!this.is_finish_load) this.setup_mesh();
        if (!this.mesh) return
        
        
        this.mesh.position.copy(object.player.camera.position);
        this.mesh.quaternion.copy(object.player.camera.quaternion);

        if (this.has_pistol) {
            if (this.is_shooting_position) {
                this.mesh.translateX(this.PISTOL.shooting_position_translate[0]);
                this.mesh.translateY(this.PISTOL.shooting_position_translate[1] + Math.sin(this.movement) / (200 - Number(object.player.is_moving) * 160));
                this.mesh.translateZ(this.PISTOL.shooting_position_translate[2]);
                this.mesh.rotateX(this.PISTOL.shooting_position_radian[0]);
                this.mesh.rotateY(this.PISTOL.shooting_position_radian[1]);
                this.mesh.rotateZ(this.PISTOL.shooting_position_radian[2]);
            } else {
                this.mesh.translateX(this.PISTOL.normal_position_translate[0]);
                this.mesh.translateY(this.PISTOL.normal_position_translate[1] + Math.sin(this.movement) / (100 - Number(object.player.is_moving) * 80));
                this.mesh.translateZ(this.PISTOL.normal_position_translate[2]);
                this.mesh.rotateX(this.PISTOL.normal_position_radian[0]);
                this.mesh.rotateY(this.PISTOL.normal_position_radian[1]);
                this.mesh.rotateZ(this.PISTOL.normal_position_radian[2]);
            }

            if (this.fire_backward) {
                this.mesh.translateY(this.backward_intensity);
            }
        } else {
            if (this.is_shooting_position) {
                this.mesh.translateX(this.RIFLE.shooting_position_translate[0]);
                this.mesh.translateY(this.RIFLE.shooting_position_translate[1] + Math.sin(this.movement) / (200 - Number(object.player.is_moving) * 50));
                this.mesh.translateZ(this.RIFLE.shooting_position_translate[2]);
                this.mesh.rotateX(this.RIFLE.shooting_position_radian[0]);
                this.mesh.rotateY(this.RIFLE.shooting_position_radian[1]);
                this.mesh.rotateZ(this.RIFLE.shooting_position_radian[2]);
            } else {
                this.mesh.translateX(this.RIFLE.normal_position_translate[0]);
                this.mesh.translateY(this.RIFLE.normal_position_translate[1] + Math.sin(this.movement) / (100 - Number(object.player.is_moving) * 80));
                this.mesh.translateZ(this.RIFLE.normal_position_translate[2]);
                this.mesh.rotateX(this.RIFLE.normal_position_radian[0]);
                this.mesh.rotateY(this.RIFLE.normal_position_radian[1]);
                this.mesh.rotateZ(this.RIFLE.normal_position_radian[2]);
            }

            if (this.fire_backward) {
                this.mesh.translateZ(this.backward_intensity);
            }
        }

        this.movement += 0.1;
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

    change_loader(new_loader: FbxObjectLoader) {
        if (this.mesh) {
            init.scene.remove(this.mesh)
            this.actual_loader = new_loader
            this.is_finish_load = false;
        }
    }

    switch_gun() {
        this.has_pistol = !this.has_pistol;

        if (this.has_pistol) {
            this.change_loader(this.PISTOL.loader);
        } else {
            this.change_loader(this.rifle_loader);
        }

    }

    setup_mesh() {
        this.mesh = this.actual_loader.getObject();

        if (!this.mesh) return;

        if (this.has_pistol) {
            this.mesh.scale.set(
                this.PISTOL.scale[0],
                this.PISTOL.scale[1],
                this.PISTOL.scale[2],
            );
            this.change_material(material_pistol);
        } else {
            this.mesh.scale.set(
                this.RIFLE.scale[0],
                this.RIFLE.scale[1],
                this.RIFLE.scale[2],
            );
            this.change_material(material_rifle);
        }


        init.scene.add(this.mesh);
        this.is_finish_load = true;

        console.info("[load]:", "gun is loaded");
    }

    fire_event() {
        this.is_gun_used = false;

        if (object.gun.has_pistol) {
            if (object.gun.PISTOL.bullet_charge_now > 0) {
                object.gun.PISTOL.bullet_charge_now -= 1;
                object.gun.is_fire = true;
                object.gun.fire_backward = true;
                object.player.flash_light.intensity = 2;
                this.is_gun_used = true;

                setTimeout(() => {
                    object.gun.is_fire = false;
                }, object.gun.PISTOL.fire_interval);
            }
        }

        else if (!object.gun.has_pistol) {
            if (object.gun.RIFLE.bullet_charge_now > 0) {
                object.gun.RIFLE.bullet_charge_now -= 1;
                object.gun.is_fire = true;
                object.gun.fire_backward = true;
                object.player.flash_light.intensity = 2;
                this.is_gun_used = true;

                setTimeout(() => {
                    object.gun.is_fire = false;
                }, object.gun.RIFLE.fire_interval);
            }
        }
    }
}
