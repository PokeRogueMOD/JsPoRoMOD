// Removes starter cost
const starterData = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.gameData.starterData;

Object.keys(starterData).forEach(key => {
  starterData[key].valueReduction = 99;
});