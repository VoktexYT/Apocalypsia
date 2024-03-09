import * as THREE from 'three'
import * as setup from './setup'
import { TextureLoader } from 'three';


export default function load_floor() {

    // Create Rectangle, Material and Texture
    const geometry = new THREE.BoxGeometry(20, 0.3, 20);

    const loader = new TextureLoader();

    loader.load(
        '/assets/nature/grass/textures/grass.png',
        (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture, color: 0x555555 });
            const rect = new THREE.Mesh(geometry, material);
            setup.scene.add(rect);
        }
    );
}
