import * as THREE from 'three';
import * as object from './object'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export const scene = new THREE.Scene();


export const axe_helper = new THREE.AxesHelper(5);

scene.add(axe_helper);


export const ambientLight = new THREE.AmbientLight();

ambientLight.color = new THREE.Color(0x777777);

scene.add(ambientLight);


const cameraHelper = new THREE.CameraHelper(object.player.camera);
scene.add(cameraHelper);


export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(19.19, 16.33, 13.79);


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

export const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


export const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

controls.target.set(0, 1, 0);


export function render() {
    renderer.render(scene, activeCamera)
}


