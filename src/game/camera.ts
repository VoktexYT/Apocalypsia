import * as object from '../game/instances';
import * as init from '../three/init-three';


/**
 * This function is used to change user camera.
 */
export function change_camera_event() {
    init.next_page()
    
    const keyStates = object.window_event.key_states;
    const keyType = "Enter";
    
    if (keyStates[keyType]) {
        keyStates[keyType] = false;
        init.switch_active_camera();
    }
}
