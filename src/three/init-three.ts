import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as instances from '../game/instances'
import { setup_game_page } from '../html-page/init-html';


// Set HTML Page
setup_game_page();

// SCENE
export const scene = new THREE.Scene();

// GAME RUNNING
export let game_running = true;
export function change_game_running_to(is_running: boolean) {
    game_running = is_running
}

// FOG AMBIANCE
const near = 1;
const far = 40;
scene.fog = new THREE.Fog(0x232312, near, far);


// RENDERER
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const render = ()=>  {renderer.render(scene, instances.player.camera)}


// CANNON.JS
export const cannon_world = new CANNON.World();
cannon_world.gravity.set(0, -9.82, 0)

// INTRO PROPERTIES
export const fadein_time = 5000;


/**
 * This function is used to add fade animation to page
 * @param htmlPage 
 */
function exitLoadingPage(htmlPage: HTMLElement) : void
{
    htmlPage.classList.toggle("fadeout");

    setTimeout(
        () => 
            {
                htmlPage.innerHTML = "";
                game_running = true;

                const canvasPage = document.querySelector("canvas");
                
                if (canvasPage)
                {
                    canvasPage.classList.toggle("fadein")
                }
            },
        fadein_time
    );
}

// load ressources
setTimeout(
    () => 
        {
            instances.loading.load_assets(
                [
                    instances.diner.load_3d_object,
                    instances.diner.load_three_object,
                    instances.diner.load_collide,
                    instances.diner.load_position,
                
                    instances.zombieLoader.load_3d_object,
                    instances.zombieLoader.load_zombie_material,
                    instances.zombieLoader.load_audio,
                
                    instances.gunLoader.load_pistol_fbx,
                    instances.gunLoader.load_rifle_fbx,
                    instances.gunLoader.load_pistol_material,
                    instances.gunLoader.load_rifle_material,
                    instances.gunLoader.load_audio,
                ]
            ).then(
                async (htmlPage: HTMLElement) => 
                    {
                        await instances.gun.load().then(() => 
                            {
                                instances.player.load().then(() => 
                                    {
                                        instances.floor.setup();
                                        instances.zombieGroup.create();
                                        instances.level_counter.load_audio();
                                        instances.popup.load_audio();
                                        
                                        exitLoadingPage(htmlPage);
                                    }
                                );
                            }
                        );
                    }
            );
        },
    2000
);

