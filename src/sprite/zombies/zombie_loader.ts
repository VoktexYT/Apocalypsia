import AudioLoader from "../../loader/audio"
import MaterialTextureLoader from "../../loader/material";
import ObjectLoader from "../../loader/object";
import Player from "../../game/player";
import * as THREE from 'three';


interface zombies_loader_properties 
{
    audioLoader: AudioLoader | null
    audioLoaderThree: THREE.AudioLoader
    death_sound: THREE.PositionalAudio | null
    road_sound: THREE.PositionalAudio | null
    objectLoader: ObjectLoader | null
    fbx: THREE.Object3D | null

    material_zombie1_low: MaterialTextureLoader | null
    material_zombie1_high: MaterialTextureLoader | null
    material_zombie2_low: MaterialTextureLoader | null
    material_zombie2_high: MaterialTextureLoader | null
}


const properties: zombies_loader_properties = 
{
    audioLoader: null,
    audioLoaderThree: new THREE.AudioLoader(),

    death_sound: null,
    road_sound: null,
    objectLoader: null,
    fbx: null,
    material_zombie1_low: null,
    material_zombie1_high: null,
    material_zombie2_low: null,
    material_zombie2_high: null,
}


export class ZombieLoader 
{
    properties: zombies_loader_properties

    constructor(public player: Player) 
    {
        this.properties = properties;
        this.properties.audioLoader = new AudioLoader(player.camera)
    }

    /**
     * This function is used to load .fbx zombie file
     * @returns Promise if fbx is loaded
     */
    async load_3d_object() : Promise<string>
    {
        console.log("[LOAD] zombie .fbx object");

        return new Promise<string>(
            (resolve) => 
                {
                    properties.objectLoader = new ObjectLoader(
                        "assets/entity/zombie/models/Base mesh fbx.fbx", 
                        [
                            {path: "./assets/entity/zombie/animation/zombie@atack1.fbx", name: "attack1"},
                            {path: "./assets/entity/zombie/animation/zombie@atack2.fbx", name: "attack2"},
                            {path: "./assets/entity/zombie/animation/zombie@atack3.fbx", name: "attack3"},
                            {path: "./assets/entity/zombie/animation/zombie@atack4.fbx", name: "attack4"},
                            {path: "./assets/entity/zombie/animation/zombie@death1.fbx", name: "death1"},
                            {path: "./assets/entity/zombie/animation/zombie@death2.fbx", name: "death2"},
                            {path: "./assets/entity/zombie/animation/zombie@gethit.fbx", name: "gethit"},
                            {path: "./assets/entity/zombie/animation/zombie@idle1.fbx", name: "idle1"},
                            {path: "./assets/entity/zombie/animation/zombie@idle2.fbx", name: "idle2"},
                            {path: "./assets/entity/zombie/animation/zombie@roar.fbx", name: "roar"},
                            {path: "./assets/entity/zombie/animation/zombie@walk.fbx", name: "walk"}
                        ]
                    );
                    
                    const fbx_promise = properties.objectLoader.load();

                    fbx_promise.then(
                        (fbx) => 
                            {
                                properties.fbx = fbx;
                                resolve("[LOADED] zombie .fbx object");
                            }
                    );
                }
        );
    }

    /**
     * This function is used to load zombie sound.
     * @returns Promise if audio is loaded
     */
    async load_audio() : Promise<string>
    {
        console.log("[LOAD] zombie audio");

        return new Promise<string>(
            (resolve) => 
                {
                    const audio_loader = properties.audioLoader;

                    if (!audio_loader) return;

                    properties.road_sound = new THREE.PositionalAudio(audio_loader.listener);
                    properties.death_sound = new THREE.PositionalAudio(audio_loader.listener);

                    properties.audioLoaderThree.load(`./assets/sound/zombieRoad.mp3`, 
                        (buffer: any) =>
                            {
                                if (properties.road_sound) 
                                {
                                    properties.road_sound.setBuffer(buffer);
                                    properties.road_sound.setRefDistance(3);
                                    properties.road_sound.setVolume(0.7);
                                }
                            }
                    );

                    resolve("[LOADED] zombie audio");
                }
        );
    }

    /**
     * This function is used to load zombie textures
     * @returns Promise if texture is loaded
     */
    async load_zombie_material() : Promise<string> 
    {
        console.log("[LOAD] zombie material texture");

        return new Promise<string>(
            (resolve) => 
                {
                    const root_path = "./assets/entity/zombie/textures/"

                    properties.material_zombie1_low = new MaterialTextureLoader(
                        {
                            map:             root_path + `1/LOW/1_Albedo.png`,
                            emissiveMap:     root_path + `1/LOW/1_Emission.png`,
                            roughnessMap:    root_path + `1/LOW/1_gloss.png`,
                            displacementMap: root_path + `1/LOW/1_Height.png`,
                            metalnessMap:    root_path + `1/LOW/1_metalik marmoset.png`,
                            normalMap:       root_path + `1/LOW/1_Normal.png`,
                            aoMap:           root_path + `1/LOW/1_Occlusion.png`
                        }
                    );

                    properties.material_zombie1_high = new MaterialTextureLoader(
                        {
                            map:             root_path + `1/HIGH/1_Albedo.png`,
                            emissiveMap:     root_path + `1/HIGH/1_Emission.png`,
                            roughnessMap:    root_path + `1/HIGH/1_gloss.png`,
                            displacementMap: root_path + `1/HIGH/1_Height.png`,
                            metalnessMap:    root_path + `1/HIGH/1_metalik marmoset.png`,
                            normalMap:       root_path + `1/HIGH/1_Normal.png`,
                            aoMap:           root_path + `1/HIGH/1_Occlusion.png`
                        }
                    );

                    properties.material_zombie2_low = new MaterialTextureLoader(
                        {
                            map:             root_path + `2/LOW/2_Albedo.png`,
                            emissiveMap:     root_path + `2/LOW/2_Emission.png`,
                            roughnessMap:    root_path + `2/LOW/2_gloss.png`,
                            displacementMap: root_path + `2/LOW/2_Height.png`,
                            metalnessMap:    root_path + `2/LOW/2_metalik marmoset.png`,
                            normalMap:       root_path + `2/LOW/2_Normal.png`,
                            aoMap:           root_path + `2/LOW/2_Occlusion.png`
                        }
                    );

                    properties.material_zombie2_high = new MaterialTextureLoader(
                        {
                            map:             root_path + `2/HIGH/2_Albedo.png`,
                            emissiveMap:     root_path + `2/HIGH/2_Emission.png`,
                            roughnessMap:    root_path + `2/HIGH/2_gloss.png`,
                            displacementMap: root_path + `2/HIGH/2_Height.png`,
                            metalnessMap:    root_path + `2/HIGH/2_metalik marmoset.png`,
                            normalMap:       root_path + `2/HIGH/2_Normal.png`,
                            aoMap:           root_path + `2/HIGH/2_Occlusion.png`
                        }
                    );

                    resolve("[LOADED] zombie material texture");
                }
        );
    }
}
