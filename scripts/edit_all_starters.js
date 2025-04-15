// ========================= Customize Start =========================
const EXCLUDE = new Set([1, 4]); // Pokémon IDs to exclude from editing

const IVS = [
  1, // HP
  2, // Atk
  3, // Def
  4, // Sp Atk
  5, // Sp Def
  6  // Spd
];

const SEENATTR = BigInt(Number.MAX_SAFE_INTEGER);
const CAUGHTATTR = BigInt(Number.MAX_SAFE_INTEGER);

const SEEN_COUNT = 999;
const CAUGHT_COUNT = 999;
const HATCHED_COUNT = 999;

const CANDY_COUNT = 999;
const FRIENDSHIP = 255;
const VALUE_REDUCTION = 0;
// ========================== Customize End ==========================

// List of Pokémon indices that should have passiveAttr set to 0
const noPassive = new Set([
  25, 35, 39, 106, 107, 113, 122, 124, 125, 126, 143, 183, 185, 202, 226, 315,
  358, 4122,
]);

export const Nature = {
  HARDY: 0, LONELY: 1, BRAVE: 2, ADAMANT: 3, NAUGHTY: 4,
  BOLD: 5, DOCILE: 6, RELAXED: 7, IMPISH: 8, LAX: 9,
  TIMID: 10, HASTY: 11, SERIOUS: 12, JOLLY: 13, NAIVE: 14,
  MODEST: 15, MILD: 16, QUIET: 17, BASHFUL: 18, RASH: 19,
  CALM: 20, GENTLE: 21, SASSY: 22, CAREFUL: 23, QUIRKY: 24
};

const bitmaskNature = Object.values(Nature).reduce((mask, value) => mask | (1 << value), 0);

export const AbilityAttr = {
  ABILITY_1: 1,
  ABILITY_2: 2,
  ABILITY_HIDDEN: 4
};

const { dexData, starterData } =
  Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
    .gameData;

Object.keys(dexData).forEach((key) => {
  if (EXCLUDE.has(Number(key))) return;

  const data = dexData[key];
  data.seenAttr = SEENATTR;
  data.caughtAttr = CAUGHTATTR;
  data.natureAttr = bitmaskNature;
  data.seenCount = SEEN_COUNT;
  data.caughtCount = CAUGHT_COUNT;
  data.hatchedCount = HATCHED_COUNT;
  data.ivs = IVS;
});

Object.keys(starterData).forEach((key) => {
  if (EXCLUDE.has(Number(key))) return;

  const data = starterData[key];
  // data.moveset; // Skipped, use my editor instead!
  // data.eggMoves; // Skipped, use my editor instead!
  data.candyCount = CANDY_COUNT;
  data.friendship = FRIENDSHIP;
  data.abilityAttr =
    AbilityAttr.ABILITY_1 |
    AbilityAttr.ABILITY_2 |
    AbilityAttr.ABILITY_HIDDEN;
  data.passiveAttr = noPassive.has(Number(key)) ? 0 : 3;
  data.valueReduction = VALUE_REDUCTION;
  data.classicWinCount = isNaN(data.classicWinCount)
    ? 1
    : data.classicWinCount + 1;
});
