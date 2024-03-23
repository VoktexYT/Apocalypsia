import * as THREE from 'three'
import * as CANNON from 'cannon';
import * as init from '../game/init-three'
import { TextureLoader } from 'three';


export default class Floor {
    is_finish_load = false

    floor_width = 40
    floor_thickener = 0.3
    floor_depth = 40
    floor_angle = 90 // deg

    texture_path = "./assets/nature/grass/textures/grass.png"
    texture_tint = 0x555555


    geometry = new THREE.BoxGeometry(this.floor_width, this.floor_thickener, this.floor_depth);
    loader = new TextureLoader();

    default_position = {x:0, y:0, z:0}

    mesh: THREE.Mesh | null = null
    body_collide: CANNON.Body | null = null

    constructor() {
        this.loader.load(
            this.texture_path,
            (texture) => {                
                const material = new THREE.MeshBasicMaterial({ color: this.texture_tint });
                // const material = new THREE.MeshBasicMaterial({ map: texture, color: this.texture_tint });
                this.mesh = new THREE.Mesh(this.geometry, material);
                init.scene.add(this.mesh);

                // setup cannon collision
                const floorShape = new CANNON.Box(
                    new CANNON.Vec3(
                    this.floor_width / 2,
                    this.floor_depth / 2,
                    this.floor_thickener / 2
                ));
                
                this.body_collide = new CANNON.Body({ mass: 0, fixedRotation: true });
                this.body_collide.position.set(this.default_position.x, this.default_position.y, this.default_position.z)

                this.body_collide.addShape(floorShape);
                init.cannon_world.addBody(this.body_collide);

                this.is_finish_load = true
                console.info("[load]:", "Floor is loaded")
            }
        );
    }

    update() {
        if (this.mesh !== null && this.body_collide !== null && this.is_finish_load) {
            this.body_collide.quaternion.setFromAxisAngle(
                new CANNON.Vec3(1, 0, 0),
                THREE.MathUtils.degToRad(this.floor_angle)
            )

            this.mesh.position.copy(this.body_collide.position)
        }
    }
}
