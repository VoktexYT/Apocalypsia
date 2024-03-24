import * as init from './init-three'
import * as object from './object'

import change_camera_event from './camera'
import load_page_event from './loading'

object.player.load()


function animate() {
    requestAnimationFrame(animate)

    if (!init.game_running) return

    init.cannon_world.step(1 / 60);
    init.controls.update()
    
    object.player.update()
    object.floor.update()
    object.gun.update()
    object.every_zombie.forEach((zombie) => {zombie.update()})

    init.render()

    const pos = object.player.mesh.position
    init.controls.target.copy(pos);

    change_camera_event()
    load_page_event()
}

animate()

