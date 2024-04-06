import ObjectLoader from "../loader/object"
import * as THREE from 'three'
import * as init from '../game/init-three'
import * as CANNON from "cannon"


export default class Basement {
    is_finish_load = false
    fbxObject: ObjectLoader | null = null

    SCALE = 0.009

    constructor() {
        this.load()
    }

    private load() {
        this.fbxObject = new ObjectLoader("./assets/env/diner.fbx")
    }

    update() {
        this.setupMesh()
    }

    private setupMesh() {
        if (this.is_finish_load) return
        if (this.fbxObject === null) return

        let meshObject = this.fbxObject.getObject()

        if (!meshObject) return

        meshObject.scale.set(this.SCALE, this.SCALE, this.SCALE)
        meshObject.position.set(0, -1.55, 0)
        
        this.is_finish_load = true

        init.scene.add(meshObject)
        
        console.info("[load]:", "Basement is loaded")
    }
}