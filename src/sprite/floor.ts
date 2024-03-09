import * as THREE from 'three'
import * as init from '../game/init-three'
import { TextureLoader } from 'three';


export default class Floor {
    floor_width = 20
    floor_thickener = 0.3
    floor_depth = 20

    geometry = new THREE.BoxGeometry(this.floor_width, this.floor_thickener, this.floor_depth);
    loader = new TextureLoader();
    is_finish_load = false

    texture_path = "/assets/nature/grass/textures/grass.png"
    texture_tint = 0x555555

    constructor() {
        this.loader.load(
            this.texture_path,
            (texture) => {
                const material = new THREE.MeshBasicMaterial({ map: texture, color: this.texture_tint });
                init.scene.add(
                    new THREE.Mesh(this.geometry, material)
                );
                this.is_finish_load = true
                console.info("[load]:", "Floor is loaded")
            }
        );
    }
}
