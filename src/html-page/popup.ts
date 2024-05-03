import AudioLoader from "../loader/audio";
import * as THREE from 'three';
import * as init from '../three/init-three';


export default class Popup 
{
    popup_message = "HEADSHOT +300%";
    popup_message_html = "";

    popup_html_element = document.getElementById("popup-text");
    popup_page_html_element = document.getElementById("popup-page");

    initial_css_color = "#a51b1b";

    popup_animation_time = 500;

    is_popup = false;

    audioLoader: AudioLoader | undefined;
    popup_sound: THREE.Audio | undefined;

    audio_is_load = false;

    first = true;

    constructor(camera: THREE.Camera)
    {
        this.audioLoader = new AudioLoader(camera);

        let switch_color = false;
        let color1 = "chartreuse"
        let color2 = "magenta"

        for (let letter of this.popup_message) {
            if (switch_color)
            {
                this.popup_message_html += `<font style="color: ${color1}">${letter}</font>`
            }

            else
            {
                this.popup_message_html += `<font style="color: ${color2}">${letter}</font>`
            }

            switch_color = !switch_color;
        }
    }

    load_audio()
    {
        if (!this.audioLoader) return;

        this.audioLoader.load(
            {
                path: "./assets/sound/popup.mp3",
                is_loop: false,
                volume: 1
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.popup_sound = sound;
                }
            }
        );

        this.audio_is_load = true;
        
        if (this.popup_page_html_element)
        {
            this.popup_page_html_element.style.display = "block";
        }
    }

    search_html()
    {
        if (this.popup_html_element && this.popup_html_element) return;

        this.popup_html_element = document.getElementById("popup-text");
        this.popup_page_html_element = document.getElementById("popup-page");

        if (this.popup_page_html_element)
        {
            this.popup_page_html_element.style.display = "block";
        }
    }

    make_popup_sound_effect()
    {
        if (this.popup_sound)
        {
            if (this.popup_sound.isPlaying)
            {
                this.popup_sound.stop()
            }

            this.popup_sound.play();
        }
    }

    make_popup_text_effect()
    {
        if (!this.popup_html_element) return;

        this.popup_html_element.style.transform = `scale(1)`;
        this.popup_html_element.style.opacity = `1`;
        this.popup_html_element.innerHTML = this.popup_message_html;

        setTimeout(() => {
            if (this.popup_html_element)
            {
                this.popup_html_element.style.opacity = `0`;
            }
        }, this.popup_animation_time)

        setTimeout(() => {
            if (this.popup_html_element)
            {
                this.popup_html_element.style.transform = `scale(2)`;
            }

            this.is_popup = false;
        }, this.popup_animation_time + 500)
    }

    update_popup()
    {
        this.search_html();

        if (!this.audio_is_load || !this.popup_html_element || this.is_popup) return;

        this.is_popup = true;

        if (this.popup_html_element)
        {
            this.popup_html_element.style.left = (window.innerWidth-500)+"px";
            this.popup_html_element.style.top = (window.innerHeight-200)+"px";
        }

        this.make_popup_sound_effect();
        this.make_popup_text_effect();

        
    }
}