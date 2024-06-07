/*
Get the current phase: Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1].currentPhase.constructor.name
let currentPhase = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1].currentPhase
Refs:
    - New Reroll Phase: https://github.com/pagefaultgames/pokerogue/blob/f3de114d2bfdef27eba9cc0a1edfdcbfc48ce29b/src/phases.ts#L4910-L4926

Collected Phases:
    CommandPhase
    MessagePhase
    SelectModifierPhase (Item Reroll)
*/

// let minInt = -Math.pow(2, 31);
// let maxInt = Math.pow(2, 31) - 1;
// let maxMoneyInt = Number.MAX_SAFE_INTEGER - maxInt;
// let scenes = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes;
// let currentScene = scenes[scenes.length - 1];
// let currentPhase = currentScene.currentPhase;
// let currentPhaseName = currentScene.currentPhase.constructor.name; //

// console.log(currentPhaseName);

// // Function to set luck value of all player Pokémon to 99
// function maxTeamLuck() {
//     currentPhase.scene.getParty().forEach((pokemon) => {
//         pokemon.luck = 99;
//     });
//     console.log("Set all player Pokémon luck to 99!");
// }

// if (currentPhaseName === "SelectModifierPhase") {
//     currentPhase.scene.reroll = true;
//     currentPhase.scene.unshiftPhase(
//         new currentPhase.constructor(
//             currentScene,
//             minInt,
//             currentPhase
//                 .getModifierTypeOptions(
//                     6 //currentPhase.modifierTiers.length
//                 )
//                 .map(
//                     (o) => 4 // o.type.tier
//                 )
//         )
//     );
//     currentPhase.scene.ui.clearText();
//     currentPhase.scene.ui.setMode(0).then((o) => currentPhase.end());
//     maxTeamLuck();
//     currentPhase.scene.money = maxMoneyInt;
//     currentPhase.scene.updateMoneyText();
//     currentPhase.scene.animateMoneyChanged(false);
//     currentPhase.scene.playSound("buy");
// }


// // Update Lock text
// let uiHandler = this.currentPhase.scene.ui.getHandler();
// uiHandler?.updateLockRaritiesText();
// // DEMO: set cursor row:
// // uiHandler.setCursor(2)  // for lock tiers button
// // uiHandler.setRowCursor(0)
