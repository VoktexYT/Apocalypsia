import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;
camera.position.z = 5;
scene.add(new THREE.CameraHelper(camera));
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.x = 7.9882;
camera2.position.y = 3.1157;
camera2.position.z = 7.2503;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
export const controls = new OrbitControls(camera2, renderer.domElement);
controls.enableDamping = true;
controls.target.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(new THREE.AxesHelper(10));
const geometry = new THREE.BoxGeometry(10, 1, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00AA00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
let switch_cam = true
window.addEventListener("keydown", (event) => {if (event.code === "Space") switch_cam = !switch_cam;});
const sc = () => {
    if (switch_cam)renderer.render(scene, camera);
    else renderer.render(scene, camera2);
}

//////////////////////////////
// Y angle
let angleY = THREE.MathUtils.degToRad(90);
let quaternionY = new THREE.Quaternion();
let axisY = new THREE.Vector3(0, 1, 0);
quaternionY.setFromAxisAngle(axisY, angleY);

// X angle
let angleX = THREE.MathUtils.degToRad(0);
let quaternionX = new THREE.Quaternion();
let axisX = new THREE.Vector3(1, 0, 0);
quaternionX.setFromAxisAngle(axisX, angleX);

let finalQuaternion = new THREE.Quaternion();
finalQuaternion.multiplyQuaternions(quaternionY, quaternionX);

camera.quaternion.copy(finalQuaternion);

let cursorPositionAfter = [0, 0];
let cursorPositionNow = [0, 0];
let cursorSensibility = 3

// Facteur de lissage
const smoothFactor = 0.1;

window.addEventListener("mousemove", (event) => {
    cursorPositionNow = [event.clientX, event.clientY];

    // Calculer la différence de position de la souris
    const deltaX = (cursorPositionNow[0] - cursorPositionAfter[0]) * cursorSensibility;
    const deltaY = (cursorPositionNow[1] - cursorPositionAfter[1]) * cursorSensibility;

    // Appliquer le lissage
    const smoothedDeltaX = deltaX * smoothFactor;
    const smoothedDeltaY = deltaY * smoothFactor;

    // Mettre à jour les angles en fonction des mouvements de la souris
    angleY -= THREE.MathUtils.degToRad(smoothedDeltaX);
    angleX -= THREE.MathUtils.degToRad(smoothedDeltaY);

    // Mettre à jour les quaternions de rotation
    quaternionY.setFromAxisAngle(axisY, angleY);
    quaternionX.setFromAxisAngle(axisX, angleX);

    // Calculer le quaternion final
    finalQuaternion.multiplyQuaternions(quaternionY, quaternionX);

    // Appliquer le quaternion final à la caméra
    camera.quaternion.copy(finalQuaternion);

    // Mettre à jour la position de la souris
    cursorPositionAfter[0] = cursorPositionNow[0];
    cursorPositionAfter[1] = cursorPositionNow[1];
});



window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "KeyW":
            const direction = new THREE.Vector3();
            camera.getWorldDirection(direction); 
            direction.setY(0).normalize()
            const forwardDirection = new THREE.Vector3(0, 0, 1);
            forwardDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y);
            camera.position.add(forwardDirection.multiplyScalar(-0.1));
            break;
        // case "ArrowUp":
        //     angleX += THREE.MathUtils.degToRad(1);
        //     quaternionX.setFromAxisAngle(axisX, angleX);
        //     finalQuaternion.multiplyQuaternions(quaternionY, quaternionX);
        //     camera.quaternion.copy(finalQuaternion);
        //     break;
        // case "ArrowDown":
        //     angleX -= THREE.MathUtils.degToRad(1);
        //     quaternionX.setFromAxisAngle(axisX, angleX);
        //     finalQuaternion.multiplyQuaternions(quaternionY, quaternionX);
        //     camera.quaternion.copy(finalQuaternion);
        //     break;
        // case "ArrowLeft":
        //     angleY += THREE.MathUtils.degToRad(1);
        //     quaternionY.setFromAxisAngle(axisY, angleY);
        //     finalQuaternion.multiplyQuaternions(quaternionX, quaternionY);
        //     camera.quaternion.copy(finalQuaternion);
        //     break;
        // case "ArrowRight":
        //     angleY -= THREE.MathUtils.degToRad(1);
        //     quaternionY.setFromAxisAngle(axisY, angleY);
        //     finalQuaternion.multiplyQuaternions(quaternionX, quaternionY);
        //     camera.quaternion.copy(finalQuaternion);
        //     break;
    }
});


function animate() {
    requestAnimationFrame(animate);
    sc()
}

animate();