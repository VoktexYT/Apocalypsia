import Zombie from '../sprite/zombie'
import Player from '../sprite/player'
import Gun from '../sprite/gun';
import Floor from '../sprite/floor';
import Basement from '../sprite/basement';
import WindowEvent from './window-event';
import * as init from './init-three'

import { randInt } from 'three/src/math/MathUtils';




// Create Player
export const player = new Player();

// Create Zombies
export const every_zombie: Array<Zombie> = [];

for (let i=0; i<10; i++) {
    every_zombie.push(   
        new Zombie({
            zombie_type: randInt(1, 2),
            zombie_position: [randInt(-5, 15), 1, randInt(-5, 15)],
            zombie_scale: [0.014, 0.014, 0.014]
        })
    );
};


// Create Gun
export const gun = new Gun();


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
