/**
 * This class is used to manage the load of each assets component.
 */
export default class Loading 
{
    public end_of_loading: boolean = false;
    private index: number = 0;

    private front_loading_bar: HTMLElement | null = document.getElementById("front-bar");
    private html_loading_page: HTMLElement | null = document.getElementById("load-page");

    /**
     * This function is used to update size of the progress bar.
     * @param max_length Get max size of the progress bar.
     */
    update_progress_bar(max_length: number) : void
    {
        const front_bar: HTMLElement | null = this.front_loading_bar;

        if (front_bar)
        {
            const progress_percent: number = (this.index * 100 / max_length);
            const css_percent: string = progress_percent.toString() + "%";
            front_bar.style.width = css_percent;
        }

        else
        {
            this.front_loading_bar = document.getElementById("front-bar");
        }
    }

    /**
     * The load assets function is used to load game assets
     * @param load_functions every load function
     * @returns void if the loading is finished
     */
    async load_assets(load_functions: Array<() => Promise<string>>) : Promise<HTMLElement> 
    {
        return new Promise<HTMLElement>(
            async resolve => 
            {
                if (this.end_of_loading) return;

                console.info("--- [START LOADING] ---");

                if (load_functions.length === 0)
                {
                    this.html_loading_page = document.getElementById("load-page");
                    if (this.html_loading_page) 
                    {
                        this.end_of_loading = true;
                        console.log("--- [END LOADING] ---");
                        resolve(this.html_loading_page);
                    }
                }

                for (const func of load_functions) 
                {
                    if (this.html_loading_page && !this.end_of_loading)
                    {
                        this.html_loading_page.style.display = "block";
                    } 
                    
                    else
                    {
                        this.html_loading_page = document.getElementById("load-page");
                    }


                    await func().then(
                        async (msg) => 
                        {
                            console.info(msg);

                            this.update_progress_bar(load_functions.length)

                            this.index++;

                            if (this.index === load_functions.length) 
                            {
                                console.log("--- [FINISH LOADING] ---");
                                this.end_of_loading = true;

                                if (this.html_loading_page) 
                                {
                                    resolve(this.html_loading_page);
                                }
                            }
                                
                        }).catch((error) => 
                        {
                            console.error(`${error}`);
                        }
                    );
                }
            }
        )
    }
}
