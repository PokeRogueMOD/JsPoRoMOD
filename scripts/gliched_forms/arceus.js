(function () {
    const Type = {
        NORMAL: 0,
        FIGHTING: 1,
        FLYING: 2,
        POISON: 3,
        GROUND: 4,
        ROCK: 5,
        BUG: 6,
        GHOST: 7,
        STEEL: 8,
        FIRE: 9,
        WATER: 10,
        GRASS: 11,
        ELECTRIC: 12,
        PSYCHIC: 13,
        ICE: 14,
        DRAGON: 15,
        DARK: 16,
        FAIRY: 17,
        UNKNOWN: 18,
    };

    /**
     * Toggles attributes and cursor in a game scene.
     *
     * This function alters the caught attributes of a dex entry and toggles the cursor
     * to display the gliched form.
     *
     * @param {number} dexId - The dex entry ID to be modified.
     * @param {number} glitchedFormIndex - The index for the glitched form to be toggled.
     */
    const toggleAttributesAndCursor = (dexId, type) => {
        // Store repeated lookups in variables
        const gameScene =
            Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                .battle;
        const dexEntry = gameScene.gameData.dexData[dexId];
        const uiHandler = gameScene.ui.getHandler();

        // Create attributes mask based on glitchedFormIndex
        const attributes = (1n << BigInt(7 + type)) | ((1n << 7n) - 1n);

        // Toggle caught attributes
        dexEntry.caughtAttr =
            dexEntry.caughtAttr !== attributes
                ? attributes
                : BigInt(Number.MAX_SAFE_INTEGER);

        /**
         * Toggles the cursor in the UI handler.
         *
         * This inner function toggles the cursor to display the gliched form.
         */
        const toggleCursor = () => {
            const { cursor } = uiHandler;
            const nextCursor = cursor === 0 ? 1 : cursor - 1;
            uiHandler.setCursor(nextCursor);
            uiHandler.setCursor(cursor);
        };

        // Invoke the cursor toggling function
        toggleCursor();
    };

    // Call the function for the dex id and gliched form index
    toggleAttributesAndCursor(493, Type.FAIRY);
})();
