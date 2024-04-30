const text = "WELCOME TO ☢️ APOCALYPSIA ☣️. THIS GAME WAS CREATED BY VOKTEX. FPS ZOMBIE IN A WEBSITE !!";
const letter_max = 20;
const interval = 200;
let index = 0;

function updateTitle() {
    let title = "";
    for (let i = 0; i < letter_max; i++) {
        const selected_letter = text[(i + index) % text.length];
        title += selected_letter;
    }
    document.title = title;
    index = (index + 1) % text.length;
}

setInterval(updateTitle, interval);


window.addEventListener("resize", () => {
    alert("resize!")
})
