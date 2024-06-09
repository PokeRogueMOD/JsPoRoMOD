function getItems(all = false) {
    let scenes =
        Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes;
    let currentScene = scenes[scenes.length - 1];
    if (currentScene.currentPhase.constructor.name === "SelectModifierPhase") {
        let stackCount = null;

        if (all === false) {
            stackCount =
                3 +
                (currentScene.modifiers.find(
                    (o) => o.constructor.name === "ExtraModifierModifier"
                )?.stackCount ?? 0);
        }
        let itemsRef =
            Phaser.Display.Canvas.CanvasPool.pool[1].parent.parentContainer
                .parentContainer.displayList.list;

        let UIRef = itemsRef[itemsRef.length - 1].list.find(
            (o) => o.constructor.name == "UI"
        );

        let items = UIRef.list[17].list;
        if (stackCount === null) {
            stackCount = items.length - 1;
        }
        items = items.slice(0, stackCount);
        items = items.map((o) => o.modifierTypeOption);
        return items;
    } else {
        return "Not in a Shop Phase!"
    }
}
getItems(true);
