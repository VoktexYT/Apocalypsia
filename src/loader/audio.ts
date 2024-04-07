import * as THREE from 'three'


export default class AudioLoader {
    listener = new THREE.AudioListener();

    constructor(camera: THREE.Camera) {
        camera.add(this.listener);
    }

    playSound(path: string, isLoop: boolean, volume: number) {
        const audioLoader = new THREE.AudioLoader();
        
        const THIS = this;

        audioLoader.load(path, function(buffer) {
            const sound = new THREE.Audio(THIS.listener);
            sound.setBuffer(buffer);
            sound.setLoop(isLoop);
            sound.setVolume(volume);
            sound.play();
        });
    }
}
