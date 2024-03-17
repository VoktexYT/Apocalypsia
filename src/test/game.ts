import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';


export default class Game {
    scene: THREE.Scene
    ambientLight: THREE.AmbientLight
    camera: THREE.Camera
    renderer: THREE.Renderer
    axesHelper: THREE.AxesHelper
    controls: OrbitControls

    constructor() {
        this.scene = new THREE.Scene();

        this.ambientLight = new THREE.AmbientLight();
        this.ambientLight.color = new THREE.Color(0x777777);
        this.scene.add(this.ambientLight);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 3, 3);
        // this.camera.position.set(19.19, 16.33, 13.79);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = false;
        this.controls.enablePan = false;
        // this.controls.enableRotate = false;
    }
}