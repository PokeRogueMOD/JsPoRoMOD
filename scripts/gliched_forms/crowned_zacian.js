// Accessing the game data for the 131st Dex entry (Lapras)
const dexEntryLapras =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameData.dexData[888];

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

// Calculating the attributes for G-MAX Lapras with Shiny and various other attributes
const gMaxLaprasAttributes =
    (1n << 8n) + // G-MAX Form
    DexAttributes.SHINY +
    DexAttributes.NON_SHINY +
    DexAttributes.MALE +
    DexAttributes.FEMALE +
    DexAttributes.DEFAULT_VARIANT +
    DexAttributes.VARIANT_2 +
    DexAttributes.VARIANT_3;

// Update the caught attributes of the Dex entry for Lapras, allowing toggling
dexEntryLapras.caughtAttr =
    dexEntryLapras.caughtAttr !== gMaxLaprasAttributes
        ? gMaxLaprasAttributes
        : BigInt(Number.MAX_SAFE_INTEGER);
