import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Entity, { MixerPack, TexturesPath } from './entity';


// Create scene
const scene = new THREE.Scene();

// Create AXIS
scene.add(new THREE.AxesHelper(5))

// Create Light
// const light = new THREE.PointLight(0xffffff, 1)
// light.position.set(0.01, 1.4, 1.0)
// scene.add(light)

const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0x777777)
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

// Create zombie
const zombie = new Entity()
    .set_velocity(0.02)
    .set_health_point(100)
    .set_name("zombieTest1")
    .set_textures({
        map:             "assets/entity/zombie/textures/2_Albedo.png",
        emissiveMap:     "assets/entity/zombie/textures/2_Emission.png",
        roughnessMap:    "assets/entity/zombie/textures/2_gloss.png",
        displacementMap: "assets/entity/zombie/textures/2_Height.png",
        metalnessMap:    "assets/entity/zombie/textures/2_metalik marmoset.png",
        normalMap:       "assets/entity/zombie/textures/2_Normal.png",
        aoMap:           "assets/entity/zombie/textures/2_Occlusion.png"
    })

let zombieFinishLoad: Boolean = false;
const zombieANimationIdx = 10;

zombie.load(
    scene,
    "assets/entity/zombie/models/Base mesh fbx.fbx",
    [
        ["assets/entity/zombie/animation/zombie@atack1.fbx", "attack1"],
        ["assets/entity/zombie/animation/zombie@atack2.fbx", "attack2"],
        ["assets/entity/zombie/animation/zombie@atack3.fbx", "attack3"],
        ["assets/entity/zombie/animation/zombie@atack4.fbx", "attack4"],
        ["assets/entity/zombie/animation/zombie@death1.fbx", "death1"],
        ["assets/entity/zombie/animation/zombie@death2.fbx", "death2"],
        ["assets/entity/zombie/animation/zombie@gethit.fbx", "gethit"],
        ["assets/entity/zombie/animation/zombie@idle1.fbx", "idle1"],
        ["assets/entity/zombie/animation/zombie@idle2.fbx", "idle2"],
        ["assets/entity/zombie/animation/zombie@roar.fbx", "roar"],
        ["assets/entity/zombie/animation/zombie@walk.fbx", "walk"]
    ]
).then((finishLoad) => {
    zombieFinishLoad = finishLoad
    
});


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

window.addEventListener('resize', onWindowResize, false)
window.addEventListener('keydown', (key) => {
    if (key.code === "Space") {
        zombie.play_animation("walk")
    }

    else if (key.code === "Enter") {
        zombie.play_animation("roar")
    }
})

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()

    if (zombieFinishLoad) {
        const zombieMesh = zombie.get_mesh();
        if (zombieMesh !== null) {
            // zombieMesh.translateZ(0.002);

            const mixer = zombie.get_mixer();

            if (mixer !== null) {
                mixer.update(0.04)
            }
        }
    }
}

animate()
