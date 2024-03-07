import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


export const scene = new THREE.Scene();

scene.add(new THREE.AxesHelper(5));


export const ambientLight = new THREE.AmbientLight();

ambientLight.color = new THREE.Color(0x777777);

scene.add(ambientLight);


export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0.8, 1.4, 1.0);


export const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


export const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

controls.target.set(0, 1, 0);


export function render() {
    renderer.render(scene, camera)
}


