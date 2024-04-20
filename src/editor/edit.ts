import * as object from '../game/instances';
import * as THREE from 'three';
import * as init from '../three/init-three';


export default class Edit {
    three_material = new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 1 });
    three_geometry = new THREE.BoxGeometry(1, 1, 1);
    three_mesh = new THREE.Mesh(this.three_geometry, this.three_material);

    constructor() {
        this.three_mesh.position.set(-23, 0, 20);
        init.scene.add(this.three_mesh);
    }

    update() {
        if (object.window_event.key_states['KeyQ']) {
            object.window_event.key_states['KeyQ'] = false;
            this.three_mesh.position.x += 0.1;
        }

        if (object.window_event.key_states['KeyW']) {
            object.window_event.key_states['KeyW'] = false;
            this.three_mesh.position.x -= 0.1;
        }

        if (object.window_event.key_states['KeyE']) {
            object.window_event.key_states['KeyE'] = false;
            this.three_mesh.position.z += 0.1;
        }

        if (object.window_event.key_states['KeyR']) {
            object.window_event.key_states['KeyR'] = false;
            this.three_mesh.position.z -= 0.1;
        }

        if (object.window_event.key_states['ArrowUp']) {
            object.window_event.key_states['ArrowUp'] = false;
            this.three_mesh.position.y += 0.1;
        }

        if (object.window_event.key_states['ArrowDown']) {
            object.window_event.key_states['ArrowDown'] = false;
            this.three_mesh.position.y -= 0.1;
        }



        if (object.window_event.key_states['KeyT']) {
            object.window_event.key_states['KeyT'] = false;
            this.three_mesh.position.x += 0.5;
        }

        if (object.window_event.key_states['KeyY']) {
            object.window_event.key_states['KeyY'] = false;
            this.three_mesh.position.x -= 0.5;
        }

        if (object.window_event.key_states['KeyU']) {
            object.window_event.key_states['KeyU'] = false;
            this.three_mesh.position.z += 0.5;
        }

        if (object.window_event.key_states['KeyI']) {
            object.window_event.key_states['KeyI'] = false;
            this.three_mesh.position.z -= 0.5;
        }

        if (object.window_event.key_states['ArrowUp']) {
            object.window_event.key_states['ArrowUp'] = false;
            this.three_mesh.position.y += 0.1;
        }

        if (object.window_event.key_states['ArrowDown']) {
            object.window_event.key_states['ArrowDown'] = false;
            this.three_mesh.position.y -= 0.1;
        }




        if (object.window_event.key_states['ArrowLeft']) {
            object.window_event.key_states['ArrowLeft'] = false;
            this.three_mesh.rotation.y -= Math.PI/140;
        }

        if (object.window_event.key_states['ArrowRight']) {
            object.window_event.key_states['ArrowRight'] = false;
            this.three_mesh.rotation.y += Math.PI/140;
        }

        if (object.window_event.key_states['KeyD']) {
            object.window_event.key_states['KeyD'] = false;
            this.three_mesh.scale.y += 0.1;
        }

        if (object.window_event.key_states['KeyF']) {
            object.window_event.key_states['KeyF'] = false;
            this.three_mesh.scale.y -= 0.1;
        }

        if (object.window_event.key_states['KeyZ']) {
            object.window_event.key_states['KeyZ'] = false;
            this.three_mesh.scale.z += 0.1;
        }

        if (object.window_event.key_states['KeyX']) {
            object.window_event.key_states['KeyX'] = false;
            this.three_mesh.scale.z -= 0.1;
        }

        if (object.window_event.key_states['KeyC']) {
            object.window_event.key_states['KeyC'] = false;
            this.three_mesh.scale.x += 0.1;
        }

        if (object.window_event.key_states['KeyV']) {
            object.window_event.key_states['KeyV'] = false;
            this.three_mesh.scale.x -= 0.1;
        }

        console.log(`[[${this.three_mesh.position.x},${this.three_mesh.position.y},${this.three_mesh.position.z}],[${this.three_mesh.scale.x/2},${this.three_mesh.scale.y/2},${this.three_mesh.scale.z/2}],[${this.three_mesh.rotation.y}]]`)
    }
}