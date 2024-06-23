const battleScene =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle;

function addItemToPlayer(newItemModifier, playSound = true, instant = true) {
    return battleScene
        .updateModifiers(true, instant)
        .then(() =>
            battleScene
                .addModifier(newItemModifier, false, playSound, false, instant)
                .then(() => battleScene.updateModifiers(true, instant))
        );
}

const setMaxShinyRate = async () => {
    const modifiers = battleScene.modifiers;
    const searchString = "modifierType:ModifierType.SHINY_CHARM";
    const maxStackCount = 20;

    let index = modifiers.findIndex(
        ({ type: { localeKey } }) => localeKey === searchString
    );

    if (index === -1) {
        const shinyCharmModifier =
            new PokeRogue.modifier.ShinyRateBoosterModifier(
                PokeRogue.modifier.modifierTypes.SHINY_CHARM()
            );
        await addItemToPlayer(shinyCharmModifier, false, true);
        index = modifiers.findIndex(
            ({ type: { localeKey } }) => localeKey === searchString
        );
        if (index === -1) {
            console.error("Error: Modifier was not added correctly.");
            return;
        }
        console.log(`Added new object with stack count ${maxStackCount}`);
    }

    modifiers[index].stackCount = maxStackCount;
    await battleScene.updateModifiers(true, true);
    console.log(
        `Found at index: ${index}. Updated stack count to ${maxStackCount}`
    );
};

setMaxShinyRate();
