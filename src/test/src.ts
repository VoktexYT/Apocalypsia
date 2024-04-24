import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Script from './script';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

const orbit_control = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(1, 1, 1);
scene.add(light)

const script = new Script(scene, renderer, axisHelper);

script.start();

function animate() {
    requestAnimationFrame(animate);
    orbit_control.update();
    script.update();
    renderer.render(scene, camera);
}

animate();
