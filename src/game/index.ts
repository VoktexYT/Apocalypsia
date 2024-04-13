import * as init from './init-three'
import * as object from './object'

import * as camera_func from './camera'
import load_page_event from './loading'
import HtmlPage from '../html-page/html-page'

object.player.load()


function animate() {
    requestAnimationFrame(animate)


    let homePage = new HtmlPage("home-page");
    let cursorPage = new HtmlPage("cursor-page");
    homePage.searchHTML();
    cursorPage.searchHTML();

    if (!init.game_running) return;

    init.cannon_world.step(1 / 60);
    
    object.floor.update();
    object.basement.update();
    object.player.update();
    object.gun.update();

    object.every_zombie.forEach((zombie) => {zombie.update()})

    init.render();

    camera_func.change_camera_event();
    camera_func.look_object();
    camera_func.no_look_object();
    load_page_event();
}

animate();

