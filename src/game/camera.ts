import * as object from './object'
import * as init from './init-three'
import * as THREE from 'three'
import { Vector2 } from 'three'


export function change_camera_event() {
    init.incIdx()
    
    const keyStates = object.window_event.key_states;
    const keyType = "Enter";
    
    if (keyStates[keyType]) {
        keyStates[keyType] = false;
        init.switch_active_camera();
    }
}



export function no_look_object() {
    init.raycaster.setFromCamera(new Vector2(0, 0), object.player.camera);

    var intersects = init.raycaster.intersectObjects(init.scene.children, true);

    intersects.forEach(function(intersect) {
        if (intersect.object instanceof THREE.Mesh) {
            if (intersect.object.material && intersect.object.material.map) {
                intersect.object.material.map.needsUpdate = true;
            }
        }
    });
}


export function look_object() {
    init.scene.traverse(function(objet) {
        if (objet instanceof THREE.Mesh) {
            if (objet.material && objet.material.map && objet.material.map.needsUpdate) {
                objet.material.map.needsUpdate = false;
            }
        }
    });
}
