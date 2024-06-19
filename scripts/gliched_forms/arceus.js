const dexEntry =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameData.dexData[493];

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

const Type = {
    NORMAL: 0,
    FIGHTING: 1,
    FLYING: 2,
    POISON: 3,
    GROUND: 4,
    ROCK: 5,
    BUG: 6,
    GHOST: 7,
    STEEL: 8,
    FIRE: 9,
    WATER: 10,
    GRASS: 11,
    ELECTRIC: 12,
    PSYCHIC: 13,
    ICE: 14,
    DRAGON: 15,
    DARK: 16,
    FAIRY: 17,
    UNKNOWN: 18,
};

// Calculating the attributes for Eternamax Eternatus with Shiny and various other attributes
const gMaxLaprasAttributes =
    (1n << BigInt(7 + Type.NORMAL)) + // G-MAX Form
    DexAttributes.SHINY +
    DexAttributes.NON_SHINY +
    DexAttributes.MALE +
    DexAttributes.FEMALE +
    DexAttributes.DEFAULT_VARIANT +
    DexAttributes.VARIANT_2 +
    DexAttributes.VARIANT_3;

// Toggling between everything and gliched form
dexEntry.caughtAttr =
    dexEntry.caughtAttr !== gMaxLaprasAttributes
        ? gMaxLaprasAttributes
        : BigInt(Number.MAX_SAFE_INTEGER);
