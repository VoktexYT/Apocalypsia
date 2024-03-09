import Zombie from '../sprite/zombie'
import Player from './player'
import * as setup from './setup'


export const zombie = new Zombie({
    zombie_type: 2,
    zombie_velocity: 0.01,
    zombie_health: 100,
    zombie_name: "z1",
    zombie_position: [0, 0.2, 0],
    zombie_scale: [0.02, 0.02, 0.02]
});


export const player = new Player()

