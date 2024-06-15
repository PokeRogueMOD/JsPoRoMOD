// Accessing the game data for the 25th Dex entry
const dexEntryPikachu =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameData.dexData[25];

// Defining constants for Dex Attributes using BigInt for bitwise operations
const DexAttributes = {
    NON_SHINY: 1n,
    SHINY: 2n,
    MALE: 4n,
    FEMALE: 8n,
    DEFAULT_VARIANT: 16n,
    VARIANT_2: 32n,
    VARIANT_3: 64n,
    DEFAULT_FORM: 128n,
};

// Calculating the attributes for G-MAX Pikachu with Shiny and various other attributes
const gMaxPikachuAttributes =
    (1n << 15n) + // G-MAX Form
    DexAttributes.SHINY +
    DexAttributes.NON_SHINY +
    DexAttributes.MALE +
    DexAttributes.FEMALE +
    DexAttributes.DEFAULT_VARIANT +
    DexAttributes.VARIANT_2 +
    DexAttributes.VARIANT_3;

// Update the caught attributes of the Dex entry for Pikachu, allowing toggling
dexEntryPikachu.caughtAttributes =
    dexEntryPikachu.caughtAttributes !== gMaxPikachuAttributes
        ? gMaxPikachuAttributes
        : BigInt(Number.MAX_SAFE_INTEGER);
