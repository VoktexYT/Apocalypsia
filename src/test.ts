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

let enableGame = false
let element = document.getElementById("icon");

if (element) {
    element.style.display = 'block'
}

//////////////////////////////
// Y angle
let angleY = THREE.MathUtils.degToRad(0);
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

const smoothFactor = 0.1;

window.addEventListener("mousemove", (event) => {
    cursorPositionNow = [event.clientX, event.clientY];

    if (enableGame) {
        const deltaX = (cursorPositionNow[0] - cursorPositionAfter[0]) * cursorSensibility;
        const deltaY = (cursorPositionNow[1] - cursorPositionAfter[1]) * cursorSensibility;

        const smoothedDeltaX = deltaX * smoothFactor;
        const smoothedDeltaY = deltaY * smoothFactor;

        angleY -= THREE.MathUtils.degToRad(smoothedDeltaX);
        angleX -= THREE.MathUtils.degToRad(smoothedDeltaY);

        quaternionY.setFromAxisAngle(axisY, angleY);
        quaternionX.setFromAxisAngle(axisX, angleX);

        finalQuaternion.multiplyQuaternions(quaternionY, quaternionX);

        camera.quaternion.copy(finalQuaternion);

        cursorPositionAfter[0] = cursorPositionNow[0];
        cursorPositionAfter[1] = cursorPositionNow[1];
    }

    else {
        cursorPositionAfter = cursorPositionNow
    }
});



window.addEventListener("keydown", (event) => {
    if (enableGame) {
        switch (event.code) {
            case "KeyW":
                const direction = new THREE.Vector3();
                camera.getWorldDirection(direction);

                // Supprimer la composante Y pour ne pas se déplacer verticalement
                direction.setY(0).normalize();

                // Mouvement vers l'avant
                camera.position.add(direction.multiplyScalar(0.1));
                break;

            case "KeyS":
                const backwardDirection = new THREE.Vector3();
                camera.getWorldDirection(backwardDirection);

                // Supprimer la composante Y pour ne pas se déplacer verticalement
                backwardDirection.setY(0).normalize();

                // Mouvement vers l'arrière (inverse de la direction vers l'avant)
                camera.position.add(backwardDirection.multiplyScalar(-0.1));
                break;
        }
    }
});



function animate() {
    requestAnimationFrame(animate);
    sc()

    if (
        cursorPositionNow[0] > (window.innerWidth / 2) - 10 &&
        cursorPositionNow[0] < (window.innerWidth / 2) + 10 &&
        cursorPositionNow[1] > (window.innerHeight / 2) - 10 &&
        cursorPositionNow[1] < (window.innerHeight / 2) + 10) {
        enableGame = true

        let element = document.getElementById("icon");

        if (element) {
            element.style.display = 'none'
        }
    }
}

animate();