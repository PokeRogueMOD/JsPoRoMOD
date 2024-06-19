// dynamicTable.js
export class DynamicTable {
    constructor(containerId = null) {
        if (containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.error(`Element with id '${containerId}' not found.`);
                return;
            }
        }
        this.table = document.createElement("table");
        this.table.className = "input-table";
        if (this.container) {
            this.container.appendChild(this.table);
        }
    }

    addRow(...elements) {
        const row = document.createElement("tr");
        row.className = "input-row";

        elements.forEach(element => {
            const cell = document.createElement("td");
            cell.className = "input-cell";
            cell.appendChild(element);
            row.appendChild(cell);
        });

        this.table.appendChild(row);
    }

    getElement() {
        return this.table;
    }
}
