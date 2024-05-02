import Player from './player'
import Gun from '../sprite/gun/gun';
import Floor from '../sprite/floor';
import Diner from '../sprite/diner/diner';
import WindowEvent from './window-event';

import * as init from '../three/init-three';

import { ZombieLoader } from '../sprite/zombies/zombie_loader';
import { GunLoader } from '../sprite/gun/gun_loader';

import Loading from './loading';
import { ZombieGroup } from '../sprite/zombies/zombie_group';



const player = new Player();

const zombieLoader = new ZombieLoader(player);
const zombieGroup = new ZombieGroup();

const gunLoader = new GunLoader( player );
const gun = new Gun();

const window_event = new WindowEvent( player.camera, init.renderer );

const floor = new Floor();
const diner = new Diner();

const loading = new Loading();

export {
    player, 
    zombieLoader, 
    zombieGroup, 
    gunLoader, 
    gun, window_event, 
    floor, 
    diner, 
    loading
};

