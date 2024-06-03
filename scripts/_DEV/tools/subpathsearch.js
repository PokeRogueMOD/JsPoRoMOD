(function () {
    // To avoid infinite recursion
    const visited = new WeakSet();

    function searchObject(searchPath, obj = Phaser, path = "Phaser") {
        if (typeof obj !== "object" || obj === null || visited.has(obj)) {
            return;
        }

        visited.add(obj);

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                try {
                    const value = obj[key];
                    const currentPath = Array.isArray(obj)
                        ? `${path}[${key}]`
                        : `${path}.${key}`;
                    // console.log(currentPath)

                    // If the key or value contains the search string, log it
                    if (currentPath.includes(searchPath)) {
                        console.log(`Path found in key: ${currentPath}`);
                        console.log(obj);
                        return;
                    }

                    // Recursively search in objects and arrays
                    if (typeof value === "object") {
                        searchObject(searchPath, (path = currentPath));
                    }
                } catch (e) {
                    // Ignore properties that cannot be accessed
                }
            }
        }
    }

    // Start the search from the window object
    searchObject("trainer.scene");
})();
