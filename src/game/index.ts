import * as setup from './setup'
import * as object from './object'
import event from './windows'
import load_floor from './floor'


event()
load_floor()

object.player.load()

let zombieANim = false

function animate() {
    requestAnimationFrame(animate)

    setup.controls.update()
    object.player.update()

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

    setup.render()

}

animate()

