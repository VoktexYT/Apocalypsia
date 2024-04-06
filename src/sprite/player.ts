import * as THREE from 'three'
import * as CANNON from 'cannon'

import * as init from '../game/init-three'
import * as object from '../game/object'
import HtmlPage from '../html-page/html-page'
import Bullet from './bullet'
import randomChoice from '../random.choice'


export default class Player {
    velocity = 0.1
    jump_velocity = 4
    color = 0x00BB00
    health = 100
    max_health = 100
    size = [1, 2.4, 1]
    position = [-7, 10, 21]

    mesh = new THREE.Mesh()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    theta_camera = 0
    delta_camera = 0
    
    cannon_body: CANNON.Body | null = null
    
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

    flash_light = new THREE.SpotLight(0xFF0000, 1)
    flash_light_object = new THREE.Object3D(); 
    // flash_light_helper = new THREE.SpotLightHelper(this.flash_light)


    // load player body
    load() {
        // Three.js Box
        const three_geometrie = new THREE.BoxGeometry(this.size[0], this.size[1], this.size[2]);
        const three_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(three_geometrie, three_material);

        this.flash_light = new THREE.SpotLight(0xFFFFFF, 0);

        this.flash_light.position.copy(this.camera.position)
        this.flash_light.intensity = 5
        this.flash_light.distance = 20;
        this.flash_light.angle = Math.PI / 3.5;
        this.flash_light.penumbra = 1;
        this.flash_light.decay = 1;
        this.flash_light.castShadow = true
        this.flash_light.shadow.mapSize.width = 1024;
        this.flash_light.shadow.mapSize.height = 1024;
        this.flash_light.shadow.camera.near = 500;
        this.flash_light.shadow.camera.far = 4000;
        this.flash_light.shadow.camera.fov = 30;

        this.flash_light.target = this.flash_light_object

        init.scene.add(this.mesh);
        init.scene.add(this.flash_light)
        // init.scene.add(this.flash_light_helper)
        init.scene.add(this.flash_light_object)
        
        // Cannon.js Box
        const cannon_shape = new CANNON.Box(new CANNON.Vec3(
            this.size[0] / 2,
            this.size[1] / 2,
            this.size[2] / 2
        ));

        this.cannon_body = new CANNON.Body({ mass: 1, fixedRotation: true });
        this.cannon_body.addShape(cannon_shape);
        this.cannon_body.position.set(this.position[0], this.position[1], this.position[2])

        init.cannon_world.addBody(this.cannon_body);
        this.mesh.position.copy(this.cannon_body.position)
        this.is_finish_load = true


        console.info("[load]:", "Player is loaded")
    }

    updatePosition() {
        if (this.cannon_body === null) return

        this.mesh.position.copy(this.cannon_body.position)
        this.mesh.quaternion.copy(this.cannon_body.quaternion)

        this.camera.position.set(
            this.cannon_body.position.x,
            this.cannon_body.position.y + 1,
            this.cannon_body.position.z,
        )

        this.flash_light.position.copy(this.camera.position)
        // this.flash_light_helper.update()
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
    
    event() {
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

        if (mouseStates["left"]) {
            mouseStates["left"] = false
            this.shoot()
        }

        object.gun.is_shooting_position = keyStates['Space']
    }

        
    moveBodyAlongDirection(direction: THREE.Vector3) {
        if (this.cannon_body === null) return

        const dir_pos = direction.multiplyScalar(this.velocity)

        this.cannon_body.position.x += dir_pos.x;
        this.cannon_body.position.z += dir_pos.z;
    }

    shoot() {
        if (!this.cannon_body) return 

        const position = this.cannon_body.position
        const direction = this.camera.getWorldDirection(new THREE.Vector3());

        let position_random = new THREE.Vector3(
            position.x, position.y + 1, position.z
        )

        if (!object.gun.is_shooting_position) {
            const posX = randomChoice([-0.5, -0.3, 0, 0.3, 0.5])
            const posY = randomChoice([-0.5, -0.3, 0, 0.3, 0.5])

            position_random.x += posX ? posX: 0
            position_random.y += posY ? posY: 0
        }

        this.all_bullets.push(new Bullet([
            position_random.x,
            position_random.y,
            position_random.z,
        ], direction))
  
    }

    jump() {
        this.cannon_body?.velocity.set(0, this.jump_velocity, 0)
    }

    updateFlashLightPosition() {
        const distance = 2;
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        const ray = new THREE.Ray(this.camera.position, direction);
        const newPosition = ray.at(distance, new THREE.Vector3());
        this.flash_light_object.position.copy(newPosition)
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

    respawn_after_death() {
        if (!this.cannon_body) return

        if (this.cannon_body.position.y < -5) {
            this.cannon_body.position.set(0, 10, 0)
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
            this.event()
        }

        this.respawn_after_death()
        this.isStartCamera()
        this.updatePosition()
        this.updateFlashLightPosition()
        
        this.all_bullets.forEach((bullet) => {bullet.update()})

        this.previous_health = this.health
    }
}
