// Function to access the active list
function getActiveList() {
    return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
        .battle.sys.updateList._active;
}

// Function to categorize active list objects into specific lists by class names
function categorizeActiveList(activeList) {
    const playerPokemonList = [];
    activeList.forEach((obj) => {
        if (obj && obj.parentContainer && obj.parentContainer.constructor) {
            if (obj.parentContainer.constructor.name === "PlayerPokemon") {
                playerPokemonList.push(obj.parentContainer);
            }
        }
    });
    return playerPokemonList;
}

// Function to set luck value of all player Pokémon to 99
function maxTeamLuck() {
    const activeList = getActiveList();
    const playerPokemonList = categorizeActiveList(activeList);
    playerPokemonList.forEach((pokemon) => {
        pokemon.luck = 99;
    });
}

let scene =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1];

// Show Existing Luck Text Elements
const showLuckText = () => {
    const elements = [scene.luckLabelText, scene.luckText];

    // Stop any tweens affecting these elements
    elements.forEach((element) => {
        scene.tweens.killTweensOf(element); // Stop any existing tweens on the element
        element.setAlpha(1); // Set alpha to 1 to make it fully visible
        element.setVisible(true); // Set visibility to true
    });
};

if (
    window.gameInfo &&
    window.gameInfo.wave > 0 &&
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameMode.modeId !== 3
) {
    // Execute the function
    maxTeamLuck();
    scene.updateAndShowLuckText();
    showLuckText();
}
