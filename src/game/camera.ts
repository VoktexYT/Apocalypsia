import * as object from './object'
import * as init from './init-three'


export default function change_camera_event() {
    const ks = object.window_event.key_states
    const key_code = "Enter"
    if (Object.keys(ks).includes(key_code) && ks[key_code]) {
        ks[key_code] = false
        init.switch_active_camera()
    }
}