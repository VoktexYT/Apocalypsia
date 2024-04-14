import * as init from './init-three'
import * as object from './object'
import * as THREE from 'three';

import * as camera_func from './camera'
import load_page_event from './loading'
import HtmlPage from '../html-page/html-page'

import Edit from '../collide-editor/edit';


// object.gun.set_music()
object.player.load()

// const edit = new Edit();


function animate() {
    requestAnimationFrame(animate);
    init.controls.update();

    let homePage = new HtmlPage("home-page");
    let cursorPage = new HtmlPage("cursor-page");
    homePage.searchHTML();
    cursorPage.searchHTML();

    if (!init.game_running) return;

    init.cannon_world.step(1 / 60);
    
    if (init.activeCamera === object.player.camera) {
        object.floor.update();
        object.basement.update();
        object.player.update();
        object.gun.update();
        object.every_zombie.forEach((zombie) => {zombie.update()})
    } else {
        // edit.update()
    }
    
    init.render();
    camera_func.change_camera_event();
    load_page_event();
}

animate();

