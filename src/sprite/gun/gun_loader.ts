import AudioLoader from "../../loader/audio"
import MaterialTextureLoader from "../../loader/material";
import ObjectLoader from "../../loader/object";
import Player from "../../game/player";
import * as THREE from 'three';


interface gun_loader_properties
{
    audioLoader: AudioLoader | null
    reload_weapons_sound: THREE.Audio | null
    switch_weapons_sound: THREE.Audio | null
    empty_weapons_sound:  THREE.Audio | null
    fire_weapons_sound:   THREE.Audio | null

    pistol_loader: ObjectLoader | null
    rifle_loader: ObjectLoader | null

    pistol_object: Promise<THREE.Object3D> | null
    rifle_object: Promise<THREE.Object3D> | null

    pistol_mesh: THREE.Object3D | null
    rifle_mesh: THREE.Object3D | null

    pistol_material: MaterialTextureLoader | null
    rifle_material: MaterialTextureLoader | null
}


const properties: gun_loader_properties = 
{
    audioLoader: null,
    reload_weapons_sound: null,
    switch_weapons_sound: null,
    empty_weapons_sound: null,
    fire_weapons_sound: null,
    pistol_loader: null,
    rifle_loader: null,
    pistol_object: null,
    rifle_object: null,
    pistol_mesh: null,
    rifle_mesh: null,
    pistol_material: null,
    rifle_material: null
}

export class GunLoader 
{

    properties: gun_loader_properties
    
    constructor(public player: Player)
    {
        this.properties = properties;
        properties.audioLoader = new AudioLoader(player.camera);
    }


    /**
     * This function is used to load all sounds for gun
     * @returns promise when gun sound is loaded
     */
    async load_audio() : Promise<string>
    {
        console.info("[LOAD] Gun audio");

        return new Promise<string>(
            (resolve) => 
            {
                const audio_loader = properties.audioLoader;

                if (!audio_loader) return;

                audio_loader.load(
                    {
                        path: "./assets/sound/switchWeapon.mp3",
                        is_loop: false,
                        volume: 0.4
                    },
                    
                    (loaded, sound) => 
                    {
                        if (loaded && sound) {
                            properties.switch_weapons_sound = sound;
                        }
                    }
                );
        
                audio_loader.load(
                    {
                        path: "./assets/sound/empty-gun.mp3",
                        is_loop: false,
                        volume: 0.4
                    }, 
                    
                    (loaded, sound) =>
                    {
                        if (loaded && sound) {
                            properties.empty_weapons_sound = sound;
                        }
                    }
                );
        
                audio_loader.load(
                    {
                        path: "./assets/sound/reload-gun.mp3",
                        is_loop: false,
                        volume: 0.6
                    },

                    (loaded, sound) => 
                    {
                        if (loaded && sound) {
                            properties.reload_weapons_sound = sound;
                        }
                    }
                );
        
                audio_loader.load(
                    {
                        path: "./assets/sound/fire.mp3",
                        is_loop: false,
                        volume: 0.8
                    },

                    (loaded, sound) => 
                    {
                        if (loaded && sound) {
                            properties.fire_weapons_sound = sound;
                        }
                    }
                );

                resolve("[LOADED] Gun audio");
            }
        );
    }

    /**
     * This function is used to load pisol fbx object
     */
    async load_pistol_fbx() : Promise<string>
    {
        console.info("[LOAD] pistol .fbx object");

        return new Promise<string>(
            (resolve) => 
            {
                properties.pistol_loader = new ObjectLoader("./assets/weapons/pistol/pistol.fbx");

                properties.pistol_object = properties.pistol_loader.load();

                properties.pistol_object.then(
                    (obj) => 
                    {
                        properties.pistol_mesh = obj;
                        resolve("[LOADED] pistol .fbx object");
                    }
                );
            }
        );
    }

    /**
     * This function is used to load rifle fbx object
     */
    async load_rifle_fbx(): Promise<string> {
        console.info("[LOAD] rifle .fbx object");

        return new Promise<string>((resolve) => {
            properties.rifle_loader = new ObjectLoader("./assets/weapons/weapons/AK-74(LP).fbx");

            properties.rifle_object = properties.rifle_loader.load();

            properties.rifle_object.then((obj) => {
                properties.rifle_mesh = obj;
                resolve("[LOADED] rifle .fbx object");
            });
        });
    }

    /**
     * This function is used to load pistol textures
     * @returns Promise if textures are finish to loaded
     */
    async load_pistol_material() : Promise<string>
    {
        console.info("[LOAD] Pistol material texture");

        return new Promise<string>(
            (resolve) => 
            {
                const root_path = "./assets/weapons/pistol/";

                properties.pistol_material = new MaterialTextureLoader(
                    {
                        map:             root_path + `Pistol_map.png`,
                        metalnessMap:    root_path + `Pistol_metalness.png`,
                        roughnessMap:    root_path + `Pistol_roughness.png`,
                        normalMap:       root_path + `Pistol_normalmap.png`,
                    }
                );

                resolve("[LOADED] Pistol material texture");
            }
        );
    }

    /**
     * This function is used to load rifle gun textures 
     * @returns 
     */
    async load_rifle_material() : Promise<string>
    {
        console.info("[LOAD] rifle material texture");

        return new Promise<string>(
            (resolve) => 
            {
                properties.rifle_material = new MaterialTextureLoader(
                    {
                        normalMap:       "./assets/weapons/weapons/AK-74HP_Normal.png",
                        metalnessMap:    "./assets/weapons/weapons/AK-74HP_Metallic.png",
                        map:             "./assets/weapons/weapons/AK-74HP_Map.png",
                        roughnessMap:    "./assets/weapons/weapons/AK-74HP_Roughness.png"
                    }
                );
            
                resolve("[LOADED] rifle material texture");
            }
        );
    }
}
