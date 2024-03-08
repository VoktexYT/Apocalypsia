import * as THREE from 'three'
import * as setup from './setup'
import { TextureLoader } from 'three';


export default function load_floor() {
    const geometry = new THREE.BoxGeometry(100, 0.3, 100);

    const loader = new TextureLoader();

    loader.load(
        '/assets/nature/grass/textures/grass.png',
        (texture) => {
            const material = new THREE.MeshBasicMaterial({ color: 0x555555 });

            const rect = new THREE.Mesh(geometry, material);

            setup.scene.add(rect);
        }
    );
}