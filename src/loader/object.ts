import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from 'three';


interface AnimationFbxPath {
    path: string;
    name: string;
};

export default class ObjectLoader {
    animations: {[key: string]: THREE.AnimationClip} = {};
    finishLoad = false;
    mesh: THREE.Group<THREE.Object3DEventMap> | null = null;

    constructor(private baseFBXFile: string, private animationFBXFile?: AnimationFbxPath[]) {
        this.load();
    }

    private load(): void {
        const fbxLoader = new FBXLoader();

        fbxLoader.load(this.baseFBXFile, (object) => {
            this.mesh = object;
            this.loadAnimations();
        }, undefined, (error) => {
            console.error("OBJECT LOADER:", error);
        });
    }

    private loadAnimations(): void {
        if (!this.animationFBXFile || this.animationFBXFile.length === 0) {
            this.finishLoad = true;
            return;
        };

        const fbxLoader = new FBXLoader();
        const animationCount = this.animationFBXFile.length;

        this.animationFBXFile.forEach((animsPath) => {
            fbxLoader.load(animsPath.path, (animation) => {
                this.animations[animsPath.name] = animation.animations[0];
                if (Object.keys(this.animations).length === animationCount) {
                    this.finishLoad = true;
                };
            });
        });
    }
}
