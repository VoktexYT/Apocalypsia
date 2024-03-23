import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../game/init-three'
import * as object from '../game/object'
import HtmlPage from '../html-page/html-page'
import Bullet from './bullet'


export default class Player {
    velocity = 0.1
    jump_velocity = 4
    size = 3
    color = 0x00BB00
    health = 100
    max_health = 100
    position = [-15, 1, -15]
    capsule = new THREE.Mesh()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    theta_camera = 0
    delta_camera = 0
    
    cylinderBody: CANNON.Body | null = null
    
    angleX = THREE.MathUtils.degToRad(0)
    angleY = THREE.MathUtils.degToRad(0)
    quaternionX = new THREE.Quaternion()
    quaternionY =  new THREE.Quaternion()
    axisX = new THREE.Vector3(1, 0, 0)
    axisY = new THREE.Vector3(0, 1, 0)
    
    previous_health = this.health
    finalQuaternion = new THREE.Quaternion()
    
    enableCamera = false
    is_finish_load = false

    cursor_page = new HtmlPage("cursor-page")
    health_page = new HtmlPage("health-page")

    all_bullets: Array<Bullet> = []

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

    xor(a: boolean, b: boolean): boolean {
        return (a || b) && !(a && b);
    }
    
    move() {
        const keyStates = object.window_event.key_states;
        const mouseStates = object.window_event.mouse_state;
        const direction = this.getDirection();

        if (keyStates["KeyW"])
            this.moveBodyAlongDirection(direction);
        else if (keyStates["KeyS"])
            this.moveBodyAlongDirection(direction.clone().negate());

        if (keyStates["KeyA"])
            this.moveBodyAlongDirection(new THREE.Vector3().crossVectors(this.camera.up, direction));
        
        else if (keyStates["KeyD"])
            this.moveBodyAlongDirection(new THREE.Vector3().crossVectors(this.camera.up, direction).negate());

        if (keyStates["Space"])
            this.jump()

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

        this.camera.position.set(
            this.cylinderBody.position.x,
            this.cylinderBody.position.y + 1,
            this.cylinderBody.position.z,
        )
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
        const radiusTop = 1;
        const radiusBottom = 1;
        const height = 2;
        const radialSegments = 10;
        const numSegments = 10;
        const mass = 1;
        
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
        
        this.cylinderBody.position.set(this.position[0], this.position[1], this.position[2])

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

    auto_regenerate() {
        if (this.previous_health === this.health && this.health < this.max_health) {
            this.set_health_point(+0.1)
        }
    }


    update() {
        this.auto_regenerate()

        if (this.enableCamera) {
            this.move()
        }

        this.respawn_after_death()
        this.isStartCamera()
        this.updatePosition()
        
        this.all_bullets.forEach((bullet) => {bullet.update()})

        this.previous_health = this.health
    }
}
