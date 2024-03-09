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

    shakeCameraMax: number
    shakeCameraMin: number
    shakeCameraFrame: number
    shakeCameraIndex: number
    shakeCameraPos: Array<number>

    constructor() {
        this.size = 2
        this.color = 0xBB0000
        this.velocity = 0.1
        this.capsule = new THREE.Mesh()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Setup camera orientation
        this.theta_camera = 0
        this.delta_camera = 0

        this.camera.position.y = 3;
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

        // Add movement effect (Simulate player steps)
        this.shakeCameraMax = 3.3
        this.shakeCameraMin = 3
        this.shakeCameraFrame = 25
        this.shakeCameraPos = []
        this.shakeCameraIndex = 0
        this.makeShakeCamPosY()

        this.setupCameraOrientation()
    }

    // Make list of future y axis position
    makeShakeCamPosY() {
        const diff = this.shakeCameraMax - this.shakeCameraMin
        const frame = diff / this.shakeCameraFrame

        for (let i=0; i<this.shakeCameraFrame; i++) {
            this.shakeCameraPos.push(this.shakeCameraMin+frame*i)
        }

        for (let i=this.shakeCameraFrame-1; i>=0; i--) {
            this.shakeCameraPos.push(this.shakeCameraMin+frame*i)
        }
    }

    // Browse list of y axis pos
    addIndexShakeCamera() {
        if (this.shakeCameraIndex === this.shakeCameraPos.length-1) {
            this.shakeCameraIndex = 0
        }

        this.shakeCameraIndex++
    }

    setupCameraOrientation() {
        this.quaternionY.setFromAxisAngle(this.axisY, this.angleY);
        this.quaternionX.setFromAxisAngle(this.axisX, this.angleX);
        this.finalQuaternion.multiplyQuaternions(this.quaternionY, this.quaternionX);
        this.camera.quaternion.copy(this.finalQuaternion);
    }

    // Check if play cursor is on middle of screen (Add a best client experience)
    isStartCamera() {
        if (
            windows.cursorPositionNow[0] > (window.innerWidth / 2) - 10 &&
            windows.cursorPositionNow[0] < (window.innerWidth / 2) + 10 &&
            windows.cursorPositionNow[1] > (window.innerHeight / 2) - 10 &&
            windows.cursorPositionNow[1] < (window.innerHeight / 2) + 10) {
            this.enableCamera = true

            let page = document.getElementById("page")
            if (page) {
                page.style.cursor = "none"
            }
        }
    }

    // Move player and Camera on camera orientation angle
    movement() {
        const keys = Object.keys(windows.keysState)
        if (keys.includes("KeyW") && windows.keysState["KeyW"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            direction.setY(0).normalize();
            this.camera.position.add(direction.multiplyScalar(this.velocity));
            this.addIndexShakeCamera()
        }

        if (keys.includes("KeyS") && windows.keysState["KeyS"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            direction.setY(0).normalize();
            this.camera.position.add(direction.multiplyScalar(-this.velocity));
            this.addIndexShakeCamera()
        }

        if (keys.includes("KeyA") && windows.keysState["KeyA"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);

            direction.setY(0).normalize();

            const rightVector = new THREE.Vector3(); 
            this.camera.getWorldDirection(rightVector).cross(this.camera.up);
            this.camera.position.add(rightVector.multiplyScalar(-this.velocity));
            this.addIndexShakeCamera()
        }

        if (keys.includes("KeyD") && windows.keysState["KeyD"]) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);

            direction.setY(0).normalize();
            
            const rightVector = new THREE.Vector3(); 
            this.camera.getWorldDirection(rightVector).cross(this.camera.up);
            this.camera.position.add(rightVector.multiplyScalar(this.velocity));
            this.addIndexShakeCamera()
        }
    }

    // offset the player body of camera (A best client experience)
    bodyOffset() {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction).negate();

        const cylinderPosition = this.camera.position.clone().addScaledVector(direction, 1);
        this.capsule.position.copy(cylinderPosition);

        this.capsule.position.y = this.camera.position.y - 1
    }

    // load player body
    load() {
        const capsuleGeometry = new THREE.CylinderGeometry(1, 1, this.size, 10);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.capsule = new THREE.Mesh(capsuleGeometry, material);
        setup.scene.add(this.capsule);
    }

    update() {
        this.isStartCamera()
        this.bodyOffset()

        if (this.enableCamera) {
            this.movement()
        }

        this.camera.position.y = this.shakeCameraPos[this.shakeCameraIndex]
        
    }
}
