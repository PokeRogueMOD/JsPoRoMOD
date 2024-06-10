let Rarities = {
    COMMON: 0,
    GREAT: 1,
    ULTRA: 2,
    ROGUE: 3,
    MASTER: 4,
};

let Mode = {
    MESSAGE: 0,
    TITLE: 1,
    COMMAND: 2,
    FIGHT: 3,
    BALL: 4,
    TARGET_SELECT: 5,
    MODIFIER_SELECT: 6,
    SAVE_SLOT: 7,
    PARTY: 8,
    SUMMARY: 9,
    STARTER_SELECT: 10,
    EVOLUTION_SCENE: 11,
    EGG_HATCH_SCENE: 12,
    CONFIRM: 13,
    OPTION_SELECT: 14,
    MENU: 15,
    MENU_OPTION_SELECT: 16,
    SETTINGS: 17,
    SETTINGS_DISPLAY: 18,
    SETTINGS_AUDIO: 19,
    SETTINGS_GAMEPAD: 20,
    GAMEPAD_BINDING: 21,
    SETTINGS_KEYBOARD: 22,
    KEYBOARD_BINDING: 23,
    ACHIEVEMENTS: 24,
    GAME_STATS: 25,
    VOUCHERS: 26,
    EGG_LIST: 27,
    EGG_GACHA: 28,
    LOGIN_FORM: 29,
    REGISTRATION_FORM: 30,
    LOADING: 31,
    SESSION_RELOAD: 32,
    UNAVAILABLE: 33,
    OUTDATED: 34,
};

const Achievements = {
    _10K_MONEY: 0,
    _100K_MONEY: 1,
    _1M_MONEY: 2,
    _10M_MONEY: 3,
    _250_DMG: 4,
    _1000_DMG: 5,
    _2500_DMG: 6,
    _10000_DMG: 7,
    _250_HEAL: 8,
    _1000_HEAL: 9,
    _2500_HEAL: 10,
    _10000_HEAL: 11,
    LV_100: 12,
    LV_250: 13,
    LV_1000: 14,
    _10_RIBBONS: 15,
    _25_RIBBONS: 16,
    _50_RIBBONS: 17,
    _75_RIBBONS: 18,
    _100_RIBBONS: 19,
    TRANSFER_MAX_BATTLE_STAT: 20,
    MAX_FRIENDSHIP: 21,
    MEGA_EVOLVE: 22,
    GIGANTAMAX: 23,
    TERASTALLIZE: 24,
    STELLAR_TERASTALLIZE: 25,
    SPLICE: 26,
    MINI_BLACK_HOLE: 27,
    CATCH_MYTHICAL: 28,
    CATCH_SUB_LEGENDARY: 29,
    CATCH_LEGENDARY: 30,
    SEE_SHINY: 31,
    SHINY_PARTY: 32,
    HATCH_MYTHICAL: 33,
    HATCH_SUB_LEGENDARY: 34,
    HATCH_LEGENDARY: 35,
    HATCH_SHINY: 36,
    HIDDEN_ABILITY: 37,
    PERFECT_IVS: 38,
    CLASSIC_VICTORY: 39,
    MONO_GEN_ONE_VICTORY: 40,
    MONO_GEN_TWO_VICTORY: 41,
    MONO_GEN_THREE_VICTORY: 42,
    MONO_GEN_FOUR_VICTORY: 43,
    MONO_GEN_FIVE_VICTORY: 44,
    MONO_GEN_SIX_VICTORY: 45,
    MONO_GEN_SEVEN_VICTORY: 46,
    MONO_GEN_EIGHT_VICTORY: 47,
    MONO_GEN_NINE_VICTORY: 48,
    MONO_NORMAL: 49,
    MONO_FIGHTING: 50,
    MONO_FLYING: 51,
    MONO_POISON: 52,
    MONO_GROUND: 53,
    MONO_ROCK: 54,
    MONO_BUG: 55,
    MONO_GHOST: 56,
    MONO_STEEL: 57,
    MONO_FIRE: 58,
    MONO_WATER: 59,
    MONO_GRASS: 60,
    MONO_ELECTRIC: 61,
    MONO_PSYCHIC: 62,
    MONO_ICE: 63,
    MONO_DRAGON: 64,
    MONO_DARK: 65,
    MONO_FAIRY: 66,
};

class BaseScene {
    constructor() {
        this.minInt = -Math.pow(2, 31);
        this.maxInt = Math.pow(2, 31) - 1;
        this.maxMoneyInt = Number.MAX_SAFE_INTEGER - this.maxInt;
    }

