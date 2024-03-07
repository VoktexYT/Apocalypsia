import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Entity from './entity';
import Zombie from './zombie';


const scene = new THREE.Scene();

scene.add(new THREE.AxesHelper(5))

// const light = new THREE.PointLight(0xffffff, 1)
// light.position.set(0.01, 1.4, 1.0)
// scene.add(light)

const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0x777777)
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

// const zombie = new Zombie(
//     scene, 
//     0.01, 
//     100, 
//     "zombie1",
//     [0, 0, 0],
//     [0.01, 0.01, 0.01]
// )

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

window.addEventListener('resize', onWindowResize, false)
window.addEventListener('keydown', (key) => {
    if (key.code === "Space") {
        // zombie.entity.play_animation("walk")
    }

    else if (key.code === "Enter") {
        // zombie.entity.play_animation("roar")
    }
})

function render() {
    renderer.render(scene, camera)
}

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()

    // if (zombie.is_finish_load) {
    //     const zombieMesh = zombie.entity.get_mesh();
    //     if (zombieMesh !== null) {
    //         // zombieMesh.translateZ(0.002);

    //         const mixer = zombie.entity.get_mixer();

    //         if (mixer !== null) {
    //             mixer.update(0.04)
    //         }
    //     }
    // }
}

animate()
