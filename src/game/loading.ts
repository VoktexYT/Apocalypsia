export default class Loading {
    isFinishLoad: boolean = false;
    index: number = 0;

    front_loading_bar: HTMLElement | null = document.getElementById("front-bar");
    load_page: HTMLElement | null = document.getElementById("load-page");

    async updateProgressBar(max_length: number) {
        const front_bar = this.front_loading_bar;

        if (front_bar) {
            front_bar.style.width = (this.index * 100 / max_length).toString() + "%";
        }
        else
            this.front_loading_bar = document.getElementById("front-bar");
    }

    async loadResource(ressource: Array<() => Promise<string>>): Promise<HTMLElement> {
        return new Promise<HTMLElement>(async resolve => {
            if (this.isFinishLoad) return;

            console.log("--- [START LOADING] ---");

            for (const load of ressource) {

                const loadPage = this.load_page

                if (loadPage && !this.isFinishLoad) {
                    loadPage.style.display = "block";
                } else {
                    this.load_page = document.getElementById("load-page");
                }


                await load().then(async (msg) => {
                    console.log(msg);

                    await this.updateProgressBar(ressource.length)

                    this.index++;

                    if (this.index === ressource.length) {
                        console.log("--- [FINISH LOADING] ---");
                        this.isFinishLoad = true;

                        if (loadPage) {
                            resolve(loadPage)
                        }
                    }
                }).catch((error) => {
                    console.error(`${error}`);
                });
            }
        })
        
    }
}
