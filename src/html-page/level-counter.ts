import AudioLoader from "../loader/audio";
import * as THREE from 'three';
import * as init from '../three/init-three';


export default class LevelCounter 
{
    level_count = 0;

    level_html_element = document.getElementById("level-counter");
    level_page_html_element = document.getElementById("level-page");

    initial_css_position_px = {
        left: 10,
        top: 20
    }

    initial_css_color = "#a51b1b";

    next_level_animation_time = 2000;

    audioLoader: AudioLoader | undefined;
    next_level_sound: THREE.Audio | undefined;
    zombie_is_coming_sound: THREE.Audio | undefined;
    level_up_text_sound: THREE.Audio | undefined;

    audio_is_load = false;

    first = true;

    constructor(camera: THREE.Camera)
    {
        this.audioLoader = new AudioLoader(camera);
    }

    load_audio()
    {
        if (!this.audioLoader) return;

        this.audioLoader.load(
            {
                path: "./assets/sound/next-level.mp3",
                is_loop: false,
                volume: 1
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.next_level_sound = sound;
                }
            }
        );

        this.audioLoader.load(
            {
                path: "./assets/sound/zombies-is-coming.mp3",
                is_loop: false,
                volume: 1
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.zombie_is_coming_sound = sound;
                }
            }
        );

        this.audioLoader.load(
            {
                path: "./assets/sound/level-up.mp3",
                is_loop: false,
                volume: 1
            }, 
            
            (loaded, sound) => 
            {
                if (loaded && sound)
                {
                    this.level_up_text_sound = sound;
                }
            }
        );

        this.audio_is_load = true;
        
        if (this.level_page_html_element)
        {
            this.level_page_html_element.style.display = "block";
        }
    }

    search_html()
    {
        if (this.level_page_html_element && this.level_html_element) return;

        this.level_html_element = document.getElementById("level-counter");
        this.level_page_html_element = document.getElementById("level-page");

        if (this.level_page_html_element)
        {
            this.level_page_html_element.style.display = "block";
        }
    }

    make_level_up_sound_effect()
    {
        if (this.next_level_sound)
        {
            if (this.next_level_sound.isPlaying)
            {
                this.next_level_sound.stop()
            }

            this.next_level_sound.play();

            setTimeout(() => {
                if (this.zombie_is_coming_sound)
                {
                    if (this.zombie_is_coming_sound.isPlaying)
                    {
                        this.zombie_is_coming_sound.stop()
                    }

                    this.zombie_is_coming_sound.play();
                }
            }, 1000);
        }
    }

    make_level_up_text_effect()
    {
        if (!this.level_html_element) return;
        const middle_screen_width = (window.innerWidth - 300) / 2;
        const middle_screen_height = window.innerHeight / 2 - 100;

        this.level_html_element.style.left = `${middle_screen_width}px`;
        this.level_html_element.style.top = `${middle_screen_height}px`;

        this.level_html_element.style.color = "#FFFFFF";

        this.level_count++;

        setTimeout(() => {
            if (this.level_html_element)
            {
                this.level_html_element.innerText = `Level ${this.level_count}`;
                this.level_up_text_sound?.play();
            }

        }, 500)

        setTimeout(() => {
            if (this.level_html_element)
            {
                this.level_html_element.style.left = `${this.initial_css_position_px.left}px`;
                this.level_html_element.style.top = `${this.initial_css_position_px.top}px`;

                this.level_html_element.style.color = `${this.initial_css_color}`;
            }
        }, this.next_level_animation_time)
    }

    update_level()
    {
        this.search_html();

        if (!this.audio_is_load || !this.level_html_element) return;

        if (this.first)
        {
            this.first = false;
            setTimeout(() => {
                this.make_level_up_sound_effect();
            }, init.fadein_time);

            setTimeout(() => {
                this.make_level_up_text_effect();
            }, init.fadein_time + 1000);
        }

        else
        {
            this.make_level_up_sound_effect();
            this.make_level_up_text_effect();
        }
    }
}