import * as setup from './setup'
import * as object from './object'
import * as THREE from 'three'

export let activeCamera = setup.camera

export const keysState: { [key: string]: boolean } = {};
export let cursor_position: [number, number]

export let cursorPositionAfter = [0, 0];
export let cursorPositionNow = [0, 0];
export let cursorSensibility = 3;
export const smoothFactor = 0.1;

export default function event() {

    window.addEventListener('resize', onWindowResize, false)

    window.addEventListener('keydown', (key) => {
        keysState[key.code] = true;

        switch (key.code) {
            case "Escape":
                setup.switch_active_camera();
                break;
        }
    })

    window.addEventListener('keyup', (event) => {
        keysState[event.code] = false;
    });

    window.addEventListener("mousemove", (event) => {
        cursorPositionNow = [event.clientX, event.clientY];


        if (object.player.enableCamera) {
            const deltaX = (cursorPositionNow[0] - cursorPositionAfter[0]) * cursorSensibility;
            const deltaY = (cursorPositionNow[1] - cursorPositionAfter[1]) * cursorSensibility;
        
            const smoothedDeltaX = deltaX * smoothFactor;
            const smoothedDeltaY = deltaY * smoothFactor;
        
            // Ajouter les changements d'angle aux angles actuels
            const newAngleY = object.player.angleY - THREE.MathUtils.degToRad(smoothedDeltaX);
            const newAngleX = object.player.angleX - THREE.MathUtils.degToRad(smoothedDeltaY);
        
            // Limiter l'angle d'inclinaison de la tête entre -90 et 90 degrés
            const maxAngleX = THREE.MathUtils.degToRad(60);
            const minAngleX = -THREE.MathUtils.degToRad(60);
            const clampedAngleX = THREE.MathUtils.clamp(newAngleX, minAngleX, maxAngleX);
        
            // Mettre à jour les angles d'inclinaison de la tête en respectant les limites
            object.player.angleY = newAngleY;
            object.player.angleX = clampedAngleX;
        
            // Mettre à jour les quaternions de rotation
            object.player.quaternionY.setFromAxisAngle(object.player.axisY, object.player.angleY);
            object.player.quaternionX.setFromAxisAngle(object.player.axisX, object.player.angleX);
        
            // Calculer le quaternion final
            object.player.finalQuaternion.multiplyQuaternions(object.player.quaternionY, object.player.quaternionX);
        
            // Appliquer le quaternion final à la caméra
            object.player.camera.quaternion.copy(object.player.finalQuaternion);
        
            cursorPositionAfter[0] = cursorPositionNow[0];
            cursorPositionAfter[1] = cursorPositionNow[1];
        }

        else {
            cursorPositionAfter = cursorPositionNow;
        }
        
    });
    
}



function onWindowResize() {
    setup.camera.aspect = window.innerWidth / window.innerHeight
    setup.camera.updateProjectionMatrix()
    setup.renderer.setSize(window.innerWidth, window.innerHeight)
}
