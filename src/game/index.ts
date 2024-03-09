import * as init from './init-three'
import * as object from './object'
import HtmlPage from '../html-page/html-page'


object.player.load()

let zombieANim = false

const loadPage = new HtmlPage("load-page")


function animate() {
    requestAnimationFrame(animate)



    init.controls.update()

    loadPage.searchHTML()

    if (object.FINISH_EVERY_LOADS()) {
        loadPage.disable()
    } else {
        loadPage.enable()
    }
   

    object.player.update()


    if (object.gun.is_finish_load) {
        object.gun.update()
    }

    // Create zombie animations
    if (object.zombie.is_finish_load) {
        const zombieMesh = object.zombie.entity.get_mesh();
        if (zombieMesh !== null) {
            const mixer = object.zombie.entity.get_mixer();
            if (mixer !== null) {
                mixer.update(0.04)
            }
        }

        // Auto play animation
        if (!zombieANim) {
            object.zombie.entity.play_animation("idle2")
            zombieANim = true
        }
    }

    init.render()

}

animate()

