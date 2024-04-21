import Zombie from '../sprite/zombies/zombie'
import Player from './player'
import Gun from '../sprite/gun/gun';
import Floor from '../sprite/floor';
import Diner from '../sprite/diner/diner';
import WindowEvent from './window-event';

import * as init from '../three/init-three';
import * as THREE from 'three';

import { randInt } from 'three/src/math/MathUtils';

import { ZombieLoader } from '../sprite/zombies/zombie_loader';
import { GunLoader } from '../sprite/gun/gun_loader';

import Loading from './loading';



// Create Player
export const player = new Player();

// Create Zombies
export const zombieLoader = new ZombieLoader(player);

export const every_zombie: Array<Zombie> = [];

const zombie_children = init.every_zombie_mesh?.children;

if (zombie_children) {
    for (let zombie_child of zombie_children) {
        if (zombie_child instanceof THREE.Mesh) {
            const scale = randInt(13, 15) / 1000;

            const every_zombie_mesh = init.every_zombie_mesh;

            if (every_zombie_mesh) {
                const mesh = every_zombie_mesh.clone()

                const zombie = new Zombie({
                    zombie_type: randInt(1, 2),
                    zombie_position: [randInt(-12, 8), 1, randInt(-1, 16)],
                    zombie_scale: [
                        scale, 
                        scale, 
                        scale
                    ]
                }, mesh)

                every_zombie.push(zombie);
            }
            
        }
        
    }
}


export const gunLoader = new GunLoader(player);
export const gun = new Gun();

export const window_event = new WindowEvent( init.activeCamera, init.renderer );

export const floor = new Floor();
export const diner = new Diner();

export const loading = new Loading();

