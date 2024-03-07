import * as THREE from 'three'
import Entity from './entity'


export default class Zombie {
    private scene: THREE.Scene
    is_finish_load: Boolean
    entity: Entity

    constructor(scene: THREE.Scene, velocity: number, hp: number, name: string, start_pos: [number, number, number], scale: [number, number, number]) {
        this.scene = scene
        this.is_finish_load = false

        this.entity = new Entity()
            .set_velocity(velocity)
            .set_health_point(hp)
            .set_name(name)
            .set_position(start_pos[0], start_pos[1], start_pos[2])
            .set_scale(scale[0], scale[1], scale[2])
            .set_textures({
                map:             "assets/entity/zombie/textures/2_Albedo.png",
                emissiveMap:     "assets/entity/zombie/textures/2_Emission.png",
                roughnessMap:    "assets/entity/zombie/textures/2_gloss.png",
                displacementMap: "assets/entity/zombie/textures/2_Height.png",
                metalnessMap:    "assets/entity/zombie/textures/2_metalik marmoset.png",
                normalMap:       "assets/entity/zombie/textures/2_Normal.png",
                aoMap:           "assets/entity/zombie/textures/2_Occlusion.png"
            })
        
        this.entity.load(
            this.scene,
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