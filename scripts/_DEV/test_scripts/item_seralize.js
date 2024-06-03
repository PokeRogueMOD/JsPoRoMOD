// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.modifiers[0].getMaxStackCount() // Get max stack count of a item object
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.modifiers[0].type.getDescription() // Get item Description
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.modifiers // List of all Items
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.setModifiersVisible(false) // Show / Hide Items bar
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle // Show / Hide Items bar

function serialize(obj) {
    const serialized = JSON.stringify(obj, function (key, value) {
        if (value && value.constructor) {
            value.__constructorName = value.constructor.name;
        }
        return value;
    });
    return serialized;
}

// Example usage
const serializedData = serialize(
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle
        .modifiers
);
console.log(serializedData);