    get scenes() {
        return Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene
            .scenes;
    }

    get currentScene() {
        return this.scenes[this.scenes.length > 1 ? this.scenes.length - 1 : 0];
    }

    get currentPhase() {
        return this.currentScene.currentPhase;
    }

    get currentPhaseName() {
        return this.currentPhase.constructor.name;
    }

    maxTeamLuck() {
        this.currentPhase.scene.getParty().forEach((pokemon) => {
            pokemon.luck = 11;
        });
        // console.log("Set all player Pokémon luck to 11!");
    }

    setMoney(value) {
        this.currentPhase.scene.money = value;
        this.currentPhase.scene.updateMoneyText();
        this.currentPhase.scene.animateMoneyChanged(false);
    }

    playBuySound(sound_name) {
        this.currentPhase.scene.playSound(sound_name);
    }

    clearUI() {
        this.currentPhase.scene.ui.clearText();
    }

    setUIMode(mode) {
        return this.currentPhase.scene.ui.setMode(mode);
    }
}

class SelectModifierPhaseScene extends BaseScene {
    constructor() {
        super();
    }

    rerollPhase(tier, lock) {
        // Src Extra Items: https://github.com/pagefaultgames/pokerogue/blob/209a69d098375dcb1f5f5be4be1d674e3b3d585f/src/modifier/modifier.ts#L2063

        const stackCount =
            3 +
            (this.currentScene.modifiers.find(
                (o) => o.constructor.name === "ExtraModifierModifier"
            )?.stackCount ?? 0);

        let itemsRef =
            Phaser.Display.Canvas.CanvasPool.pool[1].parent.parentContainer
                .parentContainer.displayList.list;

        let UIRef = itemsRef[itemsRef.length - 1].list.find(
            (o) => o.constructor.name == "UI"
        );

        let currentItems = UIRef.list[17].list
            .slice(0, stackCount)
            .map((o) => o.modifierTypeOption);

        let currentItemsTiers = currentItems.map((o) => o.type.tier);

        this.currentScene.lockModifierTiers = lock;

        let newModifierTiers =
            lock === true && tier === null
                ? currentItemsTiers
                : tier === null
                ? this.currentPhase
                      .getModifierTypeOptions(stackCount)
                      .map((o) => o.type.tier)
                : new Array(stackCount).fill(tier);

        // console.log("tier: ", tier);
        // console.log("lock: ", lock);

        // console.log(
        //     "this.currentPhase.modifierTiers: ",
        //     this.currentPhase.modifierTiers
        // );
        // console.log("stackCount: ", stackCount);
        // console.log("itemsRef: ", itemsRef);
        // console.log("UIRef: ", UIRef);
        // console.log("currentItems: ", currentItems);
        // console.log("currentItemsTiers: ", currentItemsTiers);
        // console.log("newModifierTiers: ", newModifierTiers);

        // Update Lock text
        let uiHandler = this.currentPhase.scene.ui.getHandler();
        uiHandler?.updateLockRaritiesText();

        this.currentPhase.scene.reroll = true;
        this.currentPhase.scene.unshiftPhase(
            new this.currentPhase.constructor(
                this.currentScene,
                this.maxInt,
                newModifierTiers
            )
        );
    }

    execute(tier, lock) {
        if (this.currentPhaseName === "SelectModifierPhase") {
            if (
                Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys
                    .battle.gameMode.modeId !== 3
            ) {
                this.rerollPhase(tier, lock);
                this.clearUI();
                this.setUIMode(0).then(() => this.currentPhase.end());
                this.maxTeamLuck();
                this.setMoney(this.maxMoneyInt);
                this.playBuySound("buy");
            } else {
                console.log("You cant cheat in daily run!");
            }
        } else {
            console.log("Not in a roll phase.");
        }
    }
}

class DataResetter extends BaseScene {
    constructor() {
        super();
    }

    execute() {
        if (this.currentPhaseName === "TitlePhase") {
            this.currentScene.gameData
                .saveAll(this.currentScene, true, true, true)
                .then((success) => {
                    if (!success) {
                        return this.currentScene.reset(true);
                    }
                    this.currentScene.gameData
                        .tryClearSession(
                            this.currentScene,
                            this.currentScene.sessionSlotId
                        )
                        .then((success) => {
                            if (!success[0]) {
                                return this.currentScene.reset(true);
                            }
                            this.currentScene.reset();
                            this.currentScene.unshiftPhase(
                                new this.currentScene.constructor(this.scene)
                            );
                            this.currentPhase.end();
                        });
                });
        } else {
            console.log("Go back to Title Screen first!");
        }
    }
}

