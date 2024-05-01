const text = "WELCOME TO APOCALYPSIA. THIS GAME WAS CREATED BY VOKTEX. FPS ZOMBIE IN A WEBSITE !! ";
const letter_max = 20;
const interval = 200;
let index = 0;

/**
 * This function is used to make slide effect with text in title of page
 */
setInterval(() => {
    let title = "";
    for (let i = 0; i < letter_max; i++) {
        const selected_letter = text[(i + index) % text.length];
        title += selected_letter;
    }
    document.title = title;
    index = (index + 1) % text.length;
}, interval);
