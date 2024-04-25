import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as instances from '../game/instances'
import HtmlPage from '../html-page/html-page';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';


// Scene
export const scene = new THREE.Scene();

// Scene surface
export const order_html_page = [
    new HtmlPage("load-page"),
    new HtmlPage("home-page"),
    new HtmlPage("cursor-page"),
    new HtmlPage("health-page")
]

export let idx_page = 0;


// Game running
export let game_running = false;
export function change_game_running_to(is_running: boolean) {
    game_running = is_running
}

// FOG Ambiance
const near = 1;
const far = 40;
scene.fog = new THREE.Fog(0x333322, near, far);

// Camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-6.9182842130092705, 1.1729619062491528, 16.613011115597622);

export let activeCamera = instances.player.camera

export function switch_active_camera() {
    if (activeCamera === camera) {
        activeCamera = instances.player.camera;
    } else {
        activeCamera = camera;
    }
}


// Renderer
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const render = ()=>  {renderer.render(scene, activeCamera)}

// Orbit Editor
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);


// Cannon.js Word
export const cannon_world = new CANNON.World();
cannon_world.gravity.set(0, -9.82, 0)

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
        5000
    );
}

// load ressources
setTimeout(
    () => 
        {
            instances.loading.load_assets(
                [
                    // instances.diner.load_3d_object,
                    // instances.diner.load_three_object,
                    // instances.diner.load_collide,
                    // instances.diner.load_position,
                
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
                                        exitLoadingPage(htmlPage);

                                        // get Geometry, Material, number of zombie
                                        const number_of_zombies = instances.zombieInstanceMesh.number_of_entities;
                                        const material = instances.zombieLoader.properties.material_zombie1_low?.material;

                                        const geometries: THREE.BufferGeometry[] = [];
                                        let geometry: THREE.BufferGeometry | undefined;

                                        const zombie_fbx = instances.zombieLoader.properties.fbx;
                                        if (zombie_fbx) 
                                        {
                                            zombie_fbx.traverse(
                                                (child) => 
                                                    {
                                                        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) 
                                                        {
                                                            geometries.push(child.geometry);
                                                        }
                                                    }
                                            );
                                        }

                                        if (geometries.length > 0)
                                        {
                                            geometry = mergeGeometries(geometries);
                                        }

                                        instances.zombieInstanceMesh.instanced_mesh = new THREE.InstancedMesh(geometry, material, number_of_zombies);
                                        instances.zombieInstanceMesh.instanced_mesh.instanceMatrix.needsUpdate = true;
                                        instances.zombieInstanceMesh.create();
                                    }
                                );
                            }
                        );
                    }
            );
        },
    2000
);

