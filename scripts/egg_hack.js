let tier = 3;  // Tier of Egg (0: Common, 1: Rare, 2: Epic, 3: Legendary)
let gachaType = 1;  // Gacha type of eggs: (0: Move, 1: Legendary, 2: Shiny)
let hatchWaves = 0;  // Hatch eggs after this amount of time.

Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.gameData.eggs.forEach(
    o => {
        o.tier = tier;
        o.gachaType = gachaType;
        o.hatchWaves = hatchWaves;
    }
);