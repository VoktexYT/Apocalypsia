import * as init from './init-three'
import * as instances from '../game/instances'


function animate() 
{
    requestAnimationFrame(animate);

    if (!instances.loading.end_of_loading) return;
    if (!init.game_running) return;


    // GAME LOOP
    init.cannon_world.step(1 / 60);
    
    instances.player.update();
    instances.gun.update();

    instances.zombieInstanceMesh.all_zombies.forEach((zombie) => {zombie.update()});
    instances.zombieInstanceMesh.update();
    init.render();

    init.camera.updateProjectionMatrix()
}

animate();

