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
            mesh.traverse((child: THREE.Mesh | any) => {
                if (child instanceof THREE.Mesh) {
                    const back_side: Array<string> = [
                        "Fence_Collision",
                        "Tiles"
                    ]
                    if (back_side.includes(child.name))
                        child.material.side = THREE.BackSide

                    else if (child.name === "DINER_Collision") {}
                    
                    else if (child.name === "DINER") {
                        const back_dinner: Array<string> = [
                            
                        ]

                        for (let m of child.material) {
                            // console.log(m.name)
                            if (back_dinner.includes(m.name)) {
                                m.side = THREE.BackSide
                            } else {
                                m.side = THREE.FrontSide
                            }
                        }
                    }
                    else {
                        // console.log(child.name)
                        child.material.side = THREE.FrontSide;
                    }
                    // if (this.inverse) console.log("back side")
                    // else console.log("front side")

                    
                    // console.log(child.name, " : ", child.material)
                }
            })
        }, 2000)
        
        
        this.is_finish_load = true;

        init.scene.add(mesh);
        
        console.info("[load]:", "Basement is loaded")
    }
}