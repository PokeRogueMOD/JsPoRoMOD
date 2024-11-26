(function() {
    // Define the amount to set for the 'money' property
    const AMOUNT = 100_000;

    // Access the CanvasPool from Phaser's Display Canvas
    const canvasPool = Phaser.Display.Canvas.CanvasPool;

    // Verify that CanvasPool and its pool array exist and contain at least one canvas
    if (canvasPool && Array.isArray(canvasPool.pool) && canvasPool.pool.length > 0) {
        // Retrieve the first canvas from the pool
        const firstCanvas = canvasPool.pool[0];

        // Ensure the first canvas has a parent and a game instance
        if (firstCanvas.parent && firstCanvas.parent.game) {
            const game = firstCanvas.parent.game;

            // Access the scenes within the game
            const scenes = game.scene;

            // Verify that scenes and the 'battle' scene exist
            if (scenes && scenes.keys && scenes.keys.battle) {
                const battleScene = scenes.keys.battle;

                // Safely set the 'money' property if the battleScene exists
                if (battleScene) {
                    battleScene.money = AMOUNT;
                    console.log(`Money has been set to ${AMOUNT} in the 'battle' scene.`);

                    // Check if the 'updateMoneyText' method exists and is a function before calling it
                    if (typeof battleScene.updateMoneyText === 'function') {
                        battleScene.updateMoneyText();
                        console.log("'updateMoneyText' method has been called successfully.");
                    } else {
                        console.warn(
                            "'updateMoneyText' method does not exist or is not a function in the 'battle' scene."
                        );
                    }
                } else {
                    console.warn("The 'battle' scene is undefined.");
                }
            } else {
                console.warn("The 'battle' scene is not available in the game's scene keys.");
            }
        } else {
            console.warn("The first canvas does not have a parent or game instance.");
        }
    } else {
        console.warn("CanvasPool.pool is not an array or is empty.");
    }
})();
