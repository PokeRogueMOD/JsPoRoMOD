// components/singleLineContainer.js
export class SingleLineContainer {
    constructor() {
        this.element = document.createElement("div");
        this.element.className = "single-line-container";
    }

    addElement(child) {
        this.element.appendChild(child);
    }

    getElement() {
        return this.element;
    }
}
