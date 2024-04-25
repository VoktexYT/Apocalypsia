import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from 'three';


interface AnimationFbxPath 
{
    path: string;
    name: string;
};

export default class ObjectLoader 
{
    animations: {[key: string]: THREE.AnimationClip} = {};
    finishLoad = false;
    baseFBXFile: string = "";
    animationFBXFile: AnimationFbxPath[] = []


    constructor(baseFBXFile: string, animationFBXFile?: AnimationFbxPath[]) 
    {
        this.baseFBXFile = baseFBXFile;

        if (animationFBXFile)
        {
            this.animationFBXFile = animationFBXFile;
        }
    }

    /**
     * This function is used to load fbx file and return a Threejs Object3d 
     * @returns A three.js Object 3d
     */
    load(): Promise<THREE.Object3D> 
    {
        return new Promise<THREE.Object3D>(
            (resolve, reject) => 
            {
                const fbxLoader = new FBXLoader();

                fbxLoader.load(this.baseFBXFile, 
                    (fbx) => 
                    {
                        if (!this.animationFBXFile || this.animationFBXFile.length === 0) 
                        {
                            this.finishLoad = true;
                            resolve(fbx);
                        }
                        
                        else
                        {
                            this.load_animations().then(
                                () =>
                                {
                                    resolve(fbx);
                                }
                            );
                        }
                    }, 
                    undefined, 
                    (error) => 
                    {
                        reject("ObjectLoader class error: " + error);
                    }
                );
            }
        );
    }

    /**
     * This function is used to load fbx animation and create an animation object
     * @returns 
     */
    private load_animations(): Promise<void> 
    {
        return new Promise<void>(
            (resolve, reject) => 
            {
                if (!this.animationFBXFile) 
                {
                    reject();
                    return;
                }

                const fbxLoader = new FBXLoader();
                const animationCount = this.animationFBXFile.length;

                this.animationFBXFile.forEach(
                    (animsPath) => 
                    {
                        fbxLoader.load(animsPath.path, 
                            (animation) => 
                            {
                                this.animations[animsPath.name] = animation.animations[0];
                                
                                if (Object.keys(this.animations).length === animationCount) 
                                {
                                    this.finishLoad = true;
                                    console.log(this.animations);
                                    resolve();
                                }
                            }
                        );
                    }
                );
            }
        );
    }
}
