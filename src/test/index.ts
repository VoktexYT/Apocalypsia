import * as THREE from 'three';
import * as CANNON from 'cannon'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


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

let instance1: THREE.Object3D
let instance2: THREE.Object3D

let box1: CANNON.Body
let box2: CANNON.Body


function init() {
    // Box 1
    const g1 = new THREE.BoxGeometry(1, 1, 1);
    const m1 = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true });
    instance1 = new THREE.Mesh(g1, m1);
    instance1.position.set(1, 1, 1)

    const c1Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const c1Mat = new CANNON.Material("bullet");
    c1Mat.friction = 0
    c1Mat.restitution = 0
    box1 = new CANNON.Body({ mass: 0, fixedRotation: true, shape: c1Shape, material: c1Mat });
    box1.position.set(1, 1, 1)
    
    
    // Box 2
    const g2 = new THREE.BoxGeometry(1, 1, 1);
    const m2 = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true });
    instance2 = new THREE.Mesh(g2, m2);
    instance2.position.set(1, 1, 3)
    
    const c2Shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const c2Mat = new CANNON.Material("bullet");
    c2Mat.friction = 0
    c2Mat.restitution = 0
    box2 = new CANNON.Body({ mass: 0, fixedRotation: true, shape: c2Shape, material: c2Mat });
    box2.position.set(1, 1, 3)
    
    scene.add(instance1)
    scene.add(instance2)
    cannon_world.addBody(box1)
    cannon_world.addBody(box2)
}

init()


// Fonction d'animation
function animate() {
    requestAnimationFrame(animate);
    cannon_world.step(1 / 60);

    box1.position.z += 0.01

    instance1.position.copy(box1.position)
    instance2.position.copy(box2.position)

    if (box1.position.distanceTo(box2.position) < 1) {
        console.log("COLLIDE !")
    }

    renderer.render(scene, camera);
}

animate()

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
