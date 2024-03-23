import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from 'three'


export default class ObjectLoader {
    private baseFBXFile : string
    private animationFBXFile? : Array<[string, string]>
    private animations_idx: number = 0
    
    animations: {[key: string]: THREE.AnimationClip} = {}
    finish_load = false
    object: THREE.Group<THREE.Object3DEventMap> | null = null


    constructor(baseFBXFile : string, animationFBXFile ?: Array<[string, string]>) {
        this.baseFBXFile = baseFBXFile
        this.animationFBXFile = animationFBXFile
        this.load()
    }

    copy() {
        if (!this.object) return
        const clone = this.object.clone(true);
        return clone;
    }

    private load() {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(this.baseFBXFile, (object) => {
                this.object = object
                
                const animationFBXFile = this.animationFBXFile

                if (animationFBXFile && animationFBXFile.length > 0) {
                    for (const animsPath of animationFBXFile) {
                        fbxLoader.load(animsPath[0], (animation) => {

                            this.animations[animsPath[1]] = animation.animations[0]

                            if (this.animations_idx === animationFBXFile.length-1) {
                                this.object = object
                                this.finish_load = true
                            } else {
                                this.animations_idx++
                            }
                        }
                    )}
                } else {
                    this.finish_load = true
                }
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );
    
    }
}

