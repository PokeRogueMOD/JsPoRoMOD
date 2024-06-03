(function() {
    // To avoid infinite recursion
    const visited = new WeakSet();

    function searchObject(obj, searchString, path = '') {
        
        if (typeof obj !== 'object' || obj === null || visited.has(obj)) {
            return;
        }

        visited.add(obj);

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                try {
                    const value = obj[key];
                    const currentPath = Array.isArray(obj) ? `${path}[${key}]` : `${path}.${key}`;

                    // If the key or value contains the search string, log it
                    if (typeof key === 'string' && key.includes(searchString)) {
                        console.log(`Found in key: ${currentPath}`);
                        console.log(obj);
                    }
                    if (typeof value === 'string' && value.includes(searchString)) {
                        console.log(`Found in value: ${currentPath} = ${value}`);
                        console.log(obj);
                    }

                    // Recursively search in objects and arrays
                    if (typeof value === 'object') {
                        searchObject(value, searchString, currentPath);
                    }
                } catch (e) {
                    // Ignore properties that cannot be accessed
                }
            }
        }
    }

    // Start the search from the window object
    searchObject(Phaser, 'Dartiri', path='Phaser');
})();