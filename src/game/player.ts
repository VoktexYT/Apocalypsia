import * as THREE from 'three'
import * as setup from './setup'
import * as windows from './windows'


export default class Player {
    velocity: number
    size: number
    color: THREE.ColorRepresentation
    capsule: THREE.Mesh
    camera: THREE.PerspectiveCamera
    theta_camera: number
    delta_camera: number

    constructor() {
        this.size = 2
        this.color = 0xBB0000
        this.velocity = 0.5
        this.capsule = new THREE.Mesh()
        this.theta_camera = 0
        this.delta_camera = 0
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    move_left_side() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        const rightVector = new THREE.Vector3(); 
        this.camera.getWorldDirection(rightVector).cross(this.camera.up);
        this.camera.position.add(rightVector.multiplyScalar(-this.velocity));
    }

    move_right_side() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction); 
        const rightVector = new THREE.Vector3(); 
        this.camera.getWorldDirection(rightVector).cross(this.camera.up); 
        this.camera.position.add(rightVector.multiplyScalar(+this.velocity));
    }

    move_forward() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction); 
        const forwardDirection = new THREE.Vector3(0, 0, -1);
        forwardDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
        this.camera.position.add(forwardDirection.multiplyScalar(this.velocity));
    }

    move_backward() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction); 
        const backwardDirection = new THREE.Vector3(0, 0, 1);
        backwardDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
        this.camera.position.add(backwardDirection.multiplyScalar(this.velocity));
    }

    load() {
        const capsuleGeometry = new THREE.CylinderGeometry(1, 1, this.size, 10);

        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.capsule = new THREE.Mesh(capsuleGeometry, material);
        this.update()

        setup.scene.add(this.capsule);

        this.camera.position.set(0, 3, 0)
    }

    update_camera_rotation() {
        this.camera.rotation.y = -this.theta_camera;

        const maxPitch = Math.PI / 2;
        this.camera.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, -this.delta_camera));

        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);

    }

    update() {
        if (Object.keys(windows.keysState).includes("KeyA") && windows.keysState["KeyA"]) {
            this.move_left_side()
        } else if (Object.keys(windows.keysState).includes("KeyD") && windows.keysState["KeyD"]) {
            this.move_right_side()
        } 
        
        if (Object.keys(windows.keysState).includes("KeyW") && windows.keysState["KeyW"]) {
            this.move_forward()
        } else if (Object.keys(windows.keysState).includes("KeyS") && windows.keysState["KeyS"]) {
            this.move_backward()
        }

        this.capsule.position.set(this.camera.position.x, this.camera.position.y-2, this.camera.position.z)
    }
}
