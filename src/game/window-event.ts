import * as THREE from 'three'
import Player from '../sprite/player';


export default class WindowEvent {
    camera: THREE.PerspectiveCamera;
    webGl_renderer: THREE.WebGLRenderer
    player: Player

    key_states: { [key: string]: boolean } = {};
    mouse_state: { [key: string]: boolean } = {};
    current_cursor_position: Array<number> = [];
    previous_cursor_position: Array<number> = [];

    smooth_factor: number = 0.1
    cursor_sensibility: number = 5;


    constructor(camera: THREE.PerspectiveCamera, webGl_renderer: THREE.WebGLRenderer, player: Player) {
        this.camera = camera
        this.webGl_renderer = webGl_renderer
        this.player = player

        window.addEventListener('resize', this.window_resize_event);
        window.addEventListener('keydown', this.window_keydown_event.bind(this));
        window.addEventListener('keyup', this.window_keyup_event.bind(this));
        window.addEventListener("mousemove", this.window_mousemove_event.bind(this));
        window.addEventListener("mousedown", this.window_mousedown_event.bind(this))
        window.addEventListener("mouseup", this.window_mouseup_event.bind(this))
    }

    window_resize_event() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.webGl_renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window_keydown_event(this: WindowEvent, key_pressed: KeyboardEvent) {
        this.key_states[key_pressed.code] = true;
    }

    window_keyup_event(this: WindowEvent, key_raised: KeyboardEvent) {
        this.key_states[key_raised.code] = false;
    }

    window_mousemove_event(this: WindowEvent, mouse: MouseEvent) {
        this.current_cursor_position = [mouse.clientX, mouse.clientY];
        this.player.moveHead()
        this.previous_cursor_position = this.current_cursor_position;
    }

    window_mousedown_event(this: WindowEvent, mouse: MouseEvent) {
        switch (mouse.button) {
            case 0:
                this.mouse_state["left"] = true
                break
            case 1:
                this.mouse_state["middle"] = true
                break
            case 2:
                this.mouse_state["right"] = true
                break
        }
    }

    window_mouseup_event(this: WindowEvent, mouse: MouseEvent) {
        switch (mouse.button) {
            case 0:
                this.mouse_state["left"] = false;
                break
            case 1:
                this.mouse_state["middle"] = false
                break
            case 2:
                this.mouse_state["right"] = false
                break
        }
    }
}