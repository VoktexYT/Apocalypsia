import * as setup from './setup'
import * as object from './object'
import event from './windows'
import load_floor from './floor'


event()
load_floor()

object.player.load()

function animate() {
    requestAnimationFrame(animate)

    setup.controls.update()

    object.player.update()


    if (object.zombie.is_finish_load) {
        const zombieMesh = object.zombie.entity.get_mesh();
        if (zombieMesh !== null) {
            // zombieMesh.translateZ(0.002);

            const mixer = object.zombie.entity.get_mixer();

            if (mixer !== null) {
                mixer.update(0.04)
            }
        }
    }

    setup.render()

}

animate()

