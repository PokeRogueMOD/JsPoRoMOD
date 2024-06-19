// dynamicFieldset.js
export class DynamicFieldset {
    constructor(legendText) {
        this.fieldset = document.createElement("fieldset");

        if (legendText) {
            const legend = document.createElement("legend");
            legend.textContent = legendText;
            this.fieldset.appendChild(legend);
        }
    }

    addElement(element) {
        const container = document.createElement("div");
        container.className = "fieldset-element";
        container.appendChild(element);
        this.fieldset.appendChild(container);
    }

    getElement() {
        return this.fieldset;
    }
}
