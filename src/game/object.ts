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

for (let i=0; i<30; i++) {
    const scale = randInt(13, 15)/1000;

    every_zombie.push(   
        new Zombie({
            zombie_type: randInt(1, 2),
            zombie_position: [randInt(-12, 8), 1, randInt(-1, 16)],
            zombie_scale: [
                scale, 
                scale, 
                scale
            ]
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
