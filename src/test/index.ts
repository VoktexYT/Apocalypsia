import * as THREE from 'three';
import * as CANNON from 'cannon'
import Game from './game';

const game = new Game();

// Initialize Cannon.js world
const world = new CANNON.World();
world.gravity.set(0, -91.82, 0);

// PLANE
const width = 2;
const height = 2;
const depth = 0.01;

const floorGeometry = new THREE.BoxGeometry(width, height, depth);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x0000aa, side:THREE.DoubleSide });
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.rotation.x = Math.PI / 2
game.scene.add(floorMesh);

const floorShape = new CANNON.Box(
    new CANNON.Vec3(
    width / 2,
    height / 2,
    depth / 2
));

let floorAngle = 100

const floorBody = new CANNON.Body({ mass: 0 });
floorBody.addShape(floorShape);

floorBody.position.set(0, 0, 0);
world.addBody(floorBody);


// BOX
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
game.scene.add(boxMesh);

const boxShape = new CANNON.Box(new CANNON.Vec3(
    boxGeometry.parameters.width/2 + 0.01,
    boxGeometry.parameters.height/2 + 0.01,
    boxGeometry.parameters.depth/2 + 0.01
));

const boxBody = new CANNON.Body({ 
    mass: 10,
    fixedRotation: false
});

boxBody.addShape(boxShape);
world.addBody(boxBody);

boxBody.position.set(0, 5, 0);

// KEYBOARD
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        boxBody.position.x += 0.1
    }
});



// LOOP
function animate() {
    requestAnimationFrame(animate);
    floorAngle += 0.3
    world.step(1 / 300);

    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        THREE.MathUtils.degToRad(floorAngle)
    )

    floorMesh.position.copy(floorBody.position);
    floorMesh.quaternion.copy(floorBody.quaternion);

    if (boxMesh.position.y < -10) {
        boxBody.velocity.y = 0
        boxBody.velocity.x = 0
        boxBody.velocity.z = 0
        boxBody.angularVelocity.set(0, 0, 0)
        boxBody.position.set(0, 5, 0)
    }

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);
    

    game.renderer.render(game.scene, game.camera);
}

animate();
