import ObjectLoader from "../loader/object";

import * as init from "../three/init-three";
import * as THREE from 'three';
import * as CANNON from "cannon";


interface diner_properties {
    is_finish_load: boolean
    collide_walls: Array<any>
    collide_mass: number
    collide_fixedRotation: boolean
    fbxObjectPath: string
    fbxObjectScale: number
    fbxObjectPosition: {x: number, y: number, z: number}
    fbxObject: Promise<THREE.Object3D> | null
    mesh: THREE.Object3D | null
    childToKeep: Array<string>,
}

const DinerProperties: diner_properties = {
    is_finish_load: false,
    collide_walls: [// position, scale, y rotation
        [[-22.5,0,21],[0.5,0.5,4.4],[-0.031415926535897934]],
        [[-0.5,0,25],[0.5,1.7000000000000004,25.800000000000097],[-1.570796326794898]],
        [[-16.59999999999991,0,-7.700000000000005],[0.5,0.5,11.000000000000023],[0]],
        [[24.900000000000144,0,20.400000000000006],[0.5,0.5,4.999999999999992],[0.1121997376282069]],
        [[-21.199999999999974,0,10.899999999999963],[0.5,0.5,6.0000000000000013],[-0.17951958020513104]],
        [[-18.69999999999994,0,5.099999999999984],[0.5,0.5,2.999999999999998],[-0.830278058448731]],
        [[-4.800000000000001,0,3.500000000000003],[4.749999999999992,1.700000000000001,0.15000000000000008],[0]],
        [[1.8000000000000003,0,5],[0.35000000000000003,1.750000000000001,1.700000000000001],[0]],
        [[6,0,6.700000000000005],[4.399999999999993,1.750000000000001,0.20000000000000007],[0]],
        [[16.89999999999997,0,13.10000000000001],[6.699999999999986,0.5,0.5],[-0.7629582158718069]],
        [[22.999999999999993,0,17.59999999999996],[1.600000000000001,0.5,0.5],[0]],
        [[12.200000000000001,0,-5.199999999999989],[0.25000000000000006,0.7500000000000002,13.400000000000057],[0]],
        [[10.299999999999999,0,-2.599999999999993],[0.20000000000000007,0.5,9.4],[0]],
        [[-9.500000000000002,0,-4.9],[0.20000000000000007,0.5,8.449999999999987],[0]],
        [[-6.400000000000004,0,-5.399999999999995],[2.8499999999999988,0.5,0.5],[0]],
        [[3.200000000000001,0,-4.100000000000001],[6.899999999999984,0.5,1.3000000000000007],[0]],
        [[0.39999999999999014,0,-12.700000000000001],[10.05000000000001,0.5,0.7000000000000002],[0]],
        [[-2.100000000000023,0,-19.00000000000003],[14.25000000000007,0.5,0.5],[0]]
    ],
    collide_mass: 0,
    collide_fixedRotation: true,
    fbxObjectPath: "./assets/env/diner.fbx",
    fbxObjectScale: 0.009,
    fbxObjectPosition: {x:0, y:-1.55, z:0},
    fbxObject: null,
    mesh: null,
    childToKeep: [
        "Background",
        "Sewer",
        "Plants_01001",
        "Plants_01002",
        "Plants_01003",
        "Plants_01004",
        "Plants_01005",
        "Plants_02001",
        "Plants_02002",
        "Plants_02003",
        "Plants_02004",
        "Plants_02005",
        "Asphalt",
        "Asphalt_01",
        "Asphalt_02",
        "DINER",
        "guard_rails",
        "Lines",
        "Lines_01",
        "Grass",
        "Sing_DINER",
        "Trees001",
        "Bush",
        "Tiles",
        "Sign",
        "Fences",
        "Door",
        "Door_01",
        "Door_frame",
        "Door_frame_03",
        "Door_frame_01",
        "Window_frame_04",
        "Window_frame_03",
        "Window_frame_02",
        "Window_frame_01",
        "Window_frame",
        "Trash_02",
        "Garbage_bag",
        "Garbage_bag_01",
        "Garbage_bag_02",
        "POPCORN",
        "Tumbler",
        "Napkin_Ring_01",
        "lemons",
        "R_V",
        "Lights_01",
        "Lights_02",
        "Lights_03",
        "Lights_04",
        "Lights_05",
        "Lights_06",
        "Lights_07",
        "Lights_08",
    ]
}

export default class Diner {
    async load_3d_object(): Promise<string> {
        console.log("[LOAD] diner .fbx object");

        const THIS = DinerProperties;

        return new Promise<string>((resolve, reject) => {
            const objectLoader = new ObjectLoader(THIS.fbxObjectPath);
            THIS.fbxObject = objectLoader.load();
            THIS.fbxObject.then((obj) => {
                THIS.mesh = obj;
                resolve("[LOADED] diner .fbx object");
            });
        });
    }

    async load_three_object(): Promise<string> {
        console.log('[LOAD] diner three mesh')
        
        const THIS = DinerProperties;

        return new Promise<string>((resolve, reject) => {
            const mesh = THIS.mesh;
            if (!mesh) return;

            mesh.scale.set(THIS.fbxObjectScale, THIS.fbxObjectScale, THIS.fbxObjectScale);

            const childToRemove = [];

            for (let child of mesh.children) {
                if (!THIS.childToKeep.includes(child.name)) {
                    childToRemove.push(child);
                }
            }

            for (let child of childToRemove) {
                mesh.remove(child)
            }

            resolve("[LOADED] diner three mesh");
        })
    }

    async load_collide(): Promise<string> {
        console.log("[LOAD] Diner collision");

        const THIS = DinerProperties;

        return new Promise<string>(resolve => {
            THIS.collide_walls.forEach(wall => {
                const scale = wall[1];
                const cannon_shape_vec3 = new CANNON.Vec3(scale[0], scale[1], scale[2]);
                const cannon_shape = new CANNON.Box(cannon_shape_vec3);
                
                const body: CANNON.Body = new CANNON.Body({ mass: THIS.collide_mass, fixedRotation: THIS.collide_fixedRotation });
    
                const y_vec3 = new CANNON.Vec3(0, 1, 0);
                const rotation_y = wall[2][0];
                body.quaternion.setFromAxisAngle(y_vec3, rotation_y);
    
                const position = wall[0];
                body.position.set(position[0], position[1], position[2]);
    
                body.addShape(cannon_shape);
                init.cannon_world.addBody(body);
            });

            resolve("[LOADED] Diner collision");
        });
    }

    async load_position(): Promise<string> {
        console.log("[LOAD] Diner position");
        const THIS = DinerProperties;

        return new Promise<string>(resolve => {
            if (THIS.mesh) {
                THIS.mesh.position.set(THIS.fbxObjectPosition.x, THIS.fbxObjectPosition.y, THIS.fbxObjectPosition.z);
                init.scene.add(THIS.mesh);
            }

            resolve('[LOADED] Diner position')
        })
        
    }
}