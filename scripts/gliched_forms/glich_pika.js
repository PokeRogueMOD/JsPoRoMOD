let _dexE =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameData.dexData[25];

if (_dexE.caughtAttr !== 65600n) {
    _dexE.caughtAttr = BigInt(65600)
} else {
    _dexE.caughtAttr = BigInt(Number.MAX_SAFE_INTEGER)
}
