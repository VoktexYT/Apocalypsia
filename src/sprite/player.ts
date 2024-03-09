import * as THREE from 'three'
import * as init from '../game/init-three'
import * as object from '../game/object'
import HtmlPage from '../html-page/html-page'


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

    is_finish_load = false

    cursor_page: HtmlPage


    constructor() {
        this.size = 2
        this.color = 0xBB0000
        this.velocity = 0.1
        this.capsule = new THREE.Mesh()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.cursor_page = new HtmlPage("cursor-page")

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

    setupCameraOrientation() {
        this.quaternionY.setFromAxisAngle(this.axisY, this.angleY);
        this.quaternionX.setFromAxisAngle(this.axisX, this.angleX);
        this.finalQuaternion.multiplyQuaternions(this.quaternionY, this.quaternionX);
        this.camera.quaternion.copy(this.finalQuaternion);
    }

    // Check if play cursor is on middle of screen (Add a best client experience)
    isStartCamera() {
        const is_cursor_center_screen = (
            object.window_event.current_cursor_position[0] > (window.innerWidth / 2) - 10 &&
            object.window_event.current_cursor_position[0] < (window.innerWidth / 2) + 10 &&
            object.window_event.current_cursor_position[1] > (window.innerHeight / 2) - 10 &&
            object.window_event.current_cursor_position[1] < (window.innerHeight / 2) + 10
        )
        
        if (this.enableCamera) {return}
        
        this.cursor_page.searchHTML()

        if (is_cursor_center_screen) {
            this.enableCamera = true
            this.cursor_page.disable()
        }

        else {
            this.cursor_page.enable()
        }
    }

    /**
     * PLAYER BODY MOVEMENT FUNCTIONS
     */
    getDirection(): THREE.Vector3 {
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.setY(0).normalize();
        return direction;
    }
    
    move() {
        const keyStates = object.window_event.key_states;
        const direction = this.getDirection();
    
        if (keyStates["KeyW"]) {
            this.moveCameraAlongDirection(direction, this.velocity);
        }
    
        if (keyStates["KeyS"]) {
            this.moveCameraAlongDirection(direction.clone().negate(), this.velocity);
        }
    
        if (keyStates["KeyA"]) {
            const leftVector = new THREE.Vector3().crossVectors(this.camera.up, direction);
            this.moveCameraAlongDirection(leftVector, this.velocity);
        }
    
        if (keyStates["KeyD"]) {
            const rightVector = new THREE.Vector3().crossVectors(this.camera.up, direction);
            this.moveCameraAlongDirection(rightVector.negate(), this.velocity);
        }
    }
    
    moveCameraAlongDirection(direction: THREE.Vector3, velocity: number) {
        this.camera.position.add(direction.multiplyScalar(velocity));
        this.shakeCameraIndex = (this.shakeCameraIndex + 1) % this.shakeCameraPos.length;
    }

    /**
     * PLAYER HEAD MOVEMENT FUNCTION
     */
    moveHead() {
        if (!this.enableCamera) {
            return;
        }
    
        const { current_cursor_position, previous_cursor_position, cursor_sensibility, smooth_factor } = object.window_event;
        const delta_x = (current_cursor_position[0] - previous_cursor_position[0]) * cursor_sensibility * smooth_factor;
        const delta_y = (current_cursor_position[1] - previous_cursor_position[1]) * cursor_sensibility * smooth_factor;
    
        this.angleY -= THREE.MathUtils.degToRad(delta_x);
        this.angleX -= THREE.MathUtils.degToRad(delta_y);
        
        const max_angle_x = THREE.MathUtils.degToRad(60);
        const min_angle_x = -max_angle_x;
        this.angleX = THREE.MathUtils.clamp(this.angleX, min_angle_x, max_angle_x);
    
        this.quaternionY.setFromAxisAngle(this.axisY, this.angleY);
        this.quaternionX.setFromAxisAngle(this.axisX, this.angleX);
    
        this.finalQuaternion.multiplyQuaternions(this.quaternionY, this.quaternionX);
    
        this.camera.quaternion.copy(this.finalQuaternion);

        
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
        init.scene.add(this.capsule);

        this.is_finish_load = true
        console.info("[load]:", "Player is loaded")
    }
    

    update() {
        if (this.enableCamera) {
            this.move()
        }

        this.isStartCamera()
        this.bodyOffset()

        this.camera.position.y = this.shakeCameraPos[this.shakeCameraIndex]
    }
}
