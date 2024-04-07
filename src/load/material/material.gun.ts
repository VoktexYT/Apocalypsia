import MaterialTextureLoader from "../../loader/material";


const root_path = "./assets/weapons/pistol/textures/";

export const material_gun = new MaterialTextureLoader({
    map:             root_path + `Pistol_map.png`,
    metalnessMap:    root_path + `Pistol_metalness.png`,
    roughnessMap:    root_path + `Pistol_roughness.png`,
    normalMap:       root_path + `Pistol_normalmap.png`,
});
