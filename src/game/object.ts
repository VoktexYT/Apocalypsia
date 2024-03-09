import Zombie from '../sprite/zombie'
import Player from './player'
import Gun from '../sprite/gun';
import * as setup from './setup'
import * as THREE from 'three'

import { TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';



export const zombie = new Zombie({
    zombie_type: 2,
    zombie_position: [0, 0.2, 0],
    zombie_scale: [0.02, 0.02, 0.02]
});


export const player = new Player()


export const gun = new Gun({
    gun_bullet_charger_max: 10,
    gun_bullet_fire_max: 5,
    gun_damage: 1,
    gun_position: [0, 2, 0],
    gun_scale: [0.05, 0.05, 0.05],
    gun_rotation_degres: [90,  180, 0]
})

