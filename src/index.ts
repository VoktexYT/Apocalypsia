import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Create scene
const scene = new THREE.Scene();

// Create AXIS
scene.add(new THREE.AxesHelper(5))

// Create Light
// const light = new THREE.PointLight(0xffffff, 1)
// light.position.set(0.01, 1.4, 1.0)
// scene.add(light)

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

// Create Cameras
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0)

// Create Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create Control Orbit
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

// Load texture
const textureLoader = new TextureLoader();
const texture_albedo = textureLoader.load('assets/textures/2_Albedo.png');
const texture_emission = textureLoader.load('assets/textures/2_Albedo.png');
const texture_gloss = textureLoader.load('assets/textures/2_Albedo.png');
const texture_height = textureLoader.load('assets/textures/2_Albedo.png');
const texture_metalikMarmoset = textureLoader.load('assets/textures/2_Albedo.png');
const texture_metalik = textureLoader.load('assets/textures/2_Albedo.png');
const texture_normal = textureLoader.load('assets/textures/2_Albedo.png');
const texture_occlusion = textureLoader.load('assets/textures/2_Albedo.png');


// Create Material
const material = new THREE.MeshStandardMaterial({
    map: texture_albedo,                    
    emissiveMap: texture_emission,      
    roughnessMap: texture_gloss,          
    displacementMap: texture_height,       
    metalnessMap: texture_metalikMarmoset,
    normalMap: texture_normal,              
    aoMap: texture_occlusion             
});

// Load Zombie
const fbxLoader = new FBXLoader()

let zombieMesh: THREE.Object3D
let zombieMixer: THREE.AnimationMixer | null = null;

fbxLoader.load(
    'assets/models/Base mesh fbx.fbx',
    (object) => {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material
                if (child.material) {
                    child.material.transparent = false
                }
            }
        })
        object.scale.set(0.01, 0.01, 0.01)
        scene.add(object)

        zombieMesh = object;

        // Load animation
        fbxLoader.load(
            'assets/models/animation/zombie@walk.fbx',
            (animation) => {
                // Check if there are any animations in the file
                if (animation.animations.length > 0) {
                    // Create animation mixer
                    zombieMixer = new THREE.AnimationMixer(zombieMesh);
                    // Get the first animation clip
                    const action = zombieMixer.clipAction(animation.animations[0]);
                    // Play the animation
                    action.play();

                    console.log(action.isRunning())
                } else {
                    console.error('No animations found in the file');
                }
            }
        );
    },
    (xhr) => {},
    (error) => {
        console.log(error)
    }
)


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
window.addEventListener('resize', onWindowResize, false)

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()

    if (zombieMesh instanceof THREE.Object3D) {
        zombieMesh.translateZ(0.002);
    }
    zombieMixer?.update(0.01)
}

animate()
