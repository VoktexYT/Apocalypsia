import Zombie from '../sprite/zombie'
import Player from '../sprite/player'
import Gun from '../sprite/gun';
import WindowEvent from './window-event';
import Floor from '../sprite/floor';

import * as init from './init-three'


// export const zombie = new Zombie({
//     zombie_type: 2,
//     zombie_position: [0, 0.2, 0],
//     zombie_scale: [0.02, 0.02, 0.02]
// });


export const player = new Player()


// export const gun = new Gun({
//     gun_bullet_charger_max: 10,
//     gun_bullet_fire_max: 5,
//     gun_damage: 1,
//     gun_position: [0, 2, 0],
//     gun_scale: [0.05, 0.05, 0.05],
//     gun_rotation_degres: [90,  180, 0]
// })


export const window_event = new WindowEvent(
    init.activeCamera,
    init.renderer,
    player
)


export const floor = new Floor()


export const FINISH_EVERY_LOADS = () => {
    const all_load = [
        // zombie.is_finish_load,
        player.is_finish_load,
        // gun.is_finish_load,
        floor.is_finish_load
    ]
    
    return all_load.every(val => val === true)
};
