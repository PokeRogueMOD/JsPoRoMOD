class Modifier {
    constructor(type) {
        this.type = type;
    }

    match(_modifier) {
        return false;
    }

    shouldApply(_args) {
        return true;
    }

    apply(args) {
        return true; // or return Promise.resolve(true);
    }
}

class PersistentModifier extends Modifier {
    constructor(type, stackCount) {
        super(type);
        this.stackCount = stackCount === undefined ? 1 : stackCount;
        this.virtualStackCount = 0;
    }

    add(modifiers, virtual) {
        const battle =
            Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                .battle;
        for (const modifier of modifiers) {
            if (this.match(modifier)) {
                return modifier.incrementStack(
                    battle,
                    this.stackCount,
                    virtual
                );
            }
        }

        if (virtual) {
            this.virtualStackCount += this.stackCount;
            this.stackCount = 0;
        }
        modifiers.push(this);
        return true;
    }

    clone() {
        throw new Error(
            "Abstract method 'clone' must be implemented in subclass"
        );
    }

    getArgs() {
        return [];
    }

    incrementStack(scene, amount, virtual) {
        if (this.getStackCount() + amount <= this.getMaxStackCount(scene)) {
            if (!virtual) {
                this.stackCount += amount;
            } else {
                this.virtualStackCount += amount;
            }
            return true;
        }

        return false;
    }

    getStackCount() {
        return this.stackCount + this.virtualStackCount;
    }

    getMaxStackCount(scene, forThreshold) {
        throw new Error(
            "Abstract method 'getMaxStackCount' must be implemented in subclass"
        );
    }

    isIconVisible() {
        return true;
    }

    getIcon() {
        const battle =
            Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                .battle;
        const container = battle.add.container(0, 0);

        const item = battle.add.sprite(0, 12, "items");
        item.setFrame(this.type.iconImage);
        item.setOrigin(0, 0.5);
        container.add(item);

        const stackText = this.getIconStackText(battle);
        if (stackText) {
            container.add(stackText);
        }

        const virtualStackText = this.getIconStackText(battle, true);
        if (virtualStackText) {
            container.add(virtualStackText);
        }

        return container;
    }

    getIconStackText(scene, virtual) {
        if (
            this.getMaxStackCount(scene) === 1 ||
            (virtual && !this.virtualStackCount)
        ) {
            return null;
        }

        const text = scene.add.bitmapText(
            10,
            15,
            "item-count",
            this.stackCount.toString(),
            11
        );
        text.letterSpacing = -0.5;
        if (this.getStackCount() >= this.getMaxStackCount(scene)) {
            text.setTint(0xf89890);
        }
        text.setOrigin(0, 0);

        return text;
    }
}

class IntegerHolder {
    constructor(value) {
        this.value = value;
    }
}

class ShinyRateBoosterModifier extends PersistentModifier {
    constructor(type, stackCount) {
        super(type, stackCount);
    }

    match(modifier) {
        return modifier instanceof ShinyRateBoosterModifier;
    }

    clone() {
        return new ShinyRateBoosterModifier(this.type, this.stackCount);
    }

    apply(args) {
        args[0].value *= Math.pow(2, 2 + this.getStackCount());
        return true;
    }

    getMaxStackCount() {
        return 4;
    }
}

function getEnumValues(enumType) {
    return Object.values(enumType)
        .filter((v) => !isNaN(parseInt(v.toString())))
        .map((v) => parseInt(v.toString()));
}

class ModifierType {
    constructor(localeKey, iconImage, newModifierFunc, group, soundName) {
        this.localeKey = localeKey;
        this.iconImage = iconImage;
        this.group = group || "";
        this.soundName = soundName || "restore";
        this.newModifierFunc = newModifierFunc;
    }

    get name() {
        return `100% Shiny`;
    }

    getDescription(scene) {
        return `100% wild shiny chance.`;
    }

    setTier(tier) {
        this.tier = tier;
    }