class AchvUnlocker extends BaseScene {
    constructor() {
        super();
    }

    execute(hours, minutes, seconds) {
        const currentTimestamp =
            Date.now() - (hours * 3600 - minutes * 60 - seconds) * 1000;
        this.currentScene.gameData.achvUnlocks = Object.keys(
            Achievements
        ).reduce((acc, key) => {
            acc[key] = currentTimestamp;
            return acc;
        }, {});
        console.log("All achievements unlocked!");
    }
}

// Integrate the ReloadSessionPhase with your Hack class
class Hack {
    constructor() {
        this.selectModifierPhaseScene = new SelectModifierPhaseScene();
        this.dataResetter = new DataResetter();
        this.achvUnlocker = new AchvUnlocker();
    }

    roll(tier = null, lock = true) {
        this.selectModifierPhaseScene.execute(tier, lock);
    }

    allAchievements(hours = 0, minutes = 0, seconds = 0) {
        this.achvUnlocker.execute(hours, minutes, seconds);
    }

    RESET() {
        this.dataResetter.execute();
    }
}

// Add Hack to window and make it accessible as HACK
window.HACK = new Hack();
const HACK = window.HACK;

// Example usage
// HACK.RESET(); // Reset data and reload it from server! (Experimental!)

// HACK.allAchievements(48, 30, 10);  // Unlocks all achievements as 48 hours, 30 minutes and 10 seconds in the past

