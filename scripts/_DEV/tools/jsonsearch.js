function searchObjectForKeyValuePair(obj, key, value) {
    const stack = [{ obj, path: [] }];
    const visited = new Set();

    if (typeof obj !== "object" || obj === null || visited.has(obj)) {
        return;
    }

    while (stack.length > 0) {
        const { obj: current, path } = stack.pop();

        if (current && typeof current === "object") {
            // Check if the current object has the key-value pair
            if (current[key] === value) {
                console.log("Found path:", path.join("."));
                console.log(current);
            }

            // Add current object to visited set
            visited.add(current);

            // Add all properties of the current object to the stack
            for (let prop in current) {
                if (
                    // current.hasOwnProperty(prop) &&
                    !visited.has(current[prop])
                ) {
                    stack.push({ obj: current[prop], path: [...path, prop] });
                }
            }
        }
    }

    return null;
}

// Assuming Phaser is a global variable
const foundObject = searchObjectForKeyValuePair(Phaser, "money", 320);
console.log(foundObject);
