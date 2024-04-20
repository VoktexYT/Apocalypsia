import AudioLoader from "../../loader/audio"
import ObjectLoader from "../../loader/object";
import MaterialTextureLoader from "../../loader/material";

import * as THREE from 'three';
import Player from "../../game/player";



interface gun_loader_properties {
    audioLoader: AudioLoader | null
    reload_weapons_sound: THREE.Audio | null
    switch_weapons_sound: THREE.Audio | null
    empty_weapons_sound:  THREE.Audio | null
    fire_weapons_sound:   THREE.Audio | null

    pistol_loader: ObjectLoader | null
    riffle_loader: ObjectLoader | null

    pistol_object: Promise<THREE.Object3D> | null
    riffle_object: Promise<THREE.Object3D> | null

    pistol_mesh: THREE.Object3D | null
    riffle_mesh: THREE.Object3D | null

    material_pistol: MaterialTextureLoader | null
    material_riffle: MaterialTextureLoader | null
}


const properties: gun_loader_properties = {
    audioLoader: null,
    reload_weapons_sound: null,
    switch_weapons_sound: null,
    empty_weapons_sound: null,
    fire_weapons_sound: null,
    pistol_loader: null,
    riffle_loader: null,
    pistol_object: null,
    riffle_object: null,
    pistol_mesh: null,
    riffle_mesh: null,
    material_pistol: null,
    material_riffle: null
}

export class GunLoader {

    properties: gun_loader_properties
    
    constructor(public player: Player) {
        this.properties = properties;
        properties.audioLoader = new AudioLoader(player.camera);
    }


    async load_audio(): Promise<string> {
        console.log("[LOAD] Gun audio")

        return new Promise<string>((resolve) => {
            const audio_loader = properties.audioLoader;

            if (!audio_loader) return;

            audio_loader.loadSound("./assets/sound/switchWeapon.mp3", false, 0.4, (loaded, sound) => {
                if (loaded && sound) {
                    properties.switch_weapons_sound = sound;
                }
            });
    
            audio_loader.loadSound("./assets/sound/empty-gun.mp3", false, 0.4, (loaded, sound) => {
                if (loaded && sound) {
                    properties.empty_weapons_sound = sound;
                }
            });
    
            audio_loader.loadSound("./assets/sound/reload-gun.mp3", false, 0.6, (loaded, sound) => {
                if (loaded && sound) {
                    properties.reload_weapons_sound = sound;
                }
            });
    
            audio_loader.loadSound("./assets/sound/fire.mp3", false, 0.8, (loaded, sound) => {
                if (loaded && sound) {
                    properties.fire_weapons_sound = sound;
                }
            });

            resolve("[LOADED] Gun audio");
        });
    }


    async load_pistol_fbx(): Promise<string> {
        console.log("[LOAD] pistol .fbx object");

        return new Promise<string>((resolve) => {
            properties.pistol_loader = new ObjectLoader("./assets/weapons/pistol/pistol.fbx");

            properties.pistol_object = properties.pistol_loader.load();

            properties.pistol_object.then((obj) => {
                properties.pistol_mesh = obj;
                resolve("[LOADED] pistol .fbx object");
            });
        });
    }

    async load_riffle_fbx(): Promise<string> {
        console.log("[LOAD] riffle .fbx object");

        return new Promise<string>((resolve) => {
            properties.riffle_loader = new ObjectLoader("./assets/weapons/weapons/AK-74(LP).fbx");

            properties.riffle_object = properties.riffle_loader.load();

            properties.riffle_object.then((obj) => {
                properties.riffle_mesh = obj;
                resolve("[LOADED] riffle .fbx object");
            });
        });
    }

    async load_pistol_material(): Promise<string> {
        console.log("[LOAD] Pistol material texture");

        return new Promise<string>((resolve) => {
            const root_path = "./assets/weapons/pistol/";

            properties.material_pistol = new MaterialTextureLoader({
                map:             root_path + `Pistol_map.png`,
                metalnessMap:    root_path + `Pistol_metalness.png`,
                roughnessMap:    root_path + `Pistol_roughness.png`,
                normalMap:       root_path + `Pistol_normalmap.png`,
            });

            resolve("[LOADED] Pistol material texture");
        });
    }

    async load_riffle_material(): Promise<string> {
        console.log("[LOAD] Riffle material texture");

        return new Promise<string>((resolve) => {
            properties.material_riffle = new MaterialTextureLoader({
                normalMap:       "./assets/weapons/weapons/AK-74HP_Normal.png",
                metalnessMap:    "./assets/weapons/weapons/AK-74HP_Metallic.png",
                map:             "./assets/weapons/weapons/AK-74HP_Map.png",
                roughnessMap:    "./assets/weapons/weapons/AK-74HP_Roughness.png"
            });
            
            resolve("[LOADED] Riffle material texture");
        });
    }
}