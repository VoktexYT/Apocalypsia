import ObjectLoader from "../loader/object";
import * as init from "../game/init-three";
import * as THREE from 'three';
import * as CANNON from "cannon";


export default class Basement {
    is_finish_load: boolean = false;

    fbxObjectPath: string = "./assets/env/diner.fbx";
    fbxObjectScale: number = 0.009;
    fbxObjectPosition: {x: number, y: number, z: number} = {x: 0, y: -1.55, z: 0};
    fbxObject: ObjectLoader = new ObjectLoader(this.fbxObjectPath);


    update() {
        this.setupMesh();
    }

    setCollideWall() {
        const walls = [
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
        ]

        for (const w of walls) {
            const body: CANNON.Body = new CANNON.Body({ mass: 0, fixedRotation: true });
            const cannon_shape = new CANNON.Box(new CANNON.Vec3(w[1][0], w[1][1], w[1][2]));
            body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), w[2][0]);
            body.position.set(w[0][0], w[0][1], w[0][2]);
            body.addShape(cannon_shape);
            init.cannon_world.addBody(body);

            // const BOX = new THREE.BoxGeometry(w[1][0]*2, w[1][1]*2, w[1][2]*2);
            // const MATERIAL = new THREE.MeshBasicMaterial({ color: 0xFF00FF });
            // const COLLIDE_BOX = new THREE.Mesh(BOX, MATERIAL);
            // COLLIDE_BOX.position.set(w[0][0], w[0][1], w[0][2]);
            // COLLIDE_BOX.rotation.set(0, w[2][0], 0);
            // init.scene.add(COLLIDE_BOX);
        }
    }

    private setupMesh() {
        if (this.is_finish_load) return
        if (this.fbxObject === null) return

        const mesh = this.fbxObject.mesh;

        if (!mesh) return

        mesh.scale.set(this.fbxObjectScale, this.fbxObjectScale, this.fbxObjectScale);
        mesh.position.set(this.fbxObjectPosition.x, this.fbxObjectPosition.y, this.fbxObjectPosition.z);

        mesh.traverse((child: THREE.Mesh | any) => {
            if (child instanceof THREE.Mesh) {
                const back_side: Array<string> = [
                    "Fence_Collision",
                    "Tiles"
                ]
                if (back_side.includes(child.name))
                    child.material.side = THREE.BackSide

                else if (child.name === "DINER_Collision") {}
                
                else if (child.name === "DINER") {}
                else {
                    child.material.side = THREE.FrontSide;
                }
                
            }
        });
        
        
        this.is_finish_load = true;

        init.scene.add(mesh);

        const childrenToRemove: Array<any> = [];
        const childrenNameNoRemove: Array<string> = [
            "Background",
            "Fence_Collision",
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
            "R_V"
        ];

        mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (!childrenNameNoRemove.includes(child.name))
                    childrenToRemove.push(child);
            }
        });

        // Remove the collected children outside of the traversal loop
        childrenToRemove.forEach((child) => {
            mesh.remove(child);
        });
        
        console.info("[load]:", "Basement is loaded")

        this.setCollideWall()
    }
}