import * as THREE from 'three'
import * as CANNON from 'cannon';

import * as object from '../game/object'
import * as init from '../game/init-three';

import * as weapon_loader from '../load/object/object.gun'

import { material_gun, material_riffle } from '../load/material/material.gun';
import MaterialTextureLoader from '../loader/material'

import FbxObjectLoader from '../loader/object'



interface properties {
    gun_bullet_fire_max:    number
    gun_bullet_charger_max: number
    gun_damage:             number
    gun_position:        [number, number, number],
    gun_scale:           [number, number, number],
    gun_rotation_degres: [number, number, number]
}

export default class Gun {
    is_finish_load:       boolean = false;
    is_shooting_position: boolean = false;
    is_fire:              boolean = false;
    fire_backward:        boolean = false;

    every_loaded:         boolean = false;

    mass: number = 1
    fixed_rotation: boolean = true;

    pistol_scale: Array<number> = [0.05, 0.05, 0.05];
    riffle_scale: Array<number> = [0.004, 0.004, 0.004];

    pistol_normal_rad = [Math.PI / 2, Math.PI, 0];
    pistol_shooting_rad = [Math.PI / 2, Math.PI, 0];

    riffle_normal_rad = [Math.PI, -Math.PI / 100, Math.PI];
    riffle_shooting_rad = [Math.PI, 0, Math.PI];

    pistol_bullet_charge_max = 4
    pistol_bullet_charge_now = 4
    
    riffle_bullet_charge_max = 10
    riffle_bullet_charge_now = 10

    pistol_fire_interval = 600;
    riffle_fire_interval = 150;

    is_reload = false;


    settings: properties;

    movement: number = 0;

    material = new CANNON.Material("gun");

    mesh: THREE.Object3D | null = null;
    size = new THREE.Vector3();
    cannon_shape: CANNON.Shape | null = null;
    cannon_body: CANNON.Body = new CANNON.Body({ mass: this.mass, fixedRotation: this.fixed_rotation });

    gun_loader: FbxObjectLoader = weapon_loader.gun_loader;
    riffle_loader: FbxObjectLoader = weapon_loader.riffle_loader;
    actual_loader: FbxObjectLoader = this.riffle_loader;
    is_gun_loader: boolean = true;


    constructor(settings: properties) {
        this.settings = settings;
        this.setup_mesh()
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
        this.is_gun_loader = !this.is_gun_loader;

        if (this.is_gun_loader) {
            this.change_loader(this.gun_loader);
        } else {
            this.change_loader(this.riffle_loader);
        }

    }

    setup_mesh() {
        this.mesh = this.actual_loader.getObject();

        if (!this.mesh) return;

        if (this.is_gun_loader) {
            this.mesh.scale.set(
                this.pistol_scale[0],
                this.pistol_scale[1],
                this.pistol_scale[2],
            );
            this.change_material(material_gun);
        } else {
            this.mesh.scale.set(
                this.riffle_scale[0],
                this.riffle_scale[1],
                this.riffle_scale[2],
            );
            this.change_material(material_riffle);
        }


        init.scene.add(this.mesh);
        this.is_finish_load = true;

        console.info("[load]:", "gun is loaded");
    }


    update() {
        if (!this.actual_loader.isFinishedLoading()) return;

        if (!this.is_finish_load) {
            this.setup_mesh();

            if (!this.every_loaded) {
                this.switch_gun();
                this.every_loaded = true;
            } else {
                this.is_finish_load = true;
            }
        }

        if (!this.mesh) return
        
        this.mesh.position.copy(object.player.camera.position);
        this.mesh.quaternion.copy(object.player.camera.quaternion);

        if (this.is_gun_loader) {
            if (!this.is_shooting_position) {
                this.mesh.translateZ(-0.8)
                this.mesh.translateX(0.7);
    
                if (object.player.is_moving) {
                    this.mesh.translateY(-0.8 + Math.sin(this.movement) / 20);
                } else {
                    this.mesh.translateY(-0.8 + Math.sin(this.movement) / 100);
                }
    
                this.mesh.rotateX(this.pistol_normal_rad[0]);
                this.mesh.rotateY(this.pistol_normal_rad[1]);
                this.mesh.rotateZ(this.pistol_normal_rad[2]);
            }
    
            else {
                this.mesh.translateZ(-0.8);
                this.mesh.translateX(0);
    
                if (object.player.is_moving) {
                    this.mesh.translateY(-0.55 + Math.sin(this.movement) / 40)
                } else {
                    this.mesh.translateY(-0.55 + Math.sin(this.movement) / 200)
                }
    
                this.mesh.rotateX(this.pistol_shooting_rad[0]);
                this.mesh.rotateY(this.pistol_shooting_rad[1]);
                this.mesh.rotateZ(this.pistol_shooting_rad[2]);
            }

            if (this.fire_backward) {
                this.mesh.translateY(0.1);
            }
        } else {
            if (!this.is_shooting_position) {
                this.mesh.translateZ(-1);
                this.mesh.translateX(0.6);
    
                if (object.player.is_moving) {
                    this.mesh.translateY(-0.8 + Math.sin(this.movement) / 20);
                } else {
                    this.mesh.translateY(-0.8 + Math.sin(this.movement) / 100);
                }
    
                this.mesh.rotateX(this.riffle_normal_rad[0]);
                this.mesh.rotateY(this.riffle_normal_rad[1]);
                this.mesh.rotateZ(this.riffle_normal_rad[2]);
            }
    
            else {
                this.mesh.translateZ(-1)
                this.mesh.translateX(0.05);
    
                if (object.player.is_moving) {
                    this.mesh.translateY(-0.59 + Math.sin(this.movement) / 40)
                } else {
                    this.mesh.translateY(-0.59 + Math.sin(this.movement) / 200)
                }

                this.mesh.rotateX(this.riffle_shooting_rad[0]);
                this.mesh.rotateY(this.riffle_shooting_rad[1]);
                this.mesh.rotateZ(this.riffle_shooting_rad[2]);
            }

            if (this.fire_backward) {
                this.mesh.translateZ(-0.1);
            }
        }

        this.movement += 0.1;
    }
}
