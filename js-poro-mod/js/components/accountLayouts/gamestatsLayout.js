import { DynamicTable } from "../../../components/dynamicTable.js";

export function loadGamestatsLayout(subLayoutContainer) {
    const gamestatsTable = new DynamicTable();
    // Add fields and buttons specific to gamestats
    subLayoutContainer.appendChild(gamestatsTable.getElement());
}