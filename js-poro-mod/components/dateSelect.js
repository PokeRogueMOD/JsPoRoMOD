export function createDateComponent(id) {
    const container = document.createElement("div");
    container.className = "date-component";

    const inputElement = document.createElement("input");
    inputElement.type = "date";
    inputElement.id = id;

    // Get the current date
    const today = new Date();

    // Format the date to YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    // Set the current date as the value
    inputElement.value = formattedDate;

    container.appendChild(inputElement);

    return container;
}