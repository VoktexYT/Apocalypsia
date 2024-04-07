import * as THREE from 'three'
import * as CANNON from 'cannon';

import * as object from '../game/object'
import * as init from '../game/init-three';
import Entity from './entity'

import gun_loader from '../load/object/object.gun'
import { material_gun } from '../load/material/material.gun';
import MaterialTextureLoader from '../loader/material'



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

    mass: number = 1
    fixed_rotation: boolean = true;

    entity: Entity;
    settings: properties;

    material = new CANNON.Material("gun");

    mesh: THREE.Object3D | null = null;
    size = new THREE.Vector3();
    cannon_shape: CANNON.Shape | null = null;
    cannon_body: CANNON.Body = new CANNON.Body({ mass: this.mass, fixedRotation: this.fixed_rotation });


    constructor(settings: properties) {
        this.settings = settings;
        
        this.entity = new Entity()
            .set_position(settings.gun_position[0], settings.gun_position[1], settings.gun_position[2])
            .set_scale(settings.gun_scale[0], settings.gun_scale[1], settings.gun_scale[2])
            .set_textures({
                map: "./assets/weapons/pistol/textures/Pistol_map.png",
                metalnessMap: "./assets/weapons/pistol/textures/Pistol_metalness.png",
                normalMap: "./assets/weapons/pistol/textures/Pistol_normalmap.png",
                roughnessMap: "./assets/weapons/pistol/textures/Pistol_roughness.png"
            })
        
        this.entity.load("./assets/weapons/pistol/models/pistol.fbx", []).then((finishLoad) => {
            this.is_finish_load = finishLoad;

            const mesh = this.entity.get_mesh()
            if (mesh != null) {
                mesh.rotateX(THREE.MathUtils.degToRad(settings.gun_rotation_degres[0]))
                mesh.rotateY(THREE.MathUtils.degToRad(settings.gun_rotation_degres[1]))
                mesh.rotateZ(THREE.MathUtils.degToRad(settings.gun_rotation_degres[2]))
            }

            console.info("[load]:", "Gun is loaded")
        });
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

    setup_mesh() {
        this.mesh = gun_loader.getObject();
        if (!this.mesh) return;

        const position = this.settings.gun_position
        this.mesh.position.set(position[0], position[1], position[2]);
        
        const scale = this.settings.gun_scale;
        this.mesh.scale.set(scale[0], scale[1], scale[2]);
        
        const degres: [number, number, number] = this.settings.gun_rotation_degres;
        this.mesh.rotateX(THREE.MathUtils.degToRad(degres[0]));
        this.mesh.rotateY(THREE.MathUtils.degToRad(degres[1]));
        this.mesh.rotateZ(THREE.MathUtils.degToRad(degres[2]));

        const boundingBox = new THREE.Box3().setFromObject(this.mesh);
        boundingBox.getSize(this.size);

        this.change_material(material_gun);

        this.size.x /= 2;

        this.cannon_shape = new CANNON.Box(new CANNON.Vec3(
            this.size.x/2, this.size.y/2, this.size.z/2
        ));
        
        this.cannon_body.addShape(this.cannon_shape);

        this.cannon_body.material = this.material;
        
        this.cannon_body.position.set(position[0], position[1], position[2])
                
        init.cannon_world.addBody(this.cannon_body);
        init.scene.add(this.mesh);

        this.is_finish_load = true;

        console.info("[load]:", "gun is loaded")
    }


    update() {
        if (!gun_loader.isFinishedLoading()) return;
        if (!this.is_finish_load) {
            this.setup_mesh();
            this.is_finish_load = true;
        }

        const mesh = this.entity.get_mesh();
        if (!mesh) return
        
        mesh.position.copy(object.player.camera.position);
        mesh.quaternion.copy(object.player.camera.quaternion);
        

        if (!this.is_shooting_position) {
            mesh.translateZ(0)
            mesh.translateY(-1)
            mesh.translateX(1)
            mesh.rotateX(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[0]))
            mesh.rotateY(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[1]))
            mesh.rotateZ(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[2]))
            mesh.translateY(-1)
        }

        else {
            mesh.translateZ(-0.3)
            mesh.translateY(-0.55)
            mesh.translateX(0)
            mesh.rotateX(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[0]))
            mesh.rotateY(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[1]))
            mesh.rotateZ(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[2]))
            mesh.translateY(-0.55)
        }
    }
}
