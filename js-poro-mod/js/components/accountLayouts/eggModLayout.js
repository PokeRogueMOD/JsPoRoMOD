import { DynamicTable } from "../../../components/dynamicTable.js";

export function loadEggModLayout(subLayoutContainer) {
    const eggModTable = new DynamicTable();
    // Add fields and buttons specific to egg mod
    subLayoutContainer.appendChild(eggModTable.getElement());
}