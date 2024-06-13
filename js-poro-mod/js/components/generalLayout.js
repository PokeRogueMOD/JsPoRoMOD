// import { sanitizeNumberInput, clampNumber } from "../utils/numberInput.js";

// document.querySelectorAll(".number-input").forEach((input) => {
//     input.addEventListener("input", (event) => {
//         const sanitizedValue = sanitizeNumberInput(event.target.value);
//         event.target.value = sanitizedValue;
//     });

//     input.addEventListener("blur", (event) => {
//         const sanitizedValue = sanitizeNumberInput(event.target.value);
//         const numberValue = parseFloat(sanitizedValue);
//         const min = parseFloat(input.dataset.min);
//         const max = parseFloat(input.dataset.max);
//         if (!isNaN(numberValue)) {
//             const clampedValue = clampNumber(numberValue, min, max);
//             event.target.value = clampedValue;
//         } else {
//             event.target.value = "";
//         }
//     });
// });
