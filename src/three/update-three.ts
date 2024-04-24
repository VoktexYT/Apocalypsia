import * as init from './init-three'
import * as instances from '../game/instances'


function animate() {
    requestAnimationFrame(animate);


    if (!instances.loading.isFinishLoad) return;
    if (!init.game_running) return;

    // GAME LOOP
    init.cannon_world.step(1 / 60);
    
    instances.player.update();
    instances.gun.update();
    instances.zombieInstanceMesh.all_zombies.forEach((zombie) => {zombie.update()});

    init.render();
}

animate();

