import * as THREE from 'three';
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ObjectLoader from '../loader/object';
import AudioLoader from '../loader/audio';


const scene = new THREE.Scene();
const cannon_world = new CANNON.World();
cannon_world.gravity.set(0, -9.82, 0)

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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})



new AudioLoader(camera).playSound("./assets/sound/backgroundMusic.mp3", true, 1);





function animate() {
    requestAnimationFrame(animate);
    cannon_world.step(1 / 60);


    renderer.render(scene, camera);
}

animate()

