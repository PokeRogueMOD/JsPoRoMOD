(function() {
    // To avoid infinite recursion
    const visited = new WeakSet();

    function searchObject(obj, searchValue, path = '') {
        if (typeof obj !== 'object' || obj === null || visited.has(obj)) {
            return;
        }

        visited.add(obj);

        if (Array.isArray(obj)) {
            // Handle array case
            obj.forEach((item, index) => {
                const currentPath = `${path}[${index}]`;
                if (item === searchValue) {
                    console.log(`Found value ${searchValue} at: ${currentPath} = ${item}`);
                    console.log(obj);
                }
                if (typeof item === 'object') {
                    searchObject(item, searchValue, currentPath);
                }
            });
        } else {
            // Handle object case
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    try {
                        const value = obj[key];
                        const currentPath = `${path}.${key}`;

                        // If the value matches the searchValue, log it
                        if (value === searchValue) {
                            console.log(`Found value ${searchValue} at: ${currentPath} = ${value}`);
                            console.log(obj);
                        }

                        // Recursively search in objects and arrays
                        if (typeof value === 'object') {
                            searchObject(value, searchValue, currentPath);
                        }
                    } catch (e) {
                        // Ignore properties that cannot be accessed
                    }
                }
            }
        }
    }

    // Start the search from the Phaser object
    searchObject(Phaser, 1662418803, 'Phaser');
})();
