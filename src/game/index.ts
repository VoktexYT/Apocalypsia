import * as init from './init-three'
import * as object from './object'

import change_camera_event from './camera'
import load_page_event from './loading'
import HtmlPage from '../html-page/html-page'

object.player.load()


function animate() {
    requestAnimationFrame(animate)


    let homePage = new HtmlPage("home-page")
    let cursorPage = new HtmlPage("cursor-page")
    homePage.searchHTML()
    cursorPage.searchHTML()

    if (!init.game_running) return

    init.cannon_world.step(1 / 60);
    
    object.floor.update()
    object.basement.update()
    object.player.update()
    object.gun.update()

    object.every_zombie.forEach((zombie) => {zombie.update()})

    init.render()

    change_camera_event()
    load_page_event()
}

animate()

