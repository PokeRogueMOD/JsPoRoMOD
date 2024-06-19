import { DynamicTable } from "../../../components/dynamicTable.js";

export function loadGamemodesLayout(subLayoutContainer) {
    const gamemodesTable = new DynamicTable();
    // Add fields and buttons specific to gamemodes
    subLayoutContainer.appendChild(gamemodesTable.getElement());
}