    getOrInferTier(poolType = ModifierPoolType.PLAYER) {
        if (this.tier) {
            return this.tier;
        }
        if (!this.id) {
            return null;
        }
        let poolTypes;
        switch (poolType) {
            case ModifierPoolType.PLAYER:
                poolTypes = [
                    poolType,
                    ModifierPoolType.TRAINER,
                    ModifierPoolType.WILD,
                ];
                break;
            case ModifierPoolType.WILD:
                poolTypes = [
                    poolType,
                    ModifierPoolType.PLAYER,
                    ModifierPoolType.TRAINER,
                ];
                break;
            case ModifierPoolType.TRAINER:
                poolTypes = [
                    poolType,
                    ModifierPoolType.PLAYER,
                    ModifierPoolType.WILD,
                ];
                break;
            default:
                poolTypes = [poolType];
                break;
        }
        // Try multiple pool types in case of stolen items
        for (const type of poolTypes) {
            const pool = getModifierPoolForType(type);
            for (const tier of getEnumValues(ModifierTier)) {
                if (!pool.hasOwnProperty(tier)) {
                    continue;
                }
                if (
                    pool[tier].find(
                        (m) =>
                            m.modifierType.id === (this.generatorId || this.id)
                    )
                ) {
                    return (this.tier = tier);
                }
            }
        }
        return null;
    }

    withIdFromFunc(func) {
        this.id = Object.keys(modifierTypes).find(
            (k) => modifierTypes[k] === func
        );
        return this;
    }

    newModifier(...args) {
        return this.newModifierFunc(this, args);
    }
}

const ModifierPoolType = {
    PLAYER: 0,
    WILD: 1,
    TRAINER: 2,
    ENEMY_BUFF: 3,
    DAILY_STARTER: 4,
};

const ModifierTier = {
    COMMON: 0,
    GREAT: 1,
    ULTRA: 2,
    ROGUE: 3,
    MASTER: 4,
    LUXURY: 5,
};

function getModifierType(modifierTypeFunc) {
    const modifierType = modifierTypeFunc();
    if (!modifierType.id) {
        modifierType.id = Object.keys(modifierTypes).find(
            (k) => modifierTypes[k] === modifierTypeFunc
        );
    }
    return modifierType;
}

// Define the SHINY_CHARM modifier type
const SHINY_CHARM = new ModifierType(
    "modifierType:ModifierType.SHINY_CHARM",
    "shiny_charm",
    (type, _args) => new ShinyRateBoosterModifier(type)
);

const battleScene =
    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle;

function addItemToPlayer(newItemModifier, playSound = true, instant = true) {
    return new Promise((resolve) => {
        const addModifier = () => {
            battleScene
                .addModifier(newItemModifier, false, playSound, false, instant)
                .then(() => {
                    battleScene
                        .updateModifiers(true, instant)
                        .then(() => resolve(true));
                });
        };

        battleScene.updateModifiers(true, instant).then(() => addModifier());
    });
}

// Define the standalone script
const setMaxShinyRate = () => {
    // Access the battle scene
    const modifiers = battleScene.modifiers;

    // Search string and desired stack count
    const searchString = "modifierType:ModifierType.SHINY_CHARM";
    const maxStackCount = 20; // Maximum stack count to ensure 100% shiny chance

    // Find the index of the existing modifier
    const index = modifiers.findIndex(
        ({ type: { localeKey } }) => localeKey === searchString
    );

    if (index === -1) {
        // Add new modifier if not found
        const shinyCharmModifier = SHINY_CHARM.newModifier();
        shinyCharmModifier.stackCount = maxStackCount;
        console.dir(shinyCharmModifier);

        // Add the modifier to the battle scene
        // console.log(addItemToPlayer(shinyCharmModifier));
        shinyCharmModifier.add(modifiers, false)
        battleScene.updateModifiers(true, true);
        // modifiers.push(shinyCharmModifier);
        // battleScene.modifierBar.updateModifiers(battleScene.modifiers); // Update the count visually
        // battleScene.updateModifiers(true, true).then(() => battleScene.addModifier())
        console.log(
            `Not found. Added new object with stack count ${maxStackCount}`
        );
    } else {
        // Update existing modifier's stack count
        modifiers[index].stackCount = maxStackCount;
        battleScene.updateModifiers(true, true);
        console.log(
            `Found at index: ${index}. Updated stack count to ${maxStackCount}`
        );
    }
};

// Call the function
setMaxShinyRate();
