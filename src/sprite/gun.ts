import * as THREE from 'three'
import * as object from '../game/object'
import Entity from './entity'


interface properties {
    gun_bullet_fire_max: number
    gun_bullet_charger_max: number
    gun_damage: number
    gun_position: [number, number, number],
    gun_scale: [number, number, number],
    gun_rotation_degres: [number, number, number]
}

export default class Gun {
    is_finish_load: Boolean
    entity: Entity
    settings: properties

    constructor(settings: properties) {
        this.is_finish_load = false
        this.settings = settings

        
        this.entity = new Entity()
            .set_position(settings.gun_position[0], settings.gun_position[1], settings.gun_position[2])
            .set_scale(settings.gun_scale[0], settings.gun_scale[1], settings.gun_scale[2])
            .set_textures({
                map: "./assets/weapons/pistol/textures/Pistol_map.png",
                metalnessMap: "./assets/weapons/pistol/textures/Pistol_metalness.png",
                normalMap: "./assets/weapons/pistol/textures/Pistol_normalmap.png",
                roughnessMap: "./assets/weapons/pistol/textures/Pistol_roughness.png"
            })
        
        this.entity.load(
            "./assets/weapons/pistol/models/pistol.fbx",
            [
                // ["assets/weapons/pistol/models/pistol_animation.fbx", "pow"]
            ]
        ).then((finishLoad) => {
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

    update() {
        const mesh = this.entity.get_mesh();
        if (mesh != null) {
            // Mettre à jour la position et la rotation du gun en fonction de la caméra et du joueur
            mesh.position.copy(object.player.camera.position);
            mesh.quaternion.copy(object.player.camera.quaternion);

            mesh.translateZ(0)
            mesh.translateY(-1)
            mesh.translateX(1)
            mesh.rotateX(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[0]))
            mesh.rotateY(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[1]))
            mesh.rotateZ(THREE.MathUtils.degToRad(this.settings.gun_rotation_degres[2]))


            // Appliquer un décalage pour positionner le gun par rapport au joueur
            mesh.translateY(-1); // Par exemple, ajustez cette valeur en fonction de la position relative du gun par rapport au joueur
        }
    }
}
