import Zombie from '../sprite/zombie'
import Player from '../sprite/player'
import Gun from '../sprite/gun';
import Floor from '../sprite/floor';
import Basement from '../sprite/basement';
import WindowEvent from './window-event';
import * as init from './init-three'

import { randInt } from 'three/src/math/MathUtils';


// Create Zombies
export const every_zombie: Array<Zombie> = [];

for (let i=0; i<1; i++) {
    every_zombie.push(   
        new Zombie({
            zombie_type: randInt(1, 2),
            zombie_position: [randInt(-5, 15), 1, randInt(-5, 15)],
            zombie_scale: [0.014, 0.014, 0.014]
        })
    );
};

// Create Player
export const player = new Player();


// Create Gun
export const gun = new Gun({
    gun_bullet_charger_max: 10,
    gun_bullet_fire_max: 5,
    gun_damage: 1,
    gun_position: [0, 2, 0],
    gun_scale: [0.05, 0.05, 0.05],
    gun_rotation_degres: [90,  180, 0]
});


// Create Event
export const window_event = new WindowEvent(
    init.activeCamera,
    init.renderer,
    player
);

// Create Floor
export const floor = new Floor();

// Create Basement
export const basement = new Basement();
