import { DynamicTable } from "../../../components/dynamicTable.js";

export function loadStartersLayout(subLayoutContainer) {
    const startersTable = new DynamicTable();
    // Add fields and buttons specific to starters
    subLayoutContainer.appendChild(startersTable.getElement());
}