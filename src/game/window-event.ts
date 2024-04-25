import * as instances from '../game/instances';
import * as THREE from 'three';


export default class WindowEvent 
{
    public camera: THREE.PerspectiveCamera;
    public webGl_renderer: THREE.WebGLRenderer;

    public key_states: { [key: string]: boolean } = {};
    public mouse_state: { [key: string]: boolean } = {};
    public current_cursor_position: Array<number> = [];
    public previous_cursor_position: Array<number> = [];
    public wheel_states: { up: boolean, down: boolean } = { up: false, down: false }

    public smooth_factor: number = 0.1;
    public cursor_sensibility: number = 5;


    constructor(camera: THREE.PerspectiveCamera, webGl_renderer: THREE.WebGLRenderer)
    {
        this.camera = camera;
        this.webGl_renderer = webGl_renderer;

        window.addEventListener('resize',    this.window_resize_event);
        window.addEventListener('keydown',   this.window_keydown_event.bind( this ));
        window.addEventListener('keyup',     this.window_keyup_event.bind( this ));
        window.addEventListener("mousemove", this.window_mousemove_event.bind( this ));
        window.addEventListener("mousedown", this.window_mousedown_event.bind( this ));
        window.addEventListener("mouseup",   this.window_mouseup_event.bind( this ));
        window.addEventListener('wheel',     this.window_mousewheel_event.bind( this ));

    }

    /**
     * This function is used to change boolean when mouse wheel event
     * @param this 
     * @param event 
     */
    window_mousewheel_event(this: WindowEvent, event: WheelEvent) : void
    {
        const wheel_dir = Math.sign(event.deltaY);
        const is_down = (wheel_dir === 1);

        this.wheel_states.down = is_down;
        this.wheel_states.up = !is_down;
    }

    /**
     * This function is used to resize game when the html page is resizing
     */
    window_resize_event() : void
    {
        try 
        {
            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.webGl_renderer.setSize(window.innerWidth, window.innerHeight);
        } 
        
        catch (e)
        {
            // console.error(e)
        }
    }

    /**
     * This function is used for update keystates object when keydown event 
     * @param this 
     * @param key_pressed 
     */
    window_keydown_event(this: WindowEvent, key_pressed: KeyboardEvent) : void
    {
        this.key_states[key_pressed.code] = true; 
    }

    /**
     * This function is used for update keystates object when keyup event 
     * @param this 
     * @param key_pressed 
     */
    window_keyup_event(this: WindowEvent, key_raised: KeyboardEvent) : void
    {
        this.key_states[key_raised.code] = false;
    }

    /**
     * This function is used to capture the cursor position in the HTML page
     * @param this 
     * @param mouse 
     */
    window_mousemove_event(this: WindowEvent, mouse: MouseEvent) : void
    {
        this.current_cursor_position = [mouse.clientX, mouse.clientY];
        instances.player.move_player_head();
        this.previous_cursor_position = this.current_cursor_position;
    }

    /**
     * This function is used to capture mouse keydown event
     */
    window_mousedown_event(this: WindowEvent, mouse: MouseEvent) : void
    {
        const mouse_code = mouse.button

        this.mouse_state["left"] = mouse_code === 0;
        this.mouse_state["middle"] = mouse_code === 1;
        this.mouse_state["right"] = mouse_code === 2;
    }

    /**
     * This function is used to capture mouse keyup event
     */
    window_mouseup_event(this: WindowEvent, mouse: MouseEvent) : void
    {
        const mouse_code = mouse.button

        this.mouse_state["left"] = mouse_code !== 0;
        this.mouse_state["middle"] = mouse_code !== 1;
        this.mouse_state["right"] = mouse_code !== 2;
    }
}
