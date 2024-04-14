import MaterialTextureLoader from "../../loader/material";


const root_path = "./assets/weapons/pistol/";

export const material_pistol = new MaterialTextureLoader({
    map:             root_path + `Pistol_map.png`,
    metalnessMap:    root_path + `Pistol_metalness.png`,
    roughnessMap:    root_path + `Pistol_roughness.png`,
    normalMap:       root_path + `Pistol_normalmap.png`,
});



export const material_rifle = new MaterialTextureLoader({
    normalMap:       "./assets/weapons/weapons/AK-74HP_Normal.png",
    metalnessMap:    "./assets/weapons/weapons/AK-74HP_Metallic.png",
    map:             "./assets/weapons/weapons/AK-74HP_Map.png",
    roughnessMap:    "./assets/weapons/weapons/AK-74HP_Roughness.png"
});