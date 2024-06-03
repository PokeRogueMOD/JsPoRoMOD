if (
    window.gameInfo &&
    window.gameInfo.wave > 0 &&
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .gameMode.modeId !== 3
) {
    // Same result like hovering it!
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.modifierBar.list
        .reverse()
        .slice(24)
        .map((o) => o.setVisible(!o.visible));
    
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.modifierBar.list.reverse()
}
