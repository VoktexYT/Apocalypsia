import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ObjectLoader from '../loader/object';

import clone from '../skeleton.clone';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 1

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

const axeHelper = new THREE.AxesHelper(5)
scene.add(axeHelper)

export const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xFFFFFF);
scene.add(ambientLight);
const loader = new ObjectLoader("./assets/entity/zombie/models/Base mesh fbx.fbx");

let is_init = false
let instance1: THREE.Object3D
let instance2: THREE.Object3D

// Fonction d'initialisation
function init() {
    const copy = loader.getObject()
    if (!copy) return

    instance1 = clone(copy)
    instance1.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        }
    });
    instance1.scale.set(0.014, 0.014, 0.014)
    scene.add(instance1);

    instance2 = clone(copy);
    instance2.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
        }
    });
    instance2.scale.set(0.014, 0.014, 0.014);
    instance2.position.set(1, 2, 1)
    scene.add(instance2);
}

// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);

    if (loader.isFinishedLoading() && !is_init) {
        is_init = true
        init()
    }

    if (!is_init) return

    instance1.position.x += 0.001

    renderer.render(scene, camera);
}

animate()

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
