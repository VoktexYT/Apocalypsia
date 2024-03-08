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

    angleY: number
    quaternionY: THREE.Quaternion
    axisY: THREE.Vector3

    angleX: number
    quaternionX: THREE.Quaternion
    axisX: THREE.Vector3

    enableCamera: Boolean

    finalQuaternion: THREE.Quaternion

    constructor() {
        this.size = 2
        this.color = 0xBB0000
        this.velocity = 0.1
        this.capsule = new THREE.Mesh()
        this.theta_camera = 0
        this.delta_camera = 0
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.camera.position.y = 4;
        this.camera.position.z = 5;
        this.camera.position.x = 5;

        this.angleY = THREE.MathUtils.degToRad(0)
        this.quaternionY = new THREE.Quaternion()
        this.axisY = new THREE.Vector3(0, 1, 0)

        this.angleX = THREE.MathUtils.degToRad(0)
        this.quaternionX = new THREE.Quaternion()
        this.axisX = new THREE.Vector3(1, 0, 0)

        this.finalQuaternion = new THREE.Quaternion()
        this.enableCamera = false

        this.setupCameraOrientation()
    }

    setupCameraOrientation() {
        this.quaternionY.setFromAxisAngle(this.axisY, this.angleY);
        this.quaternionX.setFromAxisAngle(this.axisX, this.angleX);
        this.finalQuaternion.multiplyQuaternions(this.quaternionY, this.quaternionX);
        this.camera.quaternion.copy(this.finalQuaternion);
    }

    isStartCamera() {
        console.log(windows.cursorPositionNow[0], window.innerWidth/2)

        if (
            windows.cursorPositionNow[0] > (window.innerWidth / 2) - 10 &&
            windows.cursorPositionNow[0] < (window.innerWidth / 2) + 10 &&
            windows.cursorPositionNow[1] > (window.innerHeight / 2) - 10 &&
            windows.cursorPositionNow[1] < (window.innerHeight / 2) + 10) {
            this.enableCamera = true
        }
    }

    movement() {
        const keys = Object.keys(windows.keysState)
        if (keys.includes("KeyW") && windows.keysState["KeyW"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            direction.setY(0).normalize();
            this.camera.position.add(direction.multiplyScalar(this.velocity));
        }

        if (keys.includes("KeyS") && windows.keysState["KeyS"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            direction.setY(0).normalize();
            this.camera.position.add(direction.multiplyScalar(-this.velocity));
        }
    }

    bodyOffset() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction).negate();

        const cylinderOffset = new THREE.Vector3(0, 0, 2);
        const cylinderPosition = this.camera.position.clone().addScaledVector(direction, 2);
        this.capsule.position.copy(cylinderPosition);

        this.capsule.position.y = this.camera.position.y - 2
    }

    load() {
        const capsuleGeometry = new THREE.CylinderGeometry(1, 1, this.size, 10);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.capsule = new THREE.Mesh(capsuleGeometry, material);
        setup.scene.add(this.capsule);
    }

    update() {
        this.isStartCamera()

        if (this.enableCamera) {
            this.bodyOffset()
            this.movement()
        }
        
    }
}
