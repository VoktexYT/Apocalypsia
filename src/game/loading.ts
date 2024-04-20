export default class Loading {
    isFinishLoad: boolean = false;
    index: number = 0;

    async loadResource(ressource: Array<() => Promise<string>>) {
        if (this.isFinishLoad) return;

        console.log("--- [START LOADING] ---");

        for (const load of ressource) {
            await load().then((msg) => {
                console.log(msg)
                this.index++;

                if (this.index === ressource.length) {
                    console.log("--- [FINISH LOADING] ---");
                }
            }).catch((error) => {
                console.error(`${error}`);
            });
        }

        this.isFinishLoad = true;
    }
}
