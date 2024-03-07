import * as setup from './setup'
import * as object from './object'
import event from './windows'


event()

function animate() {
    requestAnimationFrame(animate)
    setup.controls.update()
    setup.render()

    if (object.zombie.is_finish_load) {
        const zombieMesh = object.zombie.entity.get_mesh();
        if (zombieMesh !== null) {
            zombieMesh.translateZ(0.002);

            const mixer = object.zombie.entity.get_mixer();

            if (mixer !== null) {
                mixer.update(0.04)
            }
        }
    }
}

animate()
