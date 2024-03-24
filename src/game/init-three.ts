import * as THREE from 'three';
import * as CANNON from 'cannon';
import * as object from './object'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Create scene
export const scene = new THREE.Scene();

// Game loop
export let game_running = true;
export function change_game_running_to(is_running: boolean) {
    game_running = is_running
}

// Ambiant light
export const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0x777777);
scene.add(ambientLight);

// Camera
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(19.19, 16.33, 13.79);

// const cameraHelper = new THREE.CameraHelper(object.player.camera);
// scene.add(cameraHelper);

export let activeCamera = object.player.camera

export function switch_active_camera() {
    if (activeCamera === camera) {
        activeCamera = object.player.camera;
        controls.enabled = false
    } else {
        activeCamera = camera;
        controls.enabled = true
    }
}

// Renderer
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const render = ()=>  {renderer.render(scene, activeCamera)}

// Orbit Control
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const helpAxis = new THREE.AxesHelper(4)
// scene.add(helpAxis)

// CANNON World
export const cannon_world = new CANNON.World();
cannon_world.gravity.set(0, -9.82, 0)

