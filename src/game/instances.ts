import Zombie from '../sprite/zombies/zombie'
import Player from './player'
import Gun from '../sprite/gun/gun';
import Floor from '../sprite/floor';
import Diner from '../sprite/diner';
import WindowEvent from './window-event';

import * as init from '../three/init-three'

import { randInt } from 'three/src/math/MathUtils';

import { ZombieLoader } from '../sprite/zombies/zombie_loader';
import { GunLoader } from '../sprite/gun/gun_loader';

import Loading from './loading';



// Create Player
export const player = new Player();

// Create Zombies
export const zombieLoader = new ZombieLoader();

export const every_zombie: Array<Zombie> = [];

for (let i=0; i<1; i++) {
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


export const gunLoader = new GunLoader();
export const gun = new Gun();

export const window_event = new WindowEvent( init.activeCamera, init.renderer );

export const floor = new Floor();
export const diner = new Diner();

export const loading = new Loading();

