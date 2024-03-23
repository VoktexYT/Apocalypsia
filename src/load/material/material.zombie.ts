import MaterialTextureLoader from "../../loader/material";


const root_path = "./assets/entity/zombie/textures/"


export const material_zombie1_low = new MaterialTextureLoader({
    map:             root_path + `1/LOW/1_Albedo.png`,
    emissiveMap:     root_path + `1/LOW/1_Emission.png`,
    roughnessMap:    root_path + `1/LOW/1_gloss.png`,
    displacementMap: root_path + `1/LOW/1_Height.png`,
    metalnessMap:    root_path + `1/LOW/1_metalik marmoset.png`,
    normalMap:       root_path + `1/LOW/1_Normal.png`,
    aoMap:           root_path + `1/LOW/1_Occlusion.png`
});

export const material_zombie1_high = new MaterialTextureLoader({
    map:             root_path + `1/HIGH/1_Albedo.png`,
    emissiveMap:     root_path + `1/HIGH/1_Emission.png`,
    roughnessMap:    root_path + `1/HIGH/1_gloss.png`,
    displacementMap: root_path + `1/HIGH/1_Height.png`,
    metalnessMap:    root_path + `1/HIGH/1_metalik marmoset.png`,
    normalMap:       root_path + `1/HIGH/1_Normal.png`,
    aoMap:           root_path + `1/HIGH/1_Occlusion.png`
});

export const material_zombie2_low = new MaterialTextureLoader({
    map:             root_path + `2/LOW/2_Albedo.png`,
    emissiveMap:     root_path + `2/LOW/2_Emission.png`,
    roughnessMap:    root_path + `2/LOW/2_gloss.png`,
    displacementMap: root_path + `2/LOW/2_Height.png`,
    metalnessMap:    root_path + `2/LOW/2_metalik marmoset.png`,
    normalMap:       root_path + `2/LOW/2_Normal.png`,
    aoMap:           root_path + `2/LOW/2_Occlusion.png`
});

export const material_zombie2_high = new MaterialTextureLoader({
    map:             root_path + `2/HIGH/2_Albedo.png`,
    emissiveMap:     root_path + `2/HIGH/2_Emission.png`,
    roughnessMap:    root_path + `2/HIGH/2_gloss.png`,
    displacementMap: root_path + `2/HIGH/2_Height.png`,
    metalnessMap:    root_path + `2/HIGH/2_metalik marmoset.png`,
    normalMap:       root_path + `2/HIGH/2_Normal.png`,
    aoMap:           root_path + `2/HIGH/2_Occlusion.png`
});
