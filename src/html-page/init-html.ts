function setupCssLinkHtmlPage() {
    const head = document.querySelector("head");
    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "style.css";

    head?.appendChild(link);
}


function setupHtmlPage() {
    // Create load-page content
    var loadPageDiv = document.createElement('div');
    loadPageDiv.id = 'load-page';

    var videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.disablePictureInPicture = true;
    videoElement.disableRemotePlayback = true;
    videoElement.style.width = "100%";
    videoElement.style.height = '100%';

    var sourceElement = document.createElement('source');
    sourceElement.src = './assets/web/loading.mp4';
    sourceElement.type = 'video/mp4';

    videoElement.appendChild(sourceElement);

    var progressBarDiv = document.createElement('div');
    progressBarDiv.id = 'progress-bar';

    var frontBarDiv = document.createElement('div');
    frontBarDiv.id = 'front-bar';

    var backBarDiv = document.createElement('div');
    backBarDiv.id = 'back-bar';

    progressBarDiv.appendChild(frontBarDiv);
    progressBarDiv.appendChild(backBarDiv);

    var creditParagraph = document.createElement('p');
    creditParagraph.id = 'credit';
    creditParagraph.textContent = 'This game was created by Voktex. All the code and art assets are on my github. https://github.com/VoktexYT/Apocalypsia';
    creditParagraph.style.position = 'absolute';
    creditParagraph.style.bottom = '0px';
    creditParagraph.style.userSelect = 'none';

    loadPageDiv.appendChild(videoElement);
    loadPageDiv.appendChild(progressBarDiv);
    loadPageDiv.appendChild(creditParagraph);

    // Create cursor-page content
    var cursorPageDiv = document.createElement('div');
    cursorPageDiv.id = 'cursor-page';
    cursorPageDiv.style.display = 'none';
    cursorPageDiv.innerHTML = '<div></div>';

    // Create health-page content
    var healthPageDiv = document.createElement('div');
    healthPageDiv.id = 'health-page';
    healthPageDiv.style.display = 'none';

    // create level page
    var levelPage = document.createElement("div");
    levelPage.id = "level-page";
    levelPage.style.display = 'none';

    levelPage.innerHTML = '<div id="level-counter">Level</div>'

    // Append created elements to the body
    document.body.appendChild(loadPageDiv);
    document.body.appendChild(cursorPageDiv);
    document.body.appendChild(healthPageDiv);
    document.body.appendChild(levelPage);
}


export function setup_game_page() {
    setupCssLinkHtmlPage();
    setupHtmlPage();

    console.info("[LOADED] html page")

}