// HACK.roll(null, false); // Roll without locked shop
// HACK.roll(Rarities.COMMON); // Set shop tier to Common
// HACK.roll(Rarities.GREAT); // Set shop tier to Great
// HACK.roll(Rarities.ULTRA); // Set shop tier to Ultra
// HACK.roll(Rarities.ROGUE); // Set shop tier to Rogue
// HACK.roll(Rarities.MASTER); // Set shop tier to Master
// HACK.roll(); // Roll with locked shop
(function () {
    // Create the overlay div
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.width = "300px";
    overlay.style.padding = "10px";
    overlay.style.backgroundColor = "#121212";
    overlay.style.border = "1px solid #e0681a";
    overlay.style.color = "#ffffff";
    overlay.style.fontFamily = "Roboto, sans-serif";
    overlay.style.zIndex = 10000;
    overlay.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    document.body.appendChild(overlay);

    // Create the title bar
    var titleBar = document.createElement("div");
    titleBar.style.backgroundColor = "#1e1e1e";
    titleBar.style.padding = "5px";
    titleBar.style.cursor = "move";
    titleBar.style.textAlign = "center";
    titleBar.style.color = "#ffffff";
    titleBar.innerText = "MPB Hack Client";
    overlay.appendChild(titleBar);

    function onMouseOrTouchDown(e) {
        e.preventDefault();
        var startX = e.touches ? e.touches[0].clientX : e.clientX;
        var startY = e.touches ? e.touches[0].clientY : e.clientY;
        var offsetX = startX - overlay.offsetLeft;
        var offsetY = startY - overlay.offsetTop;

        function onMouseOrTouchMove(e) {
            var moveX = e.touches ? e.touches[0].clientX : e.clientX;
            var moveY = e.touches ? e.touches[0].clientY : e.clientY;
            overlay.style.left = moveX - offsetX + "px";
            overlay.style.top = moveY - offsetY + "px";
        }

        function onMouseOrTouchEnd() {
            document.removeEventListener("mousemove", onMouseOrTouchMove);
            document.removeEventListener("mouseup", onMouseOrTouchEnd);
            document.removeEventListener("touchmove", onMouseOrTouchMove);
            document.removeEventListener("touchend", onMouseOrTouchEnd);
        }

        document.addEventListener("mousemove", onMouseOrTouchMove);
        document.addEventListener("mouseup", onMouseOrTouchEnd);
        document.addEventListener("touchmove", onMouseOrTouchMove);
        document.addEventListener("touchend", onMouseOrTouchEnd);
    }

    titleBar.addEventListener("mousedown", onMouseOrTouchDown);
    titleBar.addEventListener("touchstart", onMouseOrTouchDown);

    // Create the Roll section header
    var rollHeader = document.createElement("h3");
    rollHeader.innerText = "Roll";
    rollHeader.style.color = "#ffffff";
    overlay.appendChild(rollHeader);

    // Create a container for the Roll options
    var rollOptionsContainer = document.createElement("div");
    rollOptionsContainer.style.display = "flex";
    rollOptionsContainer.style.gap = "10px";
    rollOptionsContainer.style.alignItems = "center";
    rollOptionsContainer.style.justifyContent = "space-between";
    overlay.appendChild(rollOptionsContainer);

    // Create the roll button
    var rollButton = document.createElement("button");
    rollButton.innerText = "Roll";
    rollButton.style.backgroundColor = "#e0681a";
    rollButton.style.color = "#ffffff";
    rollButton.style.border = "none";
    rollButton.style.padding = "5px 10px";
    rollButton.style.cursor = "pointer";
    rollButton.onclick = function () {
        var lock = lockCheckbox.checked;
        var rarity =
            dropdown.value === "NONE" ? null : parseInt(dropdown.value);
        HACK.roll(rarity, lock);
    };
    rollOptionsContainer.appendChild(rollButton);

    // Create the lock checkbox
    var lockLabel = document.createElement("label");
    lockLabel.innerText = "Lock";
    lockLabel.style.color = "#ffffff";
    var lockCheckbox = document.createElement("input");
    lockCheckbox.type = "checkbox";
    lockLabel.appendChild(lockCheckbox);
    rollOptionsContainer.appendChild(lockLabel);

    // Create the dropdown
    var dropdown = document.createElement("select");
    dropdown.style.backgroundColor = "#1e1e1e";
    dropdown.style.color = "#ffffff";
    dropdown.style.border = "1px solid #e0681a";
    for (var key in Rarities) {
        var option = document.createElement("option");
        option.value = Rarities[key];
        option.innerText = key;
        dropdown.appendChild(option);
    }
    var noneOption = document.createElement("option");
    noneOption.value = "NONE";
    noneOption.innerText = "NONE";
    noneOption.selected = true;
    dropdown.appendChild(noneOption);
    rollOptionsContainer.appendChild(dropdown);

    // Create the Achievements section header
    var achievementsHeader = document.createElement("h3");
    achievementsHeader.innerText = "Achievements";
    achievementsHeader.style.color = "#ffffff";
    overlay.appendChild(achievementsHeader);

    // Create a container for the Achievements options
    var achievementsOptionsContainer = document.createElement("div");
    achievementsOptionsContainer.style.display = "flex";
    achievementsOptionsContainer.style.flexDirection = "column";
    achievementsOptionsContainer.style.gap = "10px";
    achievementsOptionsContainer.style.alignItems = "center";
    achievementsOptionsContainer.style.justifyContent = "space-between";
    overlay.appendChild(achievementsOptionsContainer);

    // Create the unlock achievements button
    var unlockButton = document.createElement("button");
    unlockButton.innerText = "Unlock ALL";
    unlockButton.style.backgroundColor = "#e0681a";
    unlockButton.style.color = "#ffffff";
    unlockButton.style.border = "none";
    unlockButton.style.padding = "5px 10px";
    unlockButton.style.cursor = "pointer";
    unlockButton.onclick = function () {
        var hours = parseInt(hoursInput.value) || 0;
        var minutes = parseInt(minutesInput.value) || 0;
        var seconds = parseInt(secondsInput.value) || 0;
        HACK.allAchievements(hours, minutes, seconds);
    };
    achievementsOptionsContainer.appendChild(unlockButton);

    // Create a container for the time inputs
    var timeInputsContainer = document.createElement("div");
    timeInputsContainer.style.display = "flex";
    timeInputsContainer.style.gap = "5px";
    achievementsOptionsContainer.appendChild(timeInputsContainer);

    // Create the hours input
    var hoursInput = document.createElement("input");
    hoursInput.type = "number";
    hoursInput.placeholder = "Hours";
    hoursInput.style.width = "60px";
    hoursInput.style.backgroundColor = "#1e1e1e";
    hoursInput.style.color = "#ffffff";
    hoursInput.style.border = "1px solid #e0681a";
    timeInputsContainer.appendChild(hoursInput);

    // Create the minutes input
    var minutesInput = document.createElement("input");
    minutesInput.type = "number";
    minutesInput.placeholder = "Minutes";
    minutesInput.style.width = "60px";
    minutesInput.style.backgroundColor = "#1e1e1e";
    minutesInput.style.color = "#ffffff";
    minutesInput.style.border = "1px solid #e0681a";
    timeInputsContainer.appendChild(minutesInput);

    // Create the seconds input
    var secondsInput = document.createElement("input");
    secondsInput.type = "number";
    secondsInput.placeholder = "Seconds";
    secondsInput.style.width = "60px";
    secondsInput.style.backgroundColor = "#1e1e1e";
    secondsInput.style.color = "#ffffff";
    secondsInput.style.border = "1px solid #e0681a";
    timeInputsContainer.appendChild(secondsInput);
})();
