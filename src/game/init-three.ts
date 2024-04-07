import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as object from './object'
import HtmlPage from '../html-page/html-page';


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

export function incIdx() {
    idx_page++
}

// Game running
export let game_running = true;
export function change_game_running_to(is_running: boolean) {
    game_running = is_running
}

// Ambiant light
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

// FOG Ambiance
const near = 1;
const far = 40;
scene.fog = new THREE.Fog(0x555555, near, far);

// Camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-6.9182842130092705, 1.1729619062491528, 16.613011115597622);

export let activeCamera = camera

export function switch_active_camera() {
    if (activeCamera === camera) {
        activeCamera = object.player.camera;
    } else {
        activeCamera = camera;
    }
}

// Renderer
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const render = ()=>  {renderer.render(scene, activeCamera)}

// Cannon.js Word
export const cannon_world = new CANNON.World();
cannon_world.gravity.set(0, -9.82, 0)


