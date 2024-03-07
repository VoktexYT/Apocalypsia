import * as setup from './setup'
import * as object from './object'


export default function event() {
    window.addEventListener('resize', onWindowResize, false)

    window.addEventListener('keydown', (key) => {
        if (key.code === "Space") {
            object.zombie.entity.play_animation("walk")
        }

        else if (key.code === "Enter") {
            object.zombie.entity.play_animation("roar")
        }
    })
}



function onWindowResize() {
    setup.camera.aspect = window.innerWidth / window.innerHeight
    setup.camera.updateProjectionMatrix()
    setup.renderer.setSize(window.innerWidth, window.innerHeight)
    setup.render()
}
