import * as CANNON from "cannon";
import { diner_properties } from "./diner_loader";
import * as init from "../../three/init-three";
import ObjectLoader from "../../loader/object";
import * as THREE from 'three';


export default class Diner 
{
    /**
     * This function is used to diner 3d object
     * @returns 
     */
    async load_3d_object() : Promise<string>
    {
        console.info("[LOAD] diner .fbx object");

        const THIS = diner_properties;

        return new Promise<string>(
            (resolve) => 
            {
                const objectLoader = new ObjectLoader(THIS.fbxObjectPath);
                THIS.fbxObject = objectLoader.load();
                THIS.fbxObject.then(
                    (obj) => 
                    {
                        THIS.mesh = obj;
                        resolve("[LOADED] diner .fbx object");
                    }
                );
            }
        );
    }

    /**
     * This function is used to load diner mesh
     * @returns 
     */
    async load_three_object() : Promise<string>
    {
        console.info('[LOAD] diner three mesh')
        
        const THIS = diner_properties;

        return new Promise<string>(
            (resolve) =>
            {
                const mesh = THIS.mesh;
                if (!mesh) return;

                mesh.scale.set(THIS.fbxObjectScale, THIS.fbxObjectScale, THIS.fbxObjectScale);

                const childToRemove = [];

                for (let child of mesh.children)
                {
                    if (!THIS.childToKeep.includes(child.name))
                    {
                        childToRemove.push(child);
                    }
                }

                for (let child of childToRemove)
                {
                    mesh.remove(child);
                }

                resolve("[LOADED] diner three mesh");
            }
        );
    }

    /**
     * This function is used to load cannon.js collide of diner.
     * @returns 
     */
    async load_collide() : Promise<string>
    {
        console.info("[LOAD] Diner collision");

        const THIS = diner_properties;

        return new Promise<string>(
            (resolve) => 
            {
                THIS.collide_walls.forEach(
                    (wall) => 
                    {
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
                    }
                );

                resolve("[LOADED] Diner collision");
            }
        );
    }

    /**
     * 
     * @returns 
     */
    async load_position() : Promise<string>
    {
        console.info("[LOAD] Diner position");
        const THIS = diner_properties;

        return new Promise<string>(
            (resolve) => 
            {
                if (THIS.mesh)
                {
                    THIS.mesh.position.set(THIS.fbxObjectPosition.x, THIS.fbxObjectPosition.y, THIS.fbxObjectPosition.z);
                    init.scene.add(THIS.mesh);
                }

                resolve('[LOADED] Diner position');
            }
        );
    }
}
