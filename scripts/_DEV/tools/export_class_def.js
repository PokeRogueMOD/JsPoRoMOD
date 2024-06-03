function findAllClassDefinitions() {
    // Stack to keep track of objects to inspect
    let stack = [{ obj: window, path: 'window' }];
    let results = [];
    let visited = new Set();

    while (stack.length > 0) {
        let { obj, path } = stack.pop();

        // Skip if we've already visited this object
        if (visited.has(obj)) {
            continue;
        }

        // Mark the object as visited
        visited.add(obj);

        // Iterate over the properties of the current object
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                try {
                    let newObj = obj[key];
                    let newPath = `${path}.${key}`;

                    // Check if the property is a class constructor (function with a capitalized name)
                    if (typeof newObj === 'function' && /^[A-Z]/.test(newObj.name)) {
                        results.push({ path: newPath, name: newObj.name });
                    }

                    // Skip primitive types and functions, but respect arrays
                    if (newObj && typeof newObj === 'object' && !Array.isArray(newObj)) {
                        stack.push({ obj: newObj, path: newPath });
                    }
                } catch (e) {
                    // Catch any errors and continue (e.g., due to cross-origin restrictions)
                    continue;
                }
            }
        }
    }

    return results;
}

let classDefinitions = findAllClassDefinitions();
console.log(classDefinitions);

// Export the class definitions as a JSON file
function exportToJsonFile(jsonData) {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'class_definitions.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

exportToJsonFile(classDefinitions);
