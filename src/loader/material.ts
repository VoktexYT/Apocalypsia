import * as THREE from 'three';
import { TextureLoader } from 'three';


export interface TexturesPath 
{
    map?: string,
    emissiveMap?: string,
    roughnessMap?: string,
    displacementMap?: string,
    metalnessMap?: string,
    normalMap?: string,
    aoMap?: string
};

interface TexturesThree 
{
    map?: THREE.Texture,
    emissiveMap?: THREE.Texture,
    roughnessMap?: THREE.Texture,
    displacementMap?: THREE.Texture,
    metalnessMap?: THREE.Texture,
    normalMap?: THREE.Texture,
    aoMap?: THREE.Texture
};


export default class MaterialLoader
 {
    private texture_paths: TexturesPath = {};
    private three_textures: TexturesThree = {};
    public material: THREE.MeshStandardMaterial;

    constructor(texturePaths: TexturesPath) 
    {
        this.texture_paths = texturePaths;
        this.material = this.createMaterial();
    }

    /**
     * This function is used to create material with texture files
     * @returns { THREE.MeshStandardMaterial } A material object
     */
    private createMaterial(): THREE.MeshStandardMaterial 
    {
        const textureLoader = new TextureLoader();

        for (const [key, path] of Object.entries(this.texture_paths))
        {
            if (path) 
            {
                if (!(key in this.three_textures))
                {
                    const texture = textureLoader.load(path);
                    texture.format = THREE.RGBAFormat
                    this.three_textures[key as keyof TexturesThree] = texture;

                }
            }
        }

        return new THREE.MeshStandardMaterial(this.three_textures);
    }
}
