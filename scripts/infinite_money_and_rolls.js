(function () {
    // Global boolean values
    window.MONEY = true;
    window.FREE_ROLL = true;
    window.MAX_LUCK = true;

    // Define a function to set up the custom setter
    function watchProperty(obj, property, path) {
        let value = obj[property];
        Object.defineProperty(obj, property, {
            get() {
                return value;
            },
            set(newValue) {
                if (
                    window.gameInfo &&
                    window.gameInfo.wave > 0 &&
                    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene
                        .keys.battle.gameMode.modeId !== 3
                ) {
                    if (window.MONEY) {
                        value = 999999999999999; // Ensure the money value is always set to this
                        obj.updateMoneyText();
                        console.log(`Value of ${property} reset to ${value}!`);
                    } else {
                        value = newValue; // Use regular logic
                        obj.updateMoneyText();
                    }

                    // Introduce a delay and call the function to reset the reroll cost if FREE_ROLL is true
                    if (window.FREE_ROLL) {
                        setTimeout(resetRerollCost, 0);
                    }

                    // Call maxTeamLuck if MAX_LUCK is true
                    if (window.MAX_LUCK) {
                        maxTeamLuck();
                        scene.updateAndShowLuckText();
                        showLuckText();
                    }
                } else {
                    value = newValue; // Use regular logic when wave is 0 or less
                    obj.updateMoneyText();
                }
            },
            configurable: true,
            enumerable: true,
        });
    }

    // Function to reset the reroll cost
    function resetRerollCost() {
        // Access and modify the reroll cost
        const rerollHandler1 =
            Phaser.Display.Canvas.CanvasPool.pool[1]?.parent?.scene
                ?.currentPhase?.rerollCount;
        if (rerollHandler1 !== undefined) {
            Phaser.Display.Canvas.CanvasPool.pool[1].parent.scene.currentPhase.rerollCount =
                -99;
        }

        const rerollHandler2 =
            Phaser.Display.Canvas.CanvasPool.pool[50]?.parent?.parentContainer
                ?.handlers[6];
        if (rerollHandler2) {
            rerollHandler2.setRerollCost(0);
            rerollHandler2.updateCostText();
        }

        console.log("Disabled Rollcost!");
    }

    // Function to access the active list
    function getActiveList() {
        return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
            .battle.sys.make.updateList._active;
    }

    // Function to categorize active list objects into specific lists by class names
    function categorizeActiveList(activeList) {
        const playerPokemonList = [];
        for (let i = 0; i < activeList.length; i++) {
            const obj = activeList[i];
            if (obj && obj.parentContainer && obj.parentContainer.constructor) {
                if (obj.parentContainer.constructor.name === "PlayerPokemon") {
                    playerPokemonList.push(obj.parentContainer);
                }
            }
        }
        return playerPokemonList;
    }

    // Function to set luck value of all player Pokémon to 99
    function maxTeamLuck() {
        const activeList = getActiveList();
        const playerPokemonList = categorizeActiveList(activeList);
        playerPokemonList.forEach((pokemon) => {
            pokemon.luck = 99;
        });
        console.log("Set all player Pokémon luck to 99!");
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

    // Set up the watcher on the specific property
    const scenePath =
        "Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1]";
    watchProperty(scene, "money", scenePath);
    // Call maxTeamLuck to set the initial luck values if MAX_LUCK is true and wave is greater than 0
    if (
        window.MAX_LUCK &&
        window.gameInfo &&
        window.gameInfo.wave > 0 &&
        Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
            .gameMode.modeId !== 3
    ) {
        maxTeamLuck();
        scene.updateAndShowLuckText();
        showLuckText();
    }
})();
