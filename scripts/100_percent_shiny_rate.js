// Define the standalone script
const setMaxShinyRate = () => {
    // Access the battle scene
    const battleScene = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle;
    const modifiers = battleScene.modifiers;

    // Search string and desired stack count
    const searchString = "modifierType:ModifierType.SHINY_CHARM";
    const maxStackCount = 20; // Maximum stack count to ensure 100% shiny chance

    // Find the index of the existing modifier
    const index = modifiers.findIndex(
        ({ type: { localeKey } }) => localeKey === searchString
    );

    if (index === -1) {
        console.log(
            `Not Shiny charm found. Buy one first!`
        );
    } else {
        // Update existing modifier's stack count
        modifiers[index].stackCount = maxStackCount;
        battleScene.updateModifiers(true, true);
        console.log(
            `Found at index: ${index}. Updated stack count to ${maxStackCount}`
        );
    }
};

// Call the function
setMaxShinyRate();
