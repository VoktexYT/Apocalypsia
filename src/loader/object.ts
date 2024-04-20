import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from 'three';


interface AnimationFbxPath {
    path: string;
    name: string;
};

export default class ObjectLoader {
    animations: {[key: string]: THREE.AnimationClip} = {};
    finishLoad = false;
    baseFBXFile: string = "";
    animationFBXFile: AnimationFbxPath[] = []


    constructor(baseFBXFile: string, animationFBXFile?: AnimationFbxPath[]) {
        this.baseFBXFile = baseFBXFile;

        if (animationFBXFile)
            this.animationFBXFile = animationFBXFile;
    }

    load(): Promise<THREE.Object3D> {
        return new Promise<THREE.Object3D>((resolve, reject) => {
            const fbxLoader = new FBXLoader();

            fbxLoader.load(this.baseFBXFile, (object) => {
                if (!this.animationFBXFile || this.animationFBXFile.length === 0) {
                    this.finishLoad = true;
                    resolve(object);
                } else {
                    this.loadAnimations().then(() => {
                        resolve(object);
                    });
                }
            }, undefined, (error) => {
                reject("ObjectLoader class error: " + error);
            });
        })
    }

    private loadAnimations(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.animationFBXFile) {
                reject();
                return;
            }

            const fbxLoader = new FBXLoader();
            const animationCount = this.animationFBXFile.length;

            this.animationFBXFile.forEach((animsPath) => {
                fbxLoader.load(animsPath.path, (animation) => {
                    this.animations[animsPath.name] = animation.animations[0];
                    if (Object.keys(this.animations).length === animationCount) {
                        this.finishLoad = true;
                        resolve()
                    };
                });
            });

        })

        
    }
}
