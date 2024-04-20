import * as init from './init-three'
import * as instances from '../game/instances'

import * as camera_func from '../game/camera'

import Edit from '../editor/edit';


const edit = new Edit();

function animate() {
    requestAnimationFrame(animate);


    if (!instances.loading.isFinishLoad) return;
    if (!init.game_running) return;

    // GAME LOOP

    init.cannon_world.step(1 / 60);
    init.controls.update();

    
    if (init.activeCamera === instances.player.camera) {
        instances.floor.update();
        instances.player.update();
        instances.gun.update();
        instances.every_zombie.forEach((zombie) => {zombie.update()})
    } else {
        edit.update()
    }

    init.render();
    camera_func.change_camera_event();
}

animate();

