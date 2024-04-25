import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as init from '../three/init-three';
import { TextureLoader } from 'three';


export default class Floor 
{
    is_finish_load: boolean = false;

    floor_width:     number = 70;
    floor_thickener: number = 0.3;
    floor_depth:     number = 70;
    floor_rad_angle: number = Math.PI / 2;
    floor_mass:      number = 0;
    
    floor_fixed_rotation: boolean = true;

    texture_path: string = "./assets/nature/grass/textures/grass.png";
    texture_tint: number = 0x555555;

    geometry = new THREE.BoxGeometry(this.floor_width, this.floor_thickener, this.floor_depth);
    loader = new TextureLoader();

    default_position: {x: number, y: number, z: number} = 
        { 
            x: 0, 
            y: -2, 
            z: 0 
        };

    mesh:          THREE.Mesh | null = null;
    body_collide: CANNON.Body | null = null;

    constructor()
    {
        this.loader.load(
            this.texture_path, 
            () => 
                {                
                    const material = new THREE.MeshBasicMaterial({ color: this.texture_tint });
                    this.mesh = new THREE.Mesh(this.geometry, material);

                    init.scene.add(this.mesh);

                    // setup cannon collision
                    const floorShape = new CANNON.Box(
                        new CANNON.Vec3(
                            this.floor_width / 2,
                            this.floor_depth / 2,
                            this.floor_thickener / 2
                        )
                    );
                    
                    this.body_collide = new CANNON.Body({ mass: this.floor_mass, fixedRotation: this.floor_fixed_rotation });
                    this.body_collide.position.set(this.default_position.x, this.default_position.y, this.default_position.z);

                    this.body_collide.addShape(floorShape);
                    init.cannon_world.addBody(this.body_collide);

                    this.is_finish_load = true;
                }
        );
    }

    /**
     * This function is used to set rotation and position to floor.
     * @returns 
     */
    setup(): void
    {
        if (this.mesh !== null && this.body_collide !== null && this.is_finish_load) 
        {
            this.body_collide.quaternion.setFromAxisAngle(
                new CANNON.Vec3(1, 0, 0),
                this.floor_rad_angle
            );

            this.mesh.position.copy(this.body_collide.position);
        }
    }
}
