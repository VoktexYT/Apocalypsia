import * as setup from './setup'
import * as object from './object'

export let activeCamera = setup.camera

export const keysState: { [key: string]: boolean } = {};
export let cursor_position: [number, number]


export default function event() {

    window.addEventListener('resize', onWindowResize, false)

    window.addEventListener('keydown', (key) => {
        keysState[key.code] = true;

        switch (key.code) {
            case "Escape":
                setup.switch_active_camera();
                break;
            case "Enter":
                // object.zombie.entity.play_animation("walk");
                break;
        }
    })

    window.addEventListener('keyup', (event) => {
        keysState[event.code] = false;
    });

    window.addEventListener("mousemove", (event) => {
        const mouseX = event.clientX / window.innerWidth; 
        object.player.theta_camera = (mouseX - 0.5) * Math.PI * 3;

        const mouseY = event.clientY / window.innerHeight;
        object.player.delta_camera = (mouseY - 0.5) * Math.PI * 3;

        object.player.update_camera_rotation()
    });
}



function onWindowResize() {
    setup.camera.aspect = window.innerWidth / window.innerHeight
    setup.camera.updateProjectionMatrix()
    setup.renderer.setSize(window.innerWidth, window.innerHeight)
}
