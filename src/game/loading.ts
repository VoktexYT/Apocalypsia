import * as object from './object'
import HtmlPage from '../html-page/html-page';

const loadPage = new HtmlPage("load-page")

const is_finish_loading = () => {
    let all_load = [
        object.player.is_finish_load,
        object.gun.is_finish_load,
        object.floor.is_finish_load,
        object.basement.is_finish_load
    ]

    for (const zombie of object.every_zombie) {
        all_load.push(zombie.is_finish_load)
    }
    
    return all_load.every(val => val === true)
};

export default function load_page_event() {
    loadPage.searchHTML()

    if (is_finish_loading()) {
        loadPage.disable()
    } else {
        loadPage.enable()
    }
}