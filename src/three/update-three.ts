import * as init from './init-three';
import * as instances from '../game/instances';


function animate() 
{
    requestAnimationFrame(animate);

    if (!instances.loading.end_of_loading || !init.game_running) return;

    if (instances.level_counter.first)
    {
        instances.level_counter.update_level();
    }

    // GAME LOOP
    init.cannon_world.step(1 / 60);
    
    instances.player.update();
    instances.gun.update();
    instances.zombieGroup.update();

    init.render();
}

animate();

