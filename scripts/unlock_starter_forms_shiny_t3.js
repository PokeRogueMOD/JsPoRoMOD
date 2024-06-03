// Unlocks all forms for all starter pokemon and sets them all to shiny t3
const dexData = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.gameData.dexData;

Object.keys(dexData).forEach(key => {
  dexData[key].caughtAttr = BigInt(Number.MAX_SAFE_INTEGER);
});