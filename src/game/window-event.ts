import * as THREE from 'three'

import Player from '../sprite/player';


export default class WindowEvent {
    camera: THREE.PerspectiveCamera;
    webGl_renderer: THREE.WebGLRenderer;
    player: Player;

    key_states: { [key: string]: boolean }  = {};
    mouse_state: { [key: string]: boolean } = {};
    current_cursor_position: Array<number>  = [];
    previous_cursor_position: Array<number> = [];

    smooth_factor:      number = 0.1;
    cursor_sensibility: number = 5;


    constructor(camera: THREE.PerspectiveCamera, webGl_renderer: THREE.WebGLRenderer, player: Player) {
        this.camera = camera;
        this.webGl_renderer = webGl_renderer;
        this.player = player;

        window.addEventListener('resize', this.window_resize_event);
        window.addEventListener('keydown', this.window_keydown_event.bind( this ));
        window.addEventListener('keyup', this.window_keyup_event.bind( this ));
        window.addEventListener("mousemove", this.window_mousemove_event.bind( this ));
        window.addEventListener("mousedown", this.window_mousedown_event.bind( this ));
        window.addEventListener("mouseup", this.window_mouseup_event.bind( this ));
    }

    window_resize_event() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.webGl_renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window_keydown_event(this: WindowEvent, key_pressed: KeyboardEvent) {
        this.key_states[key_pressed.code] = true;
    }

    window_keyup_event(this: WindowEvent, key_raised: KeyboardEvent) {
        this.key_states[key_raised.code] = false;
    }

    window_mousemove_event(this: WindowEvent, mouse: MouseEvent) {
        this.current_cursor_position = [mouse.clientX, mouse.clientY];
        this.player.moveHead();
        this.previous_cursor_position = this.current_cursor_position;
    }

    window_mousedown_event(this: WindowEvent, mouse: MouseEvent) {
        const mouse_code = mouse.button

        this.mouse_state["left"] = mouse_code === 0;
        this.mouse_state["middle"] = mouse_code === 1;
        this.mouse_state["right"] = mouse_code === 2;
    }

    window_mouseup_event(this: WindowEvent, mouse: MouseEvent) {
        const mouse_code = mouse.button

        this.mouse_state["left"] = mouse_code !== 0;
        this.mouse_state["middle"] = mouse_code !== 1;
        this.mouse_state["right"] = mouse_code !== 2;
    }
}