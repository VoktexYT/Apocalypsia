import * as THREE from 'three'
import * as setup from '../game/setup'
import Entity from './entity'


interface properties {
    zombie_type: number,
    zombie_velocity: number,
    zombie_health: number,
    zombie_name: string,
    zombie_position: [number, number, number],
    zombie_scale: [number, number, number]
}

export default class Zombie {
    is_finish_load: Boolean
    entity: Entity

    constructor(settings: properties) {
        this.is_finish_load = false

        const ZT = settings.zombie_type

        this.entity = new Entity()
            .set_velocity(settings.zombie_velocity)
            .set_health_point(settings.zombie_health)
            .set_name(settings.zombie_name)
            .set_position(settings.zombie_position[0], settings.zombie_position[1], settings.zombie_position[2])
            .set_scale(settings.zombie_scale[0], settings.zombie_scale[1], settings.zombie_scale[2])
            .set_textures({
                map:             `assets/entity/zombie/textures/${ZT}/${ZT}_Albedo.png`,
                emissiveMap:     `assets/entity/zombie/textures/${ZT}/${ZT}_Emission.png`,
                roughnessMap:    `assets/entity/zombie/textures/${ZT}/${ZT}_gloss.png`,
             displacementMap: `assets/entity/zombie/textures/${ZT}/${ZT}_Height.png`,
                metalnessMap:    `assets/entity/zombie/textures/${ZT}/${ZT}_metalik marmoset.png`,
                normalMap:       `assets/entity/zombie/textures/${ZT}/${ZT}_Normal.png`,
                aoMap:           `assets/entity/zombie/textures/${ZT}/${ZT}_Occlusion.png`
            })
        
        this.entity.load(
            "assets/entity/zombie/models/Base mesh fbx.fbx",
            [
                ["assets/entity/zombie/animation/zombie@atack1.fbx", "attack1"],
                ["assets/entity/zombie/animation/zombie@atack2.fbx", "attack2"],
                ["assets/entity/zombie/animation/zombie@atack3.fbx", "attack3"],
                ["assets/entity/zombie/animation/zombie@atack4.fbx", "attack4"],
                ["assets/entity/zombie/animation/zombie@death1.fbx", "death1"],
                ["assets/entity/zombie/animation/zombie@death2.fbx", "death2"],
                ["assets/entity/zombie/animation/zombie@gethit.fbx", "gethit"],
                ["assets/entity/zombie/animation/zombie@idle1.fbx", "idle1"],
                ["assets/entity/zombie/animation/zombie@idle2.fbx", "idle2"],
                ["assets/entity/zombie/animation/zombie@roar.fbx", "roar"],
                ["assets/entity/zombie/animation/zombie@walk.fbx", "walk"]
            ]
        ).then((finishLoad) => {
            this.is_finish_load = finishLoad;
        });
    }
}