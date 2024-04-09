import * as THREE from 'three';
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ObjectLoader from '../loader/object';
import MaterialLoader from '../loader/material';

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

export const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})



const flameGeometry = new THREE.BufferGeometry();
const flameMaterial = new THREE.PointsMaterial({ color: 0xff6600, size: 0.1 });

const flameCount = 1000;
const flamePositions = new Float32Array(flameCount * 3);

for (let i = 0; i < flameCount; i++) {
    flamePositions[i * 3] = (Math.random() - 0.5) * 2; // x
    flamePositions[i * 3 + 1] = Math.random() * 2; // y
    flamePositions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
}

flameGeometry.setAttribute('position', new THREE.BufferAttribute(flamePositions, 3));

const flameSystem = new THREE.Points(flameGeometry, flameMaterial);
scene.add(flameSystem);




function animate() {
    requestAnimationFrame(animate);
    cannon_world.step(1 / 60);

       // Update flame positions
    for (let i = 0; i < flameCount; i++) {
        flamePositions[i * 3 + 1] += 0.01 * Math.random(); // Move upward
        flamePositions[i * 3] += 0.002 * Math.sin(i * 0.01); // Simulate turbulence
    }
    
    flameGeometry.attributes.position.needsUpdate = true; // Update buffer geometry
    


    renderer.render(scene, camera);
}

animate()

