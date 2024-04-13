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
                    // console.log(child.material)

                    const back_side: Array<string> = [
                        "Fence_Collision",
                        "Tiles"
                    ]
                    if (back_side.includes(child.name))
                        child.material.side = THREE.BackSide

                    else if (child.name === "DINER_Collision") {}
                    
                    else if (child.name === "DINER") {
                        for (let m of child.material) {
                            m.side = THREE.FrontSide
                        }
                    }
                    else {
                        child.material.side = THREE.FrontSide;
                    }
                }
            })
        }, 2000)
        
        
        this.is_finish_load = true;

        init.scene.add(mesh);
        
        console.info("[load]:", "Basement is loaded")
    }
}