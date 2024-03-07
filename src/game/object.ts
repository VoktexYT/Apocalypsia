import Zombie from '../sprite/zombie'
import * as setup from './setup'


export const zombie = new Zombie({
    scene: setup.scene,
    zombie_type: 2,
    zombie_velocity: 0.01,
    zombie_health: 100,
    zombie_name: "z1",
    zombie_position: [0, 0, 0],
    zombie_scale: [0.01, 0.01, 0.01]
});

