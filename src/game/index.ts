import * as init from './init-three'
import * as object from './object'
import HtmlPage from '../html-page/html-page'


object.player.load()

const loadPage = new HtmlPage("load-page")


let refesh_page = false

function animate() {
    requestAnimationFrame(animate)

    if (refesh_page) {
        refesh_page = false
        window.location.reload()
    }

    if (!init.game_running) {
        refesh_page = true
        return
    }

    init.cannon_world.step(1 / 60);

    init.controls.update()

    loadPage.searchHTML()

    if (object.FINISH_EVERY_LOADS()) {
        loadPage.disable()
    } else {
        loadPage.enable()
    }
   

    object.player.update()
    object.floor.update()
    object.zombie.update()

    const ks = object.window_event.key_states
    const key_code = "Enter"
    if (Object.keys(ks).includes(key_code) && ks[key_code]) {
        ks[key_code] = false
        init.switch_active_camera()
    }


    if (object.gun.is_finish_load) {
        object.gun.update()
    }

    init.render()

}

animate()

