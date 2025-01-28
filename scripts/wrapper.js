/**
 * PokeRogueMODWrapper
 * 
 * A professional and scalable OOP wrapper for managing and modifying 
 * various aspects of the PokeRogue game. This class provides methods 
 * to edit a Pokémon's candy count and toggle the UI cursor, utilizing 
 * separate functions to retrieve the battle scene and UI handler 
 * to promote reusability and maintainability.
 */

class PokeRogueMODWrapper {
    /**
     * Constructs the PokeRogueMODWrapper.
     * Since Phaser is globally defined, no parameters are required.
     * @throws Will throw an error if Phaser is not defined.
     */
    constructor() {
        // Verify that the Phaser object is available in the global scope
        if (typeof Phaser === 'undefined') {
            throw new Error('Phaser is not defined. Ensure that Phaser is loaded before using PokeRogueMODWrapper.');
        }
    }

    /**
     * Retrieves the 'battle' scene from the Phaser game's scene manager.
     * @returns {Phaser.Scene|null} - The battle scene if found, otherwise null.
     */
    getBattle() {
        try {
            // Access the CanvasPool from Phaser's Display Canvas
            const canvasPool = Phaser.Display.Canvas.CanvasPool;

            // Verify that CanvasPool and its pool array exist and contain at least one canvas
            if (!canvasPool || !Array.isArray(canvasPool.pool) || canvasPool.pool.length === 0) {
                console.warn('CanvasPool.pool is not an array or is empty.');
                return null;
            }

            // Retrieve the first canvas from the pool
            const firstCanvas = canvasPool.pool[0];

            // Ensure the first canvas has a parent and a game instance
            if (!firstCanvas.parent || !firstCanvas.parent.game) {
                console.warn('The first canvas does not have a parent or game instance.');
                return null;
            }

            const game = firstCanvas.parent.game;

            // Access the scenes within the game
            const scenes = game.scene;

            // Verify that scenes and the 'battle' scene exist
            if (!scenes || !scenes.keys || !scenes.keys.battle) {
                console.warn("The 'battle' scene is not available in the game's scene keys.");
                return null;
            }

            const battleScene = scenes.keys.battle;

            if (!battleScene) {
                console.warn("The 'battle' scene is undefined.");
                return null;
            }

            return battleScene;
        } catch (error) {
            console.error('An error occurred while retrieving the battle scene:', error);
            return null;
        }
    }

    /**
     * Retrieves the UI handler from the 'battle' scene.
     * @returns {Object|null} - The UI handler if found, otherwise null.
     */
    getUIHandler() {
        try {
            // Retrieve the battle scene
            const battleScene = this.getBattle();
            if (!battleScene) {
                console.warn('Cannot retrieve UI handler because the battle scene was not found.');
                return null;
            }

            // Access the UI handler using optional chaining to prevent errors
            const uiHandler = battleScene.ui?.getHandler();

            if (!uiHandler) {
                console.warn('UI handler is undefined.');
                return null;
            }

            return uiHandler;
        } catch (error) {
            console.error('An error occurred while retrieving the UI handler:', error);
            return null;
        }
    }

    /**
     * Edits the candy count of a specified Pokémon in the battle scene.
     * Optionally toggles the UI cursor after updating the candy count.
     * 
     * @param {string|number} pokemonId - The identifier of the Pokémon to update.
     * @param {number} newCount - The new candy count to set.
     * @param {boolean} [toggle=true] - Whether to toggle the UI cursor after editing.
     * @returns {boolean} - Returns true if the operation was successful, otherwise false.
     */
    editCandyCount(pokemonId, newCount, toggle = true) {
        // Validate input parameters
        if (
            (typeof pokemonId !== 'string' && typeof pokemonId !== 'number') ||
            typeof newCount !== 'number' ||
            isNaN(newCount)
        ) {
            console.error('Invalid parameters. Ensure pokemonId is a string or number and newCount is a valid number.');
            return false;
        }

        // Retrieve the battle scene
        const battleScene = this.getBattle();
        if (!battleScene) {
            console.warn('Cannot edit candy count because the battle scene was not found.');
            return false;
        }

        try {
            // Access the starterData for the specified Pokémon using optional chaining
            const starterData = battleScene.gameData?.starterData;

            // Verify that starterData exists and contains the specified Pokémon
            if (!starterData || !starterData[pokemonId]) {
                console.warn(`Starter data for Pokémon ID "${pokemonId}" does not exist.`);
                return false;
            }

            // Update the candyCount property
            starterData[pokemonId].candyCount = newCount;
            console.log(`Candy count for Pokémon ID "${pokemonId}" has been set to ${newCount}.`);

            // If toggle flag is true, toggle the cursor
            if (toggle) {
                const toggleSuccess = this.toggleCursor();
                if (toggleSuccess) {
                    console.log('Cursor toggled successfully after editing candy count.');
                } else {
                    console.warn('Failed to toggle cursor after editing candy count.');
                }
            }

            return true;
        } catch (error) {
            console.error('An error occurred while editing candy count:', error);
            return false;
        }
    }

    /**
     * Toggles the UI cursor within the battle scene to reflect changes.
     * It toggles between cursor positions 0 and 1.
     * @returns {boolean} - Returns true if the operation was successful, otherwise false.
     */
    toggleCursor() {
        // Retrieve the UI handler
        const uiHandler = this.getUIHandler();
        if (!uiHandler) {
            console.warn('Cannot toggle cursor because the UI handler was not found.');
            return false;
        }

        try {
            // Destructure the current cursor value
            const { cursor } = uiHandler;

            // Determine the next cursor state (toggle between 0 and 1)
            const nextCursor = cursor === 0 ? 1 : 0;

            // Set the cursor to the next state
            uiHandler.setCursor(nextCursor);
            uiHandler.setCursor(cursor);
            console.log(`Cursor has been toggled to ${nextCursor}.`);

            return true;
        } catch (error) {
            console.error('An error occurred while toggling the cursor:', error);
            return false;
        }
    }
}

// ----------------------------
// Example Usage of PokeRogueMODWrapper
// ----------------------------

// Instantiate the PokeRogueMODWrapper
const pokeRogueWrapper = new PokeRogueMODWrapper();

// Edit the candy count of Pokémon with ID "1" to 99 and toggle the cursor (default behavior)
const successEditCandy = pokeRogueWrapper.editCandyCount("1", 999);
if (successEditCandy) {
    console.log('Candy count updated successfully and cursor toggled.');
} else {
    console.log('Failed to update candy count and toggle cursor.');
}

// -----------------------------------------------------
// The following examples are for development purposes only.
// Uncomment them as needed for additional testing or functionality.
// -----------------------------------------------------

// // Alternatively, edit the candy count without toggling the cursor by setting toggle to false
// const successEditCandyNoToggle = pokeRogueWrapper.editCandyCount("1", 150, false);
// if (successEditCandyNoToggle) {
//     console.log('Candy count updated successfully without toggling cursor.');
// } else {
//     console.log('Failed to update candy count.');
// }

// // Toggle the UI cursor independently if needed
// const successToggleCursor = pokeRogueWrapper.toggleCursor();
// if (successToggleCursor) {
//     console.log('Cursor toggled successfully.');
// } else {
//     console.log('Failed to toggle cursor.');
// }
