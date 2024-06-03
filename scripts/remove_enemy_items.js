if (
    window.gameInfo &&
    window.gameInfo.wave > 0 &&
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameMode.modeId !== 3
) {
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.clearEnemyModifiers();
    // Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.clearEnemyHeldItemModifiers() // Only removes the attached enemy items
}
