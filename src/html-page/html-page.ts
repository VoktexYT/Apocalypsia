export default class HtmlPage {
    id: string
    dom_element: HTMLElement | null = null

    constructor(id: string) {
        this.id = id
    }

    searchHTML() {
        this.dom_element = document.getElementById(this.id)
        return this.dom_element
    }

    enable() {
        if (this.dom_element === null) return
        this.dom_element.style.display = "flex"
        this.dom_element.style.zIndex = "1000"
    }

    disable() {
        if (this.dom_element === null) return
        this.dom_element.style.display = "none"
        this.dom_element.style.zIndex = "-1"
    }
}