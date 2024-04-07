import ObjectLoader from "../loader/object";
import * as init from "../game/init-three";
import * as THREE from 'three';


export default class Basement {
    is_finish_load: boolean = false;

    fbxObjectPath: string = "./assets/env/diner.fbx";
    fbxObjectScale: number = 0.009;
    fbxObjectPosition: {x: number, y: number, z: number} = {x: 0, y: -1.55, z: 0};
    fbxObject: ObjectLoader = new ObjectLoader(this.fbxObjectPath);

    inverse: boolean = false

    update() {
        this.setupMesh();
    }

    private setupMesh() {
        if (this.is_finish_load) return
        if (this.fbxObject === null) return

        const mesh = this.fbxObject.getObject()

        if (!mesh) return

        mesh.scale.set(this.fbxObjectScale, this.fbxObjectScale, this.fbxObjectScale);
        mesh.position.set(this.fbxObjectPosition.x, this.fbxObjectPosition.y, this.fbxObjectPosition.z);

        setInterval(() => {
            this.inverse = !this.inverse
            mesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const front_material: Array<string> = [
                        "Asphalt",
                        "Asphalt_01",
                        "Asphalt_02",
                        "Lines",
                        "Lines_01",
                    ]

                    const double_side: Array<string> = [
                        "Entry"
                    ]

                    const back_side: Array<string> = [
                        "Fence_collision"
                    ]

                    if (front_material.includes(child.name))
                        child.material.side = THREE.FrontSide
                    else if (back_side.includes(child.name)) {
                        child.material.side = THREE.BackSide
                    }
                    else if (double_side.includes(child.name)) {
                        child.material.side = THREE.DoubleSide
                    }
                    else
                        child.material.side = this.inverse ? THREE.FrontSide : THREE.BackSide;

                    // if (this.inverse) console.log("back side")
                    // else console.log("front side")
                    console.log(child.name, " : ", child.material)
                }
            })
        }, 2000)
        
        
        this.is_finish_load = true;

        init.scene.add(mesh);
        
        console.info("[load]:", "Basement is loaded")
    }
}