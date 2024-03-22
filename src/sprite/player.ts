import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../game/init-three'
import * as object from '../game/object'
import HtmlPage from '../html-page/html-page'
import Bullet from './bullet'


export default class Player {
    velocity: number
    size: number
    color: THREE.ColorRepresentation
    capsule: THREE.Mesh
    camera: THREE.PerspectiveCamera
    theta_camera: number
    delta_camera: number

    // setup cylinder body
    cylinderBody: CANNON.Body | null = null

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
    health_page = new HtmlPage("health-page")

    jump_velocity = 4

    health = 100
    max_health = 100
    previous_health = this.health

    all_bullets: Array<Bullet> = []


    constructor() {
        this.size = 3
        this.color = 0x00BB00
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
        
        if (init.activeCamera === init.camera) {
            this.cursor_page.disable()
            return
        }

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
        const mouseStates = object.window_event.mouse_state;
        const direction = this.getDirection();
    
        if (keyStates["KeyW"]) {
            this.moveBodyAlongDirection(direction);
        }
    
        if (keyStates["KeyS"]) {
            this.moveBodyAlongDirection(direction.clone().negate());
        }
    
        if (keyStates["KeyA"]) {
            const leftVector = new THREE.Vector3().crossVectors(this.camera.up, direction);
            this.moveBodyAlongDirection(leftVector);
        }
    
        if (keyStates["KeyD"]) {
            const rightVector = new THREE.Vector3().crossVectors(this.camera.up, direction);
            this.moveBodyAlongDirection(rightVector.negate());
        }

        if (keyStates["Space"]) {
            this.jump()
        }

        if (mouseStates["left"]) {
            mouseStates["left"] = false
            this.shoot()
        }
    }

    shoot() {
        if (!this.cylinderBody) return 

        const position = this.cylinderBody.position
        const direction = this.camera.getWorldDirection(new THREE.Vector3());

        this.all_bullets.push(new Bullet([
            position.x,
            position.y+1,
            position.z,
        ], direction))
    }

    jump() {
        this.cylinderBody?.velocity.set(0, this.jump_velocity, 0)        
    }
    
    moveBodyAlongDirection(direction: THREE.Vector3) {
        if (this.cylinderBody === null) return
        const dir_pos = direction.multiplyScalar(this.velocity)

        this.cylinderBody.position.x += dir_pos.x;
        this.cylinderBody.position.z += dir_pos.z;
    }

    updatePosition() {
        if (this.cylinderBody === null) return

        this.capsule.position.copy(this.cylinderBody.position)
        this.capsule.quaternion.copy(this.cylinderBody.quaternion)

        this.camera.position.x = this.cylinderBody.position.x
        this.camera.position.y = this.cylinderBody.position.y+1
        this.camera.position.z = this.cylinderBody.position.z

        // this.shakeCameraIndex = (this.shakeCameraIndex + 1) % this.shakeCameraPos.length;
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

    // load player body
    load() {
        const radiusTop = 1; // Radius of the cylinder at the top
        const radiusBottom = 1; // Radius of the cylinder at the bottom
        const height = 2; // Height of the cylinder
        const radialSegments = 10; // Number of segments around the circumference of the cylinder
        const numSegments = 10; // Number of segments for Cannon.js cylinder approximation
        const mass = 1; // Mass of the cylinder
        
        // Three.js Cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Specify color as needed
        this.capsule = new THREE.Mesh(cylinderGeometry, material);
        init.scene.add(this.capsule);
        
        // Cannon.js Cylinder
        const cylinderShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
        this.cylinderBody = new CANNON.Body({ mass: mass, fixedRotation: true });
        this.cylinderBody.addShape(cylinderShape);
        init.cannon_world.addBody(this.cylinderBody);
        
        this.cylinderBody.position.set(2, 11, 2)

        this.is_finish_load = true

        console.info("[load]:", "Player is loaded")
    }

    respawn_after_death() {
        if (!this.cylinderBody) return

        if (this.cylinderBody.position.y < -5) {
            this.cylinderBody.position.set(0, 10, 0)
        }
    }

    set_health_point(hp: number) {
        this.health_page.searchHTML()
        this.health_page.enable()
        const dom = this.health_page.dom_element
        if (!dom) return

        this.health += hp

        if (this.health < 0) {
            this.health = 0
            this.health_page.disable()
            init.change_game_running_to(false)
        }
        else if (this.health > this.max_health) {
            this.health = this.max_health
        }
        
        const health_percent = this.health / this.max_health;

        dom.style.opacity = (1 - health_percent).toString()
    }


    update() {
        if (this.previous_health === this.health) {
            this.set_health_point(+0.1)
        }

        if (this.enableCamera) {
            this.move()
        }

        this.respawn_after_death()
        this.isStartCamera()
        this.updatePosition()

        for (let b of this.all_bullets) {
            b.update()
        }

        this.previous_health = this.health
    }
}
