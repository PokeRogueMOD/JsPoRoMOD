const scene = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle;
const bitmaskNature = Object.values(PokeRogue.data.Nature).reduce((mask, value) => mask | (1 << value), 0);
const noPassive = [
    "25","35","39","106","107","113","122","124","125","126","143","183","185", "202", "226", "315", "358", "4122",
];

// Retrieve the current dexData
const { dexData, starterData } = scene.gameData;

// Unlock all forms and variants for all Pokémon (shiny T3)
Object.keys(dexData).forEach((key) => {
    const data = dexData[key];
    data.seenAttr = BigInt(Number.MAX_SAFE_INTEGER);
    data.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
    data.natureAttr = bitmaskNature;
    data.seenCount = 420;
    data.caughtCount = 420;
    data.hatchedCount = 420;
    data.ivs = data.ivs.map(() => 420); // Credit: My Community!
});

// Unlock all starter Pokémon
Object.keys(starterData).forEach((key) => {
    const data = starterData[key];
    data.moveset = PokeRogue.data.speciesEggMoves[key] || null;
    data.eggMoves = PokeRogue.data.speciesEggMoves.hasOwnProperty(key)
        ? (1 << 4) - 1
        : 0;
    data.candyCount = 69; // Credit: My Community!
    data.friendship = Number.MAX_SAFE_INTEGER;
    data.abilityAttr =
        PokeRogue.system.AbilityAttr.ABILITY_1 |
        PokeRogue.system.AbilityAttr.ABILITY_2 |
        PokeRogue.system.AbilityAttr.ABILITY_HIDDEN;
    data.passiveAttr = noPassive.includes(key) ? 0 : 3;
    data.valueReduction = 10;

    // Check if classicWinCount is NaN, if so set it to 1, else add 1
    if (isNaN(data.classicWinCount)) {
        data.classicWinCount = 1;
    } else {
        data.classicWinCount += 1;
    }
});