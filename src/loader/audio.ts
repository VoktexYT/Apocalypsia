import * as THREE from 'three';


interface properties 
{
    path: string,
    is_loop: boolean,
    volume: number
}

export default class AudioLoader 
{
    public listener = new THREE.AudioListener();

    constructor(camera: THREE.Camera)
    {
        camera.add(this.listener);
    }

    load(settings: properties, callback?: (isLoaded: boolean, sound?: THREE.Audio) => void) : void
    {
        const audio_loader = new THREE.AudioLoader();
        
        const THIS = this;

        audio_loader.load(
            settings.path,
            (buffer) =>
            {
                const sound = new THREE.Audio(THIS.listener);
                sound.setBuffer(buffer);
                sound.setLoop(settings.is_loop);
                sound.setVolume(settings.volume);

                if (callback)
                {
                   callback(true, sound);
                }

                else
                {
                    sound.play();
                }
            }
        );
    }
}
