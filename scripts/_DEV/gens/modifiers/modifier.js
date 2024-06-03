"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonMoveAccuracyBoosterModifier = exports.PokemonNatureWeightModifier = exports.PokemonFriendshipBoosterModifier = exports.ExpBalanceModifier = exports.ExpShareModifier = exports.PokemonExpBoosterModifier = exports.ExpBoosterModifier = exports.HealingBoosterModifier = exports.MultipleParticipantExpBonusModifier = exports.FusePokemonModifier = exports.EvolutionItemModifier = exports.RememberMoveModifier = exports.TmModifier = exports.PokemonLevelIncrementModifier = exports.PokemonNatureChangeModifier = exports.PokemonPpUpModifier = exports.PokemonAllMovePpRestoreModifier = exports.PokemonPpRestoreModifier = exports.ConsumablePokemonMoveModifier = exports.PokemonStatusHealModifier = exports.PokemonHpRestoreModifier = exports.ConsumablePokemonModifier = exports.PokemonInstantReviveModifier = exports.PreserveBerryModifier = exports.BerryModifier = exports.LevelIncrementBoosterModifier = exports.HitHealModifier = exports.TurnHealModifier = exports.FlinchChanceModifier = exports.BypassSpeedChanceModifier = exports.SurviveDamageModifier = exports.AttackTypeBoosterModifier = exports.PokemonBaseStatModifier = exports.TerastallizeModifier = exports.LapsingPokemonHeldItemModifier = exports.PokemonHeldItemModifier = exports.TerastallizeAccessModifier = exports.GigantamaxAccessModifier = exports.MegaEvolutionAccessModifier = exports.MapModifier = exports.TempBattleStatBoosterModifier = exports.DoubleBattleChanceBoosterModifier = exports.LapsingPersistentModifier = exports.AddVoucherModifier = exports.AddPokeballModifier = exports.ConsumableModifier = exports.PersistentModifier = exports.Modifier = exports.ModifierBar = exports.modifierSortFunc = void 0;
exports.overrideHeldItems = exports.overrideModifiers = exports.EnemyFusionChanceModifier = exports.EnemyEndureChanceModifier = exports.EnemyStatusEffectHealChanceModifier = exports.EnemyAttackStatusEffectChanceModifier = exports.EnemyTurnHealModifier = exports.EnemyDamageReducerModifier = exports.EnemyDamageBoosterModifier = exports.EnemyPersistentModifier = exports.ExtraModifierModifier = exports.IvScannerModifier = exports.ContactHeldItemTransferChanceModifier = exports.TurnHeldItemTransferModifier = exports.HeldItemTransferModifier = exports.SwitchEffectTransferModifier = exports.LockModifierTiersModifier = exports.ShinyRateBoosterModifier = exports.HiddenAbilityRateBoosterModifier = exports.MoneyInterestModifier = exports.DamageMoneyRewardModifier = exports.MoneyMultiplierModifier = exports.MoneyRewardModifier = exports.PokemonFormChangeItemModifier = exports.PokemonMultiHitModifier = void 0;
var ModifierTypes = require("./modifier-type");
var phases_1 = require("../phases");
var battle_scene_1 = require("../battle-scene");
var exp_1 = require("../data/exp");
var pokemon_1 = require("../field/pokemon");
var text_1 = require("../ui/text");
var type_1 = require("../data/type");
var evolution_phase_1 = require("../evolution-phase");
var pokemon_evolutions_1 = require("../data/pokemon-evolutions");
var messages_1 = require("../messages");
var Utils = require("../utils");
var berry_1 = require("../data/berry");
var status_effect_1 = require("../data/status-effect");
var achv_1 = require("../system/achv");
var pokemon_forms_1 = require("../data/pokemon-forms");
var battler_tag_type_1 = require("#app/data/enums/battler-tag-type");
var Overrides = require("../overrides");
var modifier_type_1 = require("./modifier-type");
var iconOverflowIndex = 24;
var modifierSortFunc = function (a, b) {
    var aId = a instanceof PokemonHeldItemModifier ? a.pokemonId : 4294967295;
    var bId = b instanceof PokemonHeldItemModifier ? b.pokemonId : 4294967295;
    return aId < bId ? 1 : aId > bId ? -1 : 0;
};
exports.modifierSortFunc = modifierSortFunc;
var ModifierBar = /** @class */ (function (_super) {
    __extends(ModifierBar, _super);
    function ModifierBar(scene, enemy) {
        var _this = _super.call(this, scene, 1 + (enemy ? 302 : 0), 2) || this;
        _this.player = !enemy;
        _this.setScale(0.5);
        return _this;
    }
    ModifierBar.prototype.updateModifiers = function (modifiers) {
        var _this = this;
        this.removeAll(true);
        var visibleIconModifiers = modifiers.filter(function (m) { return m.isIconVisible(_this.scene); });
        visibleIconModifiers.sort(exports.modifierSortFunc);
        var thisArg = this;
        visibleIconModifiers.forEach(function (modifier, i) {
            var icon = modifier.getIcon(_this.scene);
            if (i >= iconOverflowIndex) {
                icon.setVisible(false);
            }
            _this.add(icon);
            _this.setModifierIconPosition(icon, visibleIconModifiers.length);
            icon.setInteractive(new Phaser.Geom.Rectangle(0, 0, 32, 24), Phaser.Geom.Rectangle.Contains);
            icon.on("pointerover", function () {
                _this.scene.ui.showTooltip(modifier.type.name, modifier.type.getDescription(_this.scene));
                if (_this.modifierCache && _this.modifierCache.length > iconOverflowIndex) {
                    thisArg.updateModifierOverflowVisibility(true);
                }
            });
            icon.on("pointerout", function () {
                _this.scene.ui.hideTooltip();
                if (_this.modifierCache && _this.modifierCache.length > iconOverflowIndex) {
                    thisArg.updateModifierOverflowVisibility(false);
                }
            });
        });
        for (var _i = 0, _a = this.getAll(); _i < _a.length; _i++) {
            var icon = _a[_i];
            this.sendToBack(icon);
        }
        this.modifierCache = modifiers;
    };
    ModifierBar.prototype.updateModifierOverflowVisibility = function (ignoreLimit) {
        var modifierIcons = this.getAll().reverse();
        for (var _i = 0, _a = modifierIcons.map(function (m) { return m; }).slice(iconOverflowIndex); _i < _a.length; _i++) {
            var modifier = _a[_i];
            modifier.setVisible(ignoreLimit);
        }
    };
    ModifierBar.prototype.setModifierIconPosition = function (icon, modifierCount) {
        var rowIcons = 12 + 6 * Math.max((Math.ceil(Math.min(modifierCount, 24) / 12) - 2), 0);
        var x = (this.getIndex(icon) % rowIcons) * 26 / (rowIcons / 12);
        var y = Math.floor(this.getIndex(icon) / rowIcons) * 20;
        icon.setPosition(this.player ? x : -x, y);
    };
    return ModifierBar;
}(Phaser.GameObjects.Container));
exports.ModifierBar = ModifierBar;
var Modifier = /** @class */ (function () {
    function Modifier(type) {
        this.type = type;
    }
    Modifier.prototype.match = function (_modifier) {
        return false;
    };
    Modifier.prototype.shouldApply = function (_args) {
        return true;
    };
    return Modifier;
}());
exports.Modifier = Modifier;
var PersistentModifier = /** @class */ (function (_super) {
    __extends(PersistentModifier, _super);
    function PersistentModifier(type, stackCount) {
        var _this = _super.call(this, type) || this;
        _this.stackCount = stackCount === undefined ? 1 : stackCount;
        _this.virtualStackCount = 0;
        return _this;
    }
    PersistentModifier.prototype.add = function (modifiers, virtual, scene) {
        for (var _i = 0, modifiers_1 = modifiers; _i < modifiers_1.length; _i++) {
            var modifier = modifiers_1[_i];
            if (this.match(modifier)) {
                return modifier.incrementStack(scene, this.stackCount, virtual);
            }
        }
        if (virtual) {
            this.virtualStackCount += this.stackCount;
            this.stackCount = 0;
        }
        modifiers.push(this);
        return true;
    };
    PersistentModifier.prototype.getArgs = function () {
        return [];
    };
    PersistentModifier.prototype.incrementStack = function (scene, amount, virtual) {
        if (this.getStackCount() + amount <= this.getMaxStackCount(scene)) {
            if (!virtual) {
                this.stackCount += amount;
            }
            else {
                this.virtualStackCount += amount;
            }
            return true;
        }
        return false;
    };
    PersistentModifier.prototype.getStackCount = function () {
        return this.stackCount + this.virtualStackCount;
    };
    PersistentModifier.prototype.isIconVisible = function (scene) {
        return true;
    };
    PersistentModifier.prototype.getIcon = function (scene, forSummary) {
        var container = scene.add.container(0, 0);
        var item = scene.add.sprite(0, 12, "items");
        item.setFrame(this.type.iconImage);
        item.setOrigin(0, 0.5);
        container.add(item);
        var stackText = this.getIconStackText(scene);
        if (stackText) {
            container.add(stackText);
        }
        var virtualStackText = this.getIconStackText(scene, true);
        if (virtualStackText) {
            container.add(virtualStackText);
        }
        return container;
    };
    PersistentModifier.prototype.getIconStackText = function (scene, virtual) {
        if (this.getMaxStackCount(scene) === 1 || (virtual && !this.virtualStackCount)) {
            return null;
        }
        var text = scene.add.bitmapText(10, 15, "item-count", this.stackCount.toString(), 11);
        text.letterSpacing = -0.5;
        if (this.getStackCount() >= this.getMaxStackCount(scene)) {
            text.setTint(0xf89890);
        }
        text.setOrigin(0, 0);
        return text;
    };
    return PersistentModifier;
}(Modifier));
exports.PersistentModifier = PersistentModifier;
var ConsumableModifier = /** @class */ (function (_super) {
    __extends(ConsumableModifier, _super);
    function ConsumableModifier(type) {
        return _super.call(this, type) || this;
    }
    ConsumableModifier.prototype.add = function (_modifiers) {
        return true;
    };
    ConsumableModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 1 && args[0] instanceof battle_scene_1.default;
    };
    return ConsumableModifier;
}(Modifier));
exports.ConsumableModifier = ConsumableModifier;
var AddPokeballModifier = /** @class */ (function (_super) {
    __extends(AddPokeballModifier, _super);
    function AddPokeballModifier(type, pokeballType, count) {
        var _this = _super.call(this, type) || this;
        _this.pokeballType = pokeballType;
        _this.count = count;
        return _this;
    }
    AddPokeballModifier.prototype.apply = function (args) {
        var pokeballCounts = args[0].pokeballCounts;
        pokeballCounts[this.pokeballType] = Math.min(pokeballCounts[this.pokeballType] + this.count, 99);
        return true;
    };
    return AddPokeballModifier;
}(ConsumableModifier));
exports.AddPokeballModifier = AddPokeballModifier;
var AddVoucherModifier = /** @class */ (function (_super) {
    __extends(AddVoucherModifier, _super);
    function AddVoucherModifier(type, voucherType, count) {
        var _this = _super.call(this, type) || this;
        _this.voucherType = voucherType;
        _this.count = count;
        return _this;
    }
    AddVoucherModifier.prototype.apply = function (args) {
        var voucherCounts = args[0].gameData.voucherCounts;
        voucherCounts[this.voucherType] += this.count;
        return true;
    };
    return AddVoucherModifier;
}(ConsumableModifier));
exports.AddVoucherModifier = AddVoucherModifier;
var LapsingPersistentModifier = /** @class */ (function (_super) {
    __extends(LapsingPersistentModifier, _super);
    function LapsingPersistentModifier(type, battlesLeft, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.battlesLeft = battlesLeft;
        return _this;
    }
    LapsingPersistentModifier.prototype.lapse = function (args) {
        return !!--this.battlesLeft;
    };
    LapsingPersistentModifier.prototype.getIcon = function (scene) {
        var container = _super.prototype.getIcon.call(this, scene);
        var battleCountText = (0, text_1.addTextObject)(scene, 27, 0, this.battlesLeft.toString(), text_1.TextStyle.PARTY, { fontSize: "66px", color: "#f89890" });
        battleCountText.setShadow(0, 0, null);
        battleCountText.setStroke("#984038", 16);
        battleCountText.setOrigin(1, 0);
        container.add(battleCountText);
        return container;
    };
    LapsingPersistentModifier.prototype.getBattlesLeft = function () {
        return this.battlesLeft;
    };
    LapsingPersistentModifier.prototype.getMaxStackCount = function (scene, forThreshold) {
        return 99;
    };
    return LapsingPersistentModifier;
}(PersistentModifier));
exports.LapsingPersistentModifier = LapsingPersistentModifier;
var DoubleBattleChanceBoosterModifier = /** @class */ (function (_super) {
    __extends(DoubleBattleChanceBoosterModifier, _super);
    function DoubleBattleChanceBoosterModifier(type, battlesLeft, stackCount) {
        return _super.call(this, type, battlesLeft, stackCount) || this;
    }
    DoubleBattleChanceBoosterModifier.prototype.match = function (modifier) {
        if (modifier instanceof DoubleBattleChanceBoosterModifier) {
            return modifier.battlesLeft === this.battlesLeft;
        }
        return false;
    };
    DoubleBattleChanceBoosterModifier.prototype.clone = function () {
        return new DoubleBattleChanceBoosterModifier(this.type, this.battlesLeft, this.stackCount);
    };
    DoubleBattleChanceBoosterModifier.prototype.getArgs = function () {
        return [this.battlesLeft];
    };
    DoubleBattleChanceBoosterModifier.prototype.apply = function (args) {
        var doubleBattleChance = args[0];
        doubleBattleChance.value = Math.ceil(doubleBattleChance.value / 2);
        return true;
    };
    return DoubleBattleChanceBoosterModifier;
}(LapsingPersistentModifier));
exports.DoubleBattleChanceBoosterModifier = DoubleBattleChanceBoosterModifier;
var TempBattleStatBoosterModifier = /** @class */ (function (_super) {
    __extends(TempBattleStatBoosterModifier, _super);
    function TempBattleStatBoosterModifier(type, tempBattleStat, battlesLeft, stackCount) {
        var _this = _super.call(this, type, battlesLeft || 5, stackCount) || this;
        _this.tempBattleStat = tempBattleStat;
        return _this;
    }
    TempBattleStatBoosterModifier.prototype.match = function (modifier) {
        if (modifier instanceof TempBattleStatBoosterModifier) {
            return modifier.tempBattleStat === this.tempBattleStat
                && modifier.battlesLeft === this.battlesLeft;
        }
        return false;
    };
    TempBattleStatBoosterModifier.prototype.clone = function () {
        return new TempBattleStatBoosterModifier(this.type, this.tempBattleStat, this.battlesLeft, this.stackCount);
    };
    TempBattleStatBoosterModifier.prototype.getArgs = function () {
        return [this.tempBattleStat, this.battlesLeft];
    };
    TempBattleStatBoosterModifier.prototype.apply = function (args) {
        var tempBattleStat = args[0];
        if (tempBattleStat === this.tempBattleStat) {
            var statLevel = args[1];
            statLevel.value = Math.min(statLevel.value + 1, 6);
            return true;
        }
        return false;
    };
    return TempBattleStatBoosterModifier;
}(LapsingPersistentModifier));
exports.TempBattleStatBoosterModifier = TempBattleStatBoosterModifier;
var MapModifier = /** @class */ (function (_super) {
    __extends(MapModifier, _super);
    function MapModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    MapModifier.prototype.clone = function () {
        return new MapModifier(this.type, this.stackCount);
    };
    MapModifier.prototype.apply = function (args) {
        return true;
    };
    MapModifier.prototype.getMaxStackCount = function (scene) {
        return 1;
    };
    return MapModifier;
}(PersistentModifier));
exports.MapModifier = MapModifier;
var MegaEvolutionAccessModifier = /** @class */ (function (_super) {
    __extends(MegaEvolutionAccessModifier, _super);
    function MegaEvolutionAccessModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    MegaEvolutionAccessModifier.prototype.clone = function () {
        return new MegaEvolutionAccessModifier(this.type, this.stackCount);
    };
    MegaEvolutionAccessModifier.prototype.apply = function (args) {
        return true;
    };
    MegaEvolutionAccessModifier.prototype.getMaxStackCount = function (scene) {
        return 1;
    };
    return MegaEvolutionAccessModifier;
}(PersistentModifier));
exports.MegaEvolutionAccessModifier = MegaEvolutionAccessModifier;
var GigantamaxAccessModifier = /** @class */ (function (_super) {
    __extends(GigantamaxAccessModifier, _super);
    function GigantamaxAccessModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    GigantamaxAccessModifier.prototype.clone = function () {
        return new GigantamaxAccessModifier(this.type, this.stackCount);
    };
    GigantamaxAccessModifier.prototype.apply = function (args) {
        return true;
    };
    GigantamaxAccessModifier.prototype.getMaxStackCount = function (scene) {
        return 1;
    };
    return GigantamaxAccessModifier;
}(PersistentModifier));
exports.GigantamaxAccessModifier = GigantamaxAccessModifier;
var TerastallizeAccessModifier = /** @class */ (function (_super) {
    __extends(TerastallizeAccessModifier, _super);
    function TerastallizeAccessModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    TerastallizeAccessModifier.prototype.clone = function () {
        return new TerastallizeAccessModifier(this.type, this.stackCount);
    };
    TerastallizeAccessModifier.prototype.apply = function (args) {
        return true;
    };
    TerastallizeAccessModifier.prototype.getMaxStackCount = function (scene) {
        return 1;
    };
    return TerastallizeAccessModifier;
}(PersistentModifier));
exports.TerastallizeAccessModifier = TerastallizeAccessModifier;
var PokemonHeldItemModifier = /** @class */ (function (_super) {
    __extends(PokemonHeldItemModifier, _super);
    function PokemonHeldItemModifier(type, pokemonId, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.pokemonId = pokemonId;
        return _this;
    }
    PokemonHeldItemModifier.prototype.match = function (modifier) {
        return this.matchType(modifier) && modifier.pokemonId === this.pokemonId;
    };
    PokemonHeldItemModifier.prototype.getArgs = function () {
        return [this.pokemonId];
    };
    PokemonHeldItemModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length && args[0] instanceof pokemon_1.default && (this.pokemonId === -1 || args[0].id === this.pokemonId);
    };
    PokemonHeldItemModifier.prototype.getTransferrable = function (withinParty) {
        return true;
    };
    PokemonHeldItemModifier.prototype.isIconVisible = function (scene) {
        return this.getPokemon(scene).isOnField();
    };
    PokemonHeldItemModifier.prototype.getIcon = function (scene, forSummary) {
        var container = !forSummary ? scene.add.container(0, 0) : _super.prototype.getIcon.call(this, scene);
        if (!forSummary) {
            var pokemon = this.getPokemon(scene);
            var pokemonIcon = scene.addPokemonIcon(pokemon, -2, 10, 0, 0.5);
            container.add(pokemonIcon);
            var item = scene.add.sprite(16, this.virtualStackCount ? 8 : 16, "items");
            item.setScale(0.5);
            item.setOrigin(0, 0.5);
            item.setTexture("items", this.type.iconImage);
            container.add(item);
            var stackText = this.getIconStackText(scene);
            if (stackText) {
                container.add(stackText);
            }
            var virtualStackText = this.getIconStackText(scene, true);
            if (virtualStackText) {
                container.add(virtualStackText);
            }
        }
        else {
            container.setScale(0.5);
        }
        return container;
    };
    PokemonHeldItemModifier.prototype.getPokemon = function (scene) {
        return scene.getPokemonById(this.pokemonId);
    };
    PokemonHeldItemModifier.prototype.getScoreMultiplier = function () {
        return 1;
    };
    PokemonHeldItemModifier.prototype.getMaxStackCount = function (scene, forThreshold) {
        var _this = this;
        var pokemon = this.getPokemon(scene);
        if (!pokemon) {
            return 0;
        }
        if (pokemon.isPlayer() && forThreshold) {
            return scene.getParty().map(function (p) { return _this.getMaxHeldItemCount(p); }).reduce(function (stackCount, maxStackCount) { return Math.max(stackCount, maxStackCount); }, 0);
        }
        return this.getMaxHeldItemCount(pokemon);
    };
    return PokemonHeldItemModifier;
}(PersistentModifier));
exports.PokemonHeldItemModifier = PokemonHeldItemModifier;
var LapsingPokemonHeldItemModifier = /** @class */ (function (_super) {
    __extends(LapsingPokemonHeldItemModifier, _super);
    function LapsingPokemonHeldItemModifier(type, pokemonId, battlesLeft, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.battlesLeft = battlesLeft;
        return _this;
    }
    LapsingPokemonHeldItemModifier.prototype.lapse = function (args) {
        return !!--this.battlesLeft;
    };
    LapsingPokemonHeldItemModifier.prototype.getIcon = function (scene, forSummary) {
        var container = _super.prototype.getIcon.call(this, scene, forSummary);
        if (this.getPokemon(scene).isPlayer()) {
            var battleCountText = (0, text_1.addTextObject)(scene, 27, 0, this.battlesLeft.toString(), text_1.TextStyle.PARTY, { fontSize: "66px", color: "#f89890" });
            battleCountText.setShadow(0, 0, null);
            battleCountText.setStroke("#984038", 16);
            battleCountText.setOrigin(1, 0);
            container.add(battleCountText);
        }
        return container;
    };
    LapsingPokemonHeldItemModifier.prototype.getBattlesLeft = function () {
        return this.battlesLeft;
    };
    LapsingPokemonHeldItemModifier.prototype.getMaxStackCount = function (scene, forThreshold) {
        return 1;
    };
    return LapsingPokemonHeldItemModifier;
}(PokemonHeldItemModifier));
exports.LapsingPokemonHeldItemModifier = LapsingPokemonHeldItemModifier;
var TerastallizeModifier = /** @class */ (function (_super) {
    __extends(TerastallizeModifier, _super);
    function TerastallizeModifier(type, pokemonId, teraType, battlesLeft, stackCount) {
        var _this = _super.call(this, type, pokemonId, battlesLeft || 10, stackCount) || this;
        _this.teraType = teraType;
        return _this;
    }
    TerastallizeModifier.prototype.matchType = function (modifier) {
        if (modifier instanceof TerastallizeModifier && modifier.teraType === this.teraType) {
            return true;
        }
        return false;
    };
    TerastallizeModifier.prototype.clone = function () {
        return new TerastallizeModifier(this.type, this.pokemonId, this.teraType, this.battlesLeft, this.stackCount);
    };
    TerastallizeModifier.prototype.getArgs = function () {
        return [this.pokemonId, this.teraType, this.battlesLeft];
    };
    TerastallizeModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        if (pokemon.isPlayer()) {
            pokemon.scene.validateAchv(achv_1.achvs.TERASTALLIZE);
            if (this.teraType === type_1.Type.STELLAR) {
                pokemon.scene.validateAchv(achv_1.achvs.STELLAR_TERASTALLIZE);
            }
        }
        pokemon.updateSpritePipelineData();
        return true;
    };
    TerastallizeModifier.prototype.lapse = function (args) {
        var ret = _super.prototype.lapse.call(this, args);
        if (!ret) {
            var pokemon = args[0];
            pokemon.updateSpritePipelineData();
        }
        return ret;
    };
    TerastallizeModifier.prototype.getTransferrable = function (withinParty) {
        return false;
    };
    TerastallizeModifier.prototype.getScoreMultiplier = function () {
        return 1.25;
    };
    TerastallizeModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 1;
    };
    return TerastallizeModifier;
}(LapsingPokemonHeldItemModifier));
exports.TerastallizeModifier = TerastallizeModifier;
var PokemonBaseStatModifier = /** @class */ (function (_super) {
    __extends(PokemonBaseStatModifier, _super);
    function PokemonBaseStatModifier(type, pokemonId, stat, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.stat = stat;
        return _this;
    }
    PokemonBaseStatModifier.prototype.matchType = function (modifier) {
        if (modifier instanceof PokemonBaseStatModifier) {
            return modifier.stat === this.stat;
        }
        return false;
    };
    PokemonBaseStatModifier.prototype.clone = function () {
        return new PokemonBaseStatModifier(this.type, this.pokemonId, this.stat, this.stackCount);
    };
    PokemonBaseStatModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.stat);
    };
    PokemonBaseStatModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Array;
    };
    PokemonBaseStatModifier.prototype.apply = function (args) {
        args[1][this.stat] = Math.min(Math.floor(args[1][this.stat] * (1 + this.getStackCount() * 0.1)), 999999);
        return true;
    };
    PokemonBaseStatModifier.prototype.getTransferrable = function (_withinParty) {
        return false;
    };
    PokemonBaseStatModifier.prototype.getScoreMultiplier = function () {
        return 1.1;
    };
    PokemonBaseStatModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return pokemon.ivs[this.stat];
    };
    return PokemonBaseStatModifier;
}(PokemonHeldItemModifier));
exports.PokemonBaseStatModifier = PokemonBaseStatModifier;
/**
 * Applies Specific Type item boosts (e.g., Magnet)
 */
var AttackTypeBoosterModifier = /** @class */ (function (_super) {
    __extends(AttackTypeBoosterModifier, _super);
    function AttackTypeBoosterModifier(type, pokemonId, moveType, boostPercent, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.moveType = moveType;
        _this.boostMultiplier = boostPercent * 0.01;
        return _this;
    }
    AttackTypeBoosterModifier.prototype.matchType = function (modifier) {
        if (modifier instanceof AttackTypeBoosterModifier) {
            var attackTypeBoosterModifier = modifier;
            return attackTypeBoosterModifier.moveType === this.moveType && attackTypeBoosterModifier.boostMultiplier === this.boostMultiplier;
        }
        return false;
    };
    AttackTypeBoosterModifier.prototype.clone = function () {
        return new AttackTypeBoosterModifier(this.type, this.pokemonId, this.moveType, this.boostMultiplier * 100, this.stackCount);
    };
    AttackTypeBoosterModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat([this.moveType, this.boostMultiplier * 100]);
    };
    AttackTypeBoosterModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 3 && typeof args[1] === "number" && args[2] instanceof Utils.NumberHolder;
    };
    /**
   * @param {Array<any>} args Array
   *                          - Index 0: {Pokemon} Pokemon
   *                          - Index 1: {number} Move type
   *                          - Index 2: {Utils.NumberHolder} Move power
   * @returns {boolean} Returns true if boosts have been applied to the move.
   */
    AttackTypeBoosterModifier.prototype.apply = function (args) {
        if (args[1] === this.moveType && args[2].value >= 1) {
            args[2].value = Math.floor(args[2].value * (1 + (this.getStackCount() * this.boostMultiplier)));
            return true;
        }
        return false;
    };
    AttackTypeBoosterModifier.prototype.getScoreMultiplier = function () {
        return 1.2;
    };
    AttackTypeBoosterModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 99;
    };
    return AttackTypeBoosterModifier;
}(PokemonHeldItemModifier));
exports.AttackTypeBoosterModifier = AttackTypeBoosterModifier;
var SurviveDamageModifier = /** @class */ (function (_super) {
    __extends(SurviveDamageModifier, _super);
    function SurviveDamageModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    SurviveDamageModifier.prototype.matchType = function (modifier) {
        return modifier instanceof SurviveDamageModifier;
    };
    SurviveDamageModifier.prototype.clone = function () {
        return new SurviveDamageModifier(this.type, this.pokemonId, this.stackCount);
    };
    SurviveDamageModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Utils.BooleanHolder;
    };
    SurviveDamageModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var surviveDamage = args[1];
        if (!surviveDamage.value && pokemon.randSeedInt(10) < this.getStackCount()) {
            surviveDamage.value = true;
            pokemon.scene.queueMessage((0, messages_1.getPokemonMessage)(pokemon, " hung on\nusing its ".concat(this.type.name, "!")));
            return true;
        }
        return false;
    };
    SurviveDamageModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 5;
    };
    return SurviveDamageModifier;
}(PokemonHeldItemModifier));
exports.SurviveDamageModifier = SurviveDamageModifier;
var BypassSpeedChanceModifier = /** @class */ (function (_super) {
    __extends(BypassSpeedChanceModifier, _super);
    function BypassSpeedChanceModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    BypassSpeedChanceModifier.prototype.matchType = function (modifier) {
        return modifier instanceof BypassSpeedChanceModifier;
    };
    BypassSpeedChanceModifier.prototype.clone = function () {
        return new BypassSpeedChanceModifier(this.type, this.pokemonId, this.stackCount);
    };
    BypassSpeedChanceModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Utils.BooleanHolder;
    };
    BypassSpeedChanceModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var bypassSpeed = args[1];
        if (!bypassSpeed.value && pokemon.randSeedInt(10) < this.getStackCount()) {
            bypassSpeed.value = true;
            return true;
        }
        return false;
    };
    BypassSpeedChanceModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 3;
    };
    return BypassSpeedChanceModifier;
}(PokemonHeldItemModifier));
exports.BypassSpeedChanceModifier = BypassSpeedChanceModifier;
var FlinchChanceModifier = /** @class */ (function (_super) {
    __extends(FlinchChanceModifier, _super);
    function FlinchChanceModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    FlinchChanceModifier.prototype.matchType = function (modifier) {
        return modifier instanceof FlinchChanceModifier;
    };
    FlinchChanceModifier.prototype.clone = function () {
        return new FlinchChanceModifier(this.type, this.pokemonId, this.stackCount);
    };
    FlinchChanceModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Utils.BooleanHolder;
    };
    FlinchChanceModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var flinched = args[1];
        if (!flinched.value && pokemon.randSeedInt(10) < this.getStackCount()) {
            flinched.value = true;
            return true;
        }
        return false;
    };
    FlinchChanceModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 3;
    };
    return FlinchChanceModifier;
}(PokemonHeldItemModifier));
exports.FlinchChanceModifier = FlinchChanceModifier;
var TurnHealModifier = /** @class */ (function (_super) {
    __extends(TurnHealModifier, _super);
    function TurnHealModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    TurnHealModifier.prototype.matchType = function (modifier) {
        return modifier instanceof TurnHealModifier;
    };
    TurnHealModifier.prototype.clone = function () {
        return new TurnHealModifier(this.type, this.pokemonId, this.stackCount);
    };
    TurnHealModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        if (pokemon.getHpRatio() < 1) {
            var scene = pokemon.scene;
            scene.unshiftPhase(new phases_1.PokemonHealPhase(scene, pokemon.getBattlerIndex(), Math.max(Math.floor(pokemon.getMaxHp() / 16) * this.stackCount, 1), (0, messages_1.getPokemonMessage)(pokemon, "'s ".concat(this.type.name, "\nrestored its HP a little!")), true));
            return true;
        }
        return false;
    };
    TurnHealModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 4;
    };
    return TurnHealModifier;
}(PokemonHeldItemModifier));
exports.TurnHealModifier = TurnHealModifier;
var HitHealModifier = /** @class */ (function (_super) {
    __extends(HitHealModifier, _super);
    function HitHealModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    HitHealModifier.prototype.matchType = function (modifier) {
        return modifier instanceof HitHealModifier;
    };
    HitHealModifier.prototype.clone = function () {
        return new HitHealModifier(this.type, this.pokemonId, this.stackCount);
    };
    HitHealModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        if (pokemon.turnData.damageDealt && pokemon.getHpRatio() < 1) {
            var scene = pokemon.scene;
            scene.unshiftPhase(new phases_1.PokemonHealPhase(scene, pokemon.getBattlerIndex(), Math.max(Math.floor(pokemon.turnData.damageDealt / 8) * this.stackCount, 1), (0, messages_1.getPokemonMessage)(pokemon, "'s ".concat(this.type.name, "\nrestored its HP a little!")), true));
        }
        return true;
    };
    HitHealModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 4;
    };
    return HitHealModifier;
}(PokemonHeldItemModifier));
exports.HitHealModifier = HitHealModifier;
var LevelIncrementBoosterModifier = /** @class */ (function (_super) {
    __extends(LevelIncrementBoosterModifier, _super);
    function LevelIncrementBoosterModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    LevelIncrementBoosterModifier.prototype.match = function (modifier) {
        return modifier instanceof LevelIncrementBoosterModifier;
    };
    LevelIncrementBoosterModifier.prototype.clone = function () {
        return new LevelIncrementBoosterModifier(this.type, this.stackCount);
    };
    LevelIncrementBoosterModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args[0] instanceof Utils.IntegerHolder;
    };
    LevelIncrementBoosterModifier.prototype.apply = function (args) {
        args[0].value += this.getStackCount();
        return true;
    };
    LevelIncrementBoosterModifier.prototype.getMaxStackCount = function (scene, forThreshold) {
        return 99;
    };
    return LevelIncrementBoosterModifier;
}(PersistentModifier));
exports.LevelIncrementBoosterModifier = LevelIncrementBoosterModifier;
var BerryModifier = /** @class */ (function (_super) {
    __extends(BerryModifier, _super);
    function BerryModifier(type, pokemonId, berryType, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.berryType = berryType;
        _this.consumed = false;
        return _this;
    }
    BerryModifier.prototype.matchType = function (modifier) {
        return modifier instanceof BerryModifier && modifier.berryType === this.berryType;
    };
    BerryModifier.prototype.clone = function () {
        return new BerryModifier(this.type, this.pokemonId, this.berryType, this.stackCount);
    };
    BerryModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.berryType);
    };
    BerryModifier.prototype.shouldApply = function (args) {
        return !this.consumed && _super.prototype.shouldApply.call(this, args) && (0, berry_1.getBerryPredicate)(this.berryType)(args[0]);
    };
    BerryModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var preserve = new Utils.BooleanHolder(false);
        pokemon.scene.applyModifiers(PreserveBerryModifier, pokemon.isPlayer(), pokemon, preserve);
        (0, berry_1.getBerryEffectFunc)(this.berryType)(pokemon);
        if (!preserve.value) {
            this.consumed = true;
        }
        return true;
    };
    BerryModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 10;
    };
    return BerryModifier;
}(PokemonHeldItemModifier));
exports.BerryModifier = BerryModifier;
var PreserveBerryModifier = /** @class */ (function (_super) {
    __extends(PreserveBerryModifier, _super);
    function PreserveBerryModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    PreserveBerryModifier.prototype.match = function (modifier) {
        return modifier instanceof PreserveBerryModifier;
    };
    PreserveBerryModifier.prototype.clone = function () {
        return new PreserveBerryModifier(this.type, this.stackCount);
    };
    PreserveBerryModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args[0] instanceof pokemon_1.default && args[1] instanceof Utils.BooleanHolder;
    };
    PreserveBerryModifier.prototype.apply = function (args) {
        if (!args[1].value) {
            args[1].value = args[0].randSeedInt(this.getMaxStackCount(null)) < this.getStackCount();
        }
        return true;
    };
    PreserveBerryModifier.prototype.getMaxStackCount = function (scene) {
        return 3;
    };
    return PreserveBerryModifier;
}(PersistentModifier));
exports.PreserveBerryModifier = PreserveBerryModifier;
var PokemonInstantReviveModifier = /** @class */ (function (_super) {
    __extends(PokemonInstantReviveModifier, _super);
    function PokemonInstantReviveModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    PokemonInstantReviveModifier.prototype.matchType = function (modifier) {
        return modifier instanceof PokemonInstantReviveModifier;
    };
    PokemonInstantReviveModifier.prototype.clone = function () {
        return new PokemonInstantReviveModifier(this.type, this.pokemonId, this.stackCount);
    };
    PokemonInstantReviveModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        pokemon.scene.unshiftPhase(new phases_1.PokemonHealPhase(pokemon.scene, pokemon.getBattlerIndex(), Math.max(Math.floor(pokemon.getMaxHp() / 2), 1), (0, messages_1.getPokemonMessage)(pokemon, " was revived\nby its ".concat(this.type.name, "!")), false, false, true));
        pokemon.resetStatus();
        return true;
    };
    PokemonInstantReviveModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 1;
    };
    return PokemonInstantReviveModifier;
}(PokemonHeldItemModifier));
exports.PokemonInstantReviveModifier = PokemonInstantReviveModifier;
var ConsumablePokemonModifier = /** @class */ (function (_super) {
    __extends(ConsumablePokemonModifier, _super);
    function ConsumablePokemonModifier(type, pokemonId) {
        var _this = _super.call(this, type) || this;
        _this.pokemonId = pokemonId;
        return _this;
    }
    ConsumablePokemonModifier.prototype.shouldApply = function (args) {
        return args.length && args[0] instanceof pokemon_1.PlayerPokemon && (this.pokemonId === -1 || args[0].id === this.pokemonId);
    };
    ConsumablePokemonModifier.prototype.getPokemon = function (scene) {
        var _this = this;
        return scene.getParty().find(function (p) { return p.id === _this.pokemonId; });
    };
    return ConsumablePokemonModifier;
}(ConsumableModifier));
exports.ConsumablePokemonModifier = ConsumablePokemonModifier;
var PokemonHpRestoreModifier = /** @class */ (function (_super) {
    __extends(PokemonHpRestoreModifier, _super);
    function PokemonHpRestoreModifier(type, pokemonId, restorePoints, restorePercent, healStatus, fainted) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.restorePoints = restorePoints;
        _this.restorePercent = restorePercent;
        _this.healStatus = healStatus;
        _this.fainted = !!fainted;
        return _this;
    }
    PokemonHpRestoreModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && (this.fainted || (args.length > 1 && typeof (args[1]) === "number"));
    };
    PokemonHpRestoreModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        if (!pokemon.hp === this.fainted) {
            var restorePoints = this.restorePoints;
            if (!this.fainted) {
                restorePoints = Math.floor(restorePoints * args[1]);
            }
            if (this.fainted || this.healStatus) {
                pokemon.resetStatus();
            }
            pokemon.hp = Math.min(pokemon.hp + Math.max(Math.ceil(Math.max(Math.floor((this.restorePercent * 0.01) * pokemon.getMaxHp()), restorePoints)), 1), pokemon.getMaxHp());
            return true;
        }
        return false;
    };
    return PokemonHpRestoreModifier;
}(ConsumablePokemonModifier));
exports.PokemonHpRestoreModifier = PokemonHpRestoreModifier;
var PokemonStatusHealModifier = /** @class */ (function (_super) {
    __extends(PokemonStatusHealModifier, _super);
    function PokemonStatusHealModifier(type, pokemonId) {
        return _super.call(this, type, pokemonId) || this;
    }
    PokemonStatusHealModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        pokemon.resetStatus();
        return true;
    };
    return PokemonStatusHealModifier;
}(ConsumablePokemonModifier));
exports.PokemonStatusHealModifier = PokemonStatusHealModifier;
var ConsumablePokemonMoveModifier = /** @class */ (function (_super) {
    __extends(ConsumablePokemonMoveModifier, _super);
    function ConsumablePokemonMoveModifier(type, pokemonId, moveIndex) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.moveIndex = moveIndex;
        return _this;
    }
    return ConsumablePokemonMoveModifier;
}(ConsumablePokemonModifier));
exports.ConsumablePokemonMoveModifier = ConsumablePokemonMoveModifier;
var PokemonPpRestoreModifier = /** @class */ (function (_super) {
    __extends(PokemonPpRestoreModifier, _super);
    function PokemonPpRestoreModifier(type, pokemonId, moveIndex, restorePoints) {
        var _this = _super.call(this, type, pokemonId, moveIndex) || this;
        _this.restorePoints = restorePoints;
        return _this;
    }
    PokemonPpRestoreModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var move = pokemon.getMoveset()[this.moveIndex];
        move.ppUsed = this.restorePoints > -1 ? Math.max(move.ppUsed - this.restorePoints, 0) : 0;
        return true;
    };
    return PokemonPpRestoreModifier;
}(ConsumablePokemonMoveModifier));
exports.PokemonPpRestoreModifier = PokemonPpRestoreModifier;
var PokemonAllMovePpRestoreModifier = /** @class */ (function (_super) {
    __extends(PokemonAllMovePpRestoreModifier, _super);
    function PokemonAllMovePpRestoreModifier(type, pokemonId, restorePoints) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.restorePoints = restorePoints;
        return _this;
    }
    PokemonAllMovePpRestoreModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        for (var _i = 0, _a = pokemon.getMoveset(); _i < _a.length; _i++) {
            var move = _a[_i];
            move.ppUsed = this.restorePoints > -1 ? Math.max(move.ppUsed - this.restorePoints, 0) : 0;
        }
        return true;
    };
    return PokemonAllMovePpRestoreModifier;
}(ConsumablePokemonModifier));
exports.PokemonAllMovePpRestoreModifier = PokemonAllMovePpRestoreModifier;
var PokemonPpUpModifier = /** @class */ (function (_super) {
    __extends(PokemonPpUpModifier, _super);
    function PokemonPpUpModifier(type, pokemonId, moveIndex, upPoints) {
        var _this = _super.call(this, type, pokemonId, moveIndex) || this;
        _this.upPoints = upPoints;
        return _this;
    }
    PokemonPpUpModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var move = pokemon.getMoveset()[this.moveIndex];
        move.ppUp = Math.min(move.ppUp + this.upPoints, 3);
        return true;
    };
    return PokemonPpUpModifier;
}(ConsumablePokemonMoveModifier));
exports.PokemonPpUpModifier = PokemonPpUpModifier;
var PokemonNatureChangeModifier = /** @class */ (function (_super) {
    __extends(PokemonNatureChangeModifier, _super);
    function PokemonNatureChangeModifier(type, pokemonId, nature) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.nature = nature;
        return _this;
    }
    PokemonNatureChangeModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        pokemon.natureOverride = this.nature;
        var speciesId = pokemon.species.speciesId;
        pokemon.scene.gameData.dexData[speciesId].natureAttr |= Math.pow(2, this.nature + 1);
        while (pokemon_evolutions_1.pokemonPrevolutions.hasOwnProperty(speciesId)) {
            speciesId = pokemon_evolutions_1.pokemonPrevolutions[speciesId];
            pokemon.scene.gameData.dexData[speciesId].natureAttr |= Math.pow(2, this.nature + 1);
        }
        return true;
    };
    return PokemonNatureChangeModifier;
}(ConsumablePokemonModifier));
exports.PokemonNatureChangeModifier = PokemonNatureChangeModifier;
var PokemonLevelIncrementModifier = /** @class */ (function (_super) {
    __extends(PokemonLevelIncrementModifier, _super);
    function PokemonLevelIncrementModifier(type, pokemonId) {
        return _super.call(this, type, pokemonId) || this;
    }
    PokemonLevelIncrementModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var levelCount = new Utils.IntegerHolder(1);
        pokemon.scene.applyModifiers(LevelIncrementBoosterModifier, true, levelCount);
        pokemon.level += levelCount.value;
        if (pokemon.level <= pokemon.scene.getMaxExpLevel(true)) {
            pokemon.exp = (0, exp_1.getLevelTotalExp)(pokemon.level, pokemon.species.growthRate);
            pokemon.levelExp = 0;
        }
        pokemon.addFriendship(5);
        pokemon.scene.unshiftPhase(new phases_1.LevelUpPhase(pokemon.scene, pokemon.scene.getParty().indexOf(pokemon), pokemon.level - levelCount.value, pokemon.level));
        return true;
    };
    return PokemonLevelIncrementModifier;
}(ConsumablePokemonModifier));
exports.PokemonLevelIncrementModifier = PokemonLevelIncrementModifier;
var TmModifier = /** @class */ (function (_super) {
    __extends(TmModifier, _super);
    function TmModifier(type, pokemonId) {
        return _super.call(this, type, pokemonId) || this;
    }
    TmModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        pokemon.scene.unshiftPhase(new phases_1.LearnMovePhase(pokemon.scene, pokemon.scene.getParty().indexOf(pokemon), this.type.moveId));
        return true;
    };
    return TmModifier;
}(ConsumablePokemonModifier));
exports.TmModifier = TmModifier;
var RememberMoveModifier = /** @class */ (function (_super) {
    __extends(RememberMoveModifier, _super);
    function RememberMoveModifier(type, pokemonId, levelMoveIndex) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.levelMoveIndex = levelMoveIndex;
        return _this;
    }
    RememberMoveModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        pokemon.scene.unshiftPhase(new phases_1.LearnMovePhase(pokemon.scene, pokemon.scene.getParty().indexOf(pokemon), pokemon.getLearnableLevelMoves()[this.levelMoveIndex]));
        return true;
    };
    return RememberMoveModifier;
}(ConsumablePokemonModifier));
exports.RememberMoveModifier = RememberMoveModifier;
var EvolutionItemModifier = /** @class */ (function (_super) {
    __extends(EvolutionItemModifier, _super);
    function EvolutionItemModifier(type, pokemonId) {
        return _super.call(this, type, pokemonId) || this;
    }
    EvolutionItemModifier.prototype.apply = function (args) {
        var _this = this;
        var pokemon = args[0];
        var matchingEvolution = pokemon_evolutions_1.pokemonEvolutions.hasOwnProperty(pokemon.species.speciesId)
            ? pokemon_evolutions_1.pokemonEvolutions[pokemon.species.speciesId].find(function (e) { return e.item === _this.type.evolutionItem
                && (e.evoFormKey === null || (e.preFormKey || "") === pokemon.getFormKey())
                && (!e.condition || e.condition.predicate(pokemon)); })
            : null;
        if (!matchingEvolution && pokemon.isFusion()) {
            matchingEvolution = pokemon_evolutions_1.pokemonEvolutions[pokemon.fusionSpecies.speciesId].find(function (e) { return e.item === _this.type.evolutionItem
                && (e.evoFormKey === null || (e.preFormKey || "") === pokemon.getFusionFormKey())
                && (!e.condition || e.condition.predicate(pokemon)); });
            if (matchingEvolution) {
                matchingEvolution = new pokemon_evolutions_1.FusionSpeciesFormEvolution(pokemon.species.speciesId, matchingEvolution);
            }
        }
        if (matchingEvolution) {
            pokemon.scene.unshiftPhase(new evolution_phase_1.EvolutionPhase(pokemon.scene, pokemon, matchingEvolution, pokemon.level - 1));
            return true;
        }
        return false;
    };
    return EvolutionItemModifier;
}(ConsumablePokemonModifier));
exports.EvolutionItemModifier = EvolutionItemModifier;
var FusePokemonModifier = /** @class */ (function (_super) {
    __extends(FusePokemonModifier, _super);
    function FusePokemonModifier(type, pokemonId, fusePokemonId) {
        var _this = _super.call(this, type, pokemonId) || this;
        _this.fusePokemonId = fusePokemonId;
        return _this;
    }
    FusePokemonModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args[1] instanceof pokemon_1.PlayerPokemon && this.fusePokemonId === args[1].id;
    };
    FusePokemonModifier.prototype.apply = function (args) {
        return new Promise(function (resolve) {
            args[0].fuse(args[1]).then(function () { return resolve(true); });
        });
    };
    return FusePokemonModifier;
}(ConsumablePokemonModifier));
exports.FusePokemonModifier = FusePokemonModifier;
var MultipleParticipantExpBonusModifier = /** @class */ (function (_super) {
    __extends(MultipleParticipantExpBonusModifier, _super);
    function MultipleParticipantExpBonusModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    MultipleParticipantExpBonusModifier.prototype.match = function (modifier) {
        return modifier instanceof MultipleParticipantExpBonusModifier;
    };
    MultipleParticipantExpBonusModifier.prototype.apply = function (_args) {
        return true;
    };
    MultipleParticipantExpBonusModifier.prototype.clone = function () {
        return new MultipleParticipantExpBonusModifier(this.type, this.stackCount);
    };
    MultipleParticipantExpBonusModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return MultipleParticipantExpBonusModifier;
}(PersistentModifier));
exports.MultipleParticipantExpBonusModifier = MultipleParticipantExpBonusModifier;
var HealingBoosterModifier = /** @class */ (function (_super) {
    __extends(HealingBoosterModifier, _super);
    function HealingBoosterModifier(type, multiplier, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.multiplier = multiplier;
        return _this;
    }
    HealingBoosterModifier.prototype.match = function (modifier) {
        return modifier instanceof HealingBoosterModifier;
    };
    HealingBoosterModifier.prototype.clone = function () {
        return new HealingBoosterModifier(this.type, this.multiplier, this.stackCount);
    };
    HealingBoosterModifier.prototype.getArgs = function () {
        return [this.multiplier];
    };
    HealingBoosterModifier.prototype.apply = function (args) {
        var healingMultiplier = args[0];
        healingMultiplier.value *= 1 + ((this.multiplier - 1) * this.getStackCount());
        return true;
    };
    HealingBoosterModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return HealingBoosterModifier;
}(PersistentModifier));
exports.HealingBoosterModifier = HealingBoosterModifier;
var ExpBoosterModifier = /** @class */ (function (_super) {
    __extends(ExpBoosterModifier, _super);
    function ExpBoosterModifier(type, boostPercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.boostMultiplier = boostPercent * 0.01;
        return _this;
    }
    ExpBoosterModifier.prototype.match = function (modifier) {
        if (modifier instanceof ExpBoosterModifier) {
            var expModifier = modifier;
            return expModifier.boostMultiplier === this.boostMultiplier;
        }
        return false;
    };
    ExpBoosterModifier.prototype.clone = function () {
        return new ExpBoosterModifier(this.type, this.boostMultiplier * 100, this.stackCount);
    };
    ExpBoosterModifier.prototype.getArgs = function () {
        return [this.boostMultiplier * 100];
    };
    ExpBoosterModifier.prototype.apply = function (args) {
        args[0].value = Math.floor(args[0].value * (1 + (this.getStackCount() * this.boostMultiplier)));
        return true;
    };
    ExpBoosterModifier.prototype.getMaxStackCount = function (scene, forThreshold) {
        return this.boostMultiplier < 1 ? this.boostMultiplier < 0.6 ? 99 : 30 : 10;
    };
    return ExpBoosterModifier;
}(PersistentModifier));
exports.ExpBoosterModifier = ExpBoosterModifier;
var PokemonExpBoosterModifier = /** @class */ (function (_super) {
    __extends(PokemonExpBoosterModifier, _super);
    function PokemonExpBoosterModifier(type, pokemonId, boostPercent, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.boostMultiplier = boostPercent * 0.01;
        return _this;
    }
    PokemonExpBoosterModifier.prototype.matchType = function (modifier) {
        if (modifier instanceof PokemonExpBoosterModifier) {
            var pokemonExpModifier = modifier;
            return pokemonExpModifier.boostMultiplier === this.boostMultiplier;
        }
        return false;
    };
    PokemonExpBoosterModifier.prototype.clone = function () {
        return new PokemonExpBoosterModifier(this.type, this.pokemonId, this.boostMultiplier * 100, this.stackCount);
    };
    PokemonExpBoosterModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.boostMultiplier * 100);
    };
    PokemonExpBoosterModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Utils.NumberHolder;
    };
    PokemonExpBoosterModifier.prototype.apply = function (args) {
        args[1].value = Math.floor(args[1].value * (1 + (this.getStackCount() * this.boostMultiplier)));
        return true;
    };
    PokemonExpBoosterModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 99;
    };
    return PokemonExpBoosterModifier;
}(PokemonHeldItemModifier));
exports.PokemonExpBoosterModifier = PokemonExpBoosterModifier;
var ExpShareModifier = /** @class */ (function (_super) {
    __extends(ExpShareModifier, _super);
    function ExpShareModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    ExpShareModifier.prototype.match = function (modifier) {
        return modifier instanceof ExpShareModifier;
    };
    ExpShareModifier.prototype.clone = function () {
        return new ExpShareModifier(this.type, this.stackCount);
    };
    ExpShareModifier.prototype.apply = function (_args) {
        return true;
    };
    ExpShareModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return ExpShareModifier;
}(PersistentModifier));
exports.ExpShareModifier = ExpShareModifier;
var ExpBalanceModifier = /** @class */ (function (_super) {
    __extends(ExpBalanceModifier, _super);
    function ExpBalanceModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    ExpBalanceModifier.prototype.match = function (modifier) {
        return modifier instanceof ExpBalanceModifier;
    };
    ExpBalanceModifier.prototype.clone = function () {
        return new ExpBalanceModifier(this.type, this.stackCount);
    };
    ExpBalanceModifier.prototype.apply = function (_args) {
        return true;
    };
    ExpBalanceModifier.prototype.getMaxStackCount = function (scene) {
        return 4;
    };
    return ExpBalanceModifier;
}(PersistentModifier));
exports.ExpBalanceModifier = ExpBalanceModifier;
var PokemonFriendshipBoosterModifier = /** @class */ (function (_super) {
    __extends(PokemonFriendshipBoosterModifier, _super);
    function PokemonFriendshipBoosterModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    PokemonFriendshipBoosterModifier.prototype.matchType = function (modifier) {
        return modifier instanceof PokemonFriendshipBoosterModifier;
    };
    PokemonFriendshipBoosterModifier.prototype.clone = function () {
        return new PokemonFriendshipBoosterModifier(this.type, this.pokemonId, this.stackCount);
    };
    PokemonFriendshipBoosterModifier.prototype.apply = function (args) {
        var friendship = args[1];
        friendship.value = Math.floor(friendship.value * (1 + 0.5 * this.getStackCount()));
        return true;
    };
    PokemonFriendshipBoosterModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 3;
    };
    return PokemonFriendshipBoosterModifier;
}(PokemonHeldItemModifier));
exports.PokemonFriendshipBoosterModifier = PokemonFriendshipBoosterModifier;
var PokemonNatureWeightModifier = /** @class */ (function (_super) {
    __extends(PokemonNatureWeightModifier, _super);
    function PokemonNatureWeightModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    PokemonNatureWeightModifier.prototype.matchType = function (modifier) {
        return modifier instanceof PokemonNatureWeightModifier;
    };
    PokemonNatureWeightModifier.prototype.clone = function () {
        return new PokemonNatureWeightModifier(this.type, this.pokemonId, this.stackCount);
    };
    PokemonNatureWeightModifier.prototype.apply = function (args) {
        var multiplier = args[1];
        if (multiplier.value !== 1) {
            multiplier.value += 0.1 * this.getStackCount() * (multiplier.value > 1 ? 1 : -1);
            return true;
        }
        return false;
    };
    PokemonNatureWeightModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 10;
    };
    return PokemonNatureWeightModifier;
}(PokemonHeldItemModifier));
exports.PokemonNatureWeightModifier = PokemonNatureWeightModifier;
var PokemonMoveAccuracyBoosterModifier = /** @class */ (function (_super) {
    __extends(PokemonMoveAccuracyBoosterModifier, _super);
    function PokemonMoveAccuracyBoosterModifier(type, pokemonId, accuracy, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.accuracyAmount = accuracy;
        return _this;
    }
    PokemonMoveAccuracyBoosterModifier.prototype.matchType = function (modifier) {
        if (modifier instanceof PokemonMoveAccuracyBoosterModifier) {
            var pokemonAccuracyBoosterModifier = modifier;
            return pokemonAccuracyBoosterModifier.accuracyAmount === this.accuracyAmount;
        }
        return false;
    };
    PokemonMoveAccuracyBoosterModifier.prototype.clone = function () {
        return new PokemonMoveAccuracyBoosterModifier(this.type, this.pokemonId, this.accuracyAmount, this.stackCount);
    };
    PokemonMoveAccuracyBoosterModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.accuracyAmount);
    };
    PokemonMoveAccuracyBoosterModifier.prototype.shouldApply = function (args) {
        return _super.prototype.shouldApply.call(this, args) && args.length === 2 && args[1] instanceof Utils.NumberHolder;
    };
    PokemonMoveAccuracyBoosterModifier.prototype.apply = function (args) {
        var moveAccuracy = args[1];
        moveAccuracy.value = Math.min(moveAccuracy.value + this.accuracyAmount * this.getStackCount(), 100);
        return true;
    };
    PokemonMoveAccuracyBoosterModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 3;
    };
    return PokemonMoveAccuracyBoosterModifier;
}(PokemonHeldItemModifier));
exports.PokemonMoveAccuracyBoosterModifier = PokemonMoveAccuracyBoosterModifier;
var PokemonMultiHitModifier = /** @class */ (function (_super) {
    __extends(PokemonMultiHitModifier, _super);
    function PokemonMultiHitModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    PokemonMultiHitModifier.prototype.matchType = function (modifier) {
        return modifier instanceof PokemonMultiHitModifier;
    };
    PokemonMultiHitModifier.prototype.clone = function () {
        return new PokemonMultiHitModifier(this.type, this.pokemonId, this.stackCount);
    };
    PokemonMultiHitModifier.prototype.apply = function (args) {
        args[1].value *= (this.getStackCount() + 1);
        var power = args[2];
        switch (this.getStackCount()) {
            case 1:
                power.value *= 0.4;
                break;
            case 2:
                power.value *= 0.25;
                break;
            case 3:
                power.value *= 0.175;
                break;
        }
        return true;
    };
    PokemonMultiHitModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 3;
    };
    return PokemonMultiHitModifier;
}(PokemonHeldItemModifier));
exports.PokemonMultiHitModifier = PokemonMultiHitModifier;
var PokemonFormChangeItemModifier = /** @class */ (function (_super) {
    __extends(PokemonFormChangeItemModifier, _super);
    function PokemonFormChangeItemModifier(type, pokemonId, formChangeItem, active, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.formChangeItem = formChangeItem;
        _this.active = active;
        return _this;
    }
    PokemonFormChangeItemModifier.prototype.matchType = function (modifier) {
        return modifier instanceof PokemonFormChangeItemModifier && modifier.formChangeItem === this.formChangeItem;
    };
    PokemonFormChangeItemModifier.prototype.clone = function () {
        return new PokemonFormChangeItemModifier(this.type, this.pokemonId, this.formChangeItem, this.active, this.stackCount);
    };
    PokemonFormChangeItemModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.formChangeItem, this.active);
    };
    PokemonFormChangeItemModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        var active = args[1];
        var switchActive = this.active && !active;
        if (switchActive) {
            this.active = false;
        }
        var ret = pokemon.scene.triggerPokemonFormChange(pokemon, pokemon_forms_1.SpeciesFormChangeItemTrigger);
        if (switchActive) {
            this.active = true;
        }
        return ret;
    };
    PokemonFormChangeItemModifier.prototype.getTransferrable = function (withinParty) {
        return withinParty;
    };
    PokemonFormChangeItemModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 1;
    };
    return PokemonFormChangeItemModifier;
}(PokemonHeldItemModifier));
exports.PokemonFormChangeItemModifier = PokemonFormChangeItemModifier;
var MoneyRewardModifier = /** @class */ (function (_super) {
    __extends(MoneyRewardModifier, _super);
    function MoneyRewardModifier(type, moneyMultiplier) {
        var _this = _super.call(this, type) || this;
        _this.moneyMultiplier = moneyMultiplier;
        return _this;
    }
    MoneyRewardModifier.prototype.apply = function (args) {
        var scene = args[0];
        var moneyAmount = new Utils.IntegerHolder(scene.getWaveMoneyAmount(this.moneyMultiplier));
        scene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);
        scene.addMoney(moneyAmount.value);
        return true;
    };
    return MoneyRewardModifier;
}(ConsumableModifier));
exports.MoneyRewardModifier = MoneyRewardModifier;
var MoneyMultiplierModifier = /** @class */ (function (_super) {
    __extends(MoneyMultiplierModifier, _super);
    function MoneyMultiplierModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    MoneyMultiplierModifier.prototype.match = function (modifier) {
        return modifier instanceof MoneyMultiplierModifier;
    };
    MoneyMultiplierModifier.prototype.clone = function () {
        return new MoneyMultiplierModifier(this.type, this.stackCount);
    };
    MoneyMultiplierModifier.prototype.apply = function (args) {
        args[0].value += Math.floor(args[0].value * 0.2 * this.getStackCount());
        return true;
    };
    MoneyMultiplierModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return MoneyMultiplierModifier;
}(PersistentModifier));
exports.MoneyMultiplierModifier = MoneyMultiplierModifier;
var DamageMoneyRewardModifier = /** @class */ (function (_super) {
    __extends(DamageMoneyRewardModifier, _super);
    function DamageMoneyRewardModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    DamageMoneyRewardModifier.prototype.matchType = function (modifier) {
        return modifier instanceof DamageMoneyRewardModifier;
    };
    DamageMoneyRewardModifier.prototype.clone = function () {
        return new DamageMoneyRewardModifier(this.type, this.pokemonId, this.stackCount);
    };
    DamageMoneyRewardModifier.prototype.apply = function (args) {
        var scene = args[0].scene;
        var moneyAmount = new Utils.IntegerHolder(Math.floor(args[1].value * (0.5 * this.getStackCount())));
        scene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);
        scene.addMoney(moneyAmount.value);
        return true;
    };
    DamageMoneyRewardModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 5;
    };
    return DamageMoneyRewardModifier;
}(PokemonHeldItemModifier));
exports.DamageMoneyRewardModifier = DamageMoneyRewardModifier;
var MoneyInterestModifier = /** @class */ (function (_super) {
    __extends(MoneyInterestModifier, _super);
    function MoneyInterestModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    MoneyInterestModifier.prototype.match = function (modifier) {
        return modifier instanceof MoneyInterestModifier;
    };
    MoneyInterestModifier.prototype.apply = function (args) {
        var scene = args[0];
        var interestAmount = Math.floor(scene.money * 0.1 * this.getStackCount());
        scene.addMoney(interestAmount);
        scene.queueMessage("You received interest of \u20BD".concat(interestAmount.toLocaleString("en-US"), "\nfrom the ").concat(this.type.name, "!"), null, true);
        return true;
    };
    MoneyInterestModifier.prototype.clone = function () {
        return new MoneyInterestModifier(this.type, this.stackCount);
    };
    MoneyInterestModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return MoneyInterestModifier;
}(PersistentModifier));
exports.MoneyInterestModifier = MoneyInterestModifier;
var HiddenAbilityRateBoosterModifier = /** @class */ (function (_super) {
    __extends(HiddenAbilityRateBoosterModifier, _super);
    function HiddenAbilityRateBoosterModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    HiddenAbilityRateBoosterModifier.prototype.match = function (modifier) {
        return modifier instanceof HiddenAbilityRateBoosterModifier;
    };
    HiddenAbilityRateBoosterModifier.prototype.clone = function () {
        return new HiddenAbilityRateBoosterModifier(this.type, this.stackCount);
    };
    HiddenAbilityRateBoosterModifier.prototype.apply = function (args) {
        args[0].value *= Math.pow(2, -1 - this.getStackCount());
        return true;
    };
    HiddenAbilityRateBoosterModifier.prototype.getMaxStackCount = function (scene) {
        return 4;
    };
    return HiddenAbilityRateBoosterModifier;
}(PersistentModifier));
exports.HiddenAbilityRateBoosterModifier = HiddenAbilityRateBoosterModifier;
var ShinyRateBoosterModifier = /** @class */ (function (_super) {
    __extends(ShinyRateBoosterModifier, _super);
    function ShinyRateBoosterModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    ShinyRateBoosterModifier.prototype.match = function (modifier) {
        return modifier instanceof ShinyRateBoosterModifier;
    };
    ShinyRateBoosterModifier.prototype.clone = function () {
        return new ShinyRateBoosterModifier(this.type, this.stackCount);
    };
    ShinyRateBoosterModifier.prototype.apply = function (args) {
        args[0].value *= Math.pow(2, 2 + this.getStackCount());
        return true;
    };
    ShinyRateBoosterModifier.prototype.getMaxStackCount = function (scene) {
        return 4;
    };
    return ShinyRateBoosterModifier;
}(PersistentModifier));
exports.ShinyRateBoosterModifier = ShinyRateBoosterModifier;
var LockModifierTiersModifier = /** @class */ (function (_super) {
    __extends(LockModifierTiersModifier, _super);
    function LockModifierTiersModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    LockModifierTiersModifier.prototype.match = function (modifier) {
        return modifier instanceof LockModifierTiersModifier;
    };
    LockModifierTiersModifier.prototype.apply = function (args) {
        return true;
    };
    LockModifierTiersModifier.prototype.clone = function () {
        return new LockModifierTiersModifier(this.type, this.stackCount);
    };
    LockModifierTiersModifier.prototype.getMaxStackCount = function (scene) {
        return 1;
    };
    return LockModifierTiersModifier;
}(PersistentModifier));
exports.LockModifierTiersModifier = LockModifierTiersModifier;
var SwitchEffectTransferModifier = /** @class */ (function (_super) {
    __extends(SwitchEffectTransferModifier, _super);
    function SwitchEffectTransferModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    SwitchEffectTransferModifier.prototype.matchType = function (modifier) {
        return modifier instanceof SwitchEffectTransferModifier;
    };
    SwitchEffectTransferModifier.prototype.clone = function () {
        return new SwitchEffectTransferModifier(this.type, this.pokemonId, this.stackCount);
    };
    SwitchEffectTransferModifier.prototype.apply = function (args) {
        return true;
    };
    SwitchEffectTransferModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 1;
    };
    return SwitchEffectTransferModifier;
}(PokemonHeldItemModifier));
exports.SwitchEffectTransferModifier = SwitchEffectTransferModifier;
var HeldItemTransferModifier = /** @class */ (function (_super) {
    __extends(HeldItemTransferModifier, _super);
    function HeldItemTransferModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    HeldItemTransferModifier.prototype.apply = function (args) {
        var _this = this;
        var pokemon = args[0];
        var opponents = pokemon.getOpponents();
        if (!opponents.length) {
            return false;
        }
        var targetPokemon = opponents[pokemon.randSeedInt(opponents.length)];
        var transferredItemCount = this.getTransferredItemCount();
        if (!transferredItemCount) {
            return false;
        }
        var withinParty = pokemon.isPlayer() === targetPokemon.isPlayer();
        var poolType = pokemon.isPlayer() ? ModifierTypes.ModifierPoolType.PLAYER : pokemon.hasTrainer() ? ModifierTypes.ModifierPoolType.TRAINER : ModifierTypes.ModifierPoolType.WILD;
        var transferredModifierTypes = [];
        var itemModifiers = pokemon.scene.findModifiers(function (m) { return m instanceof PokemonHeldItemModifier
            && m.pokemonId === targetPokemon.id && m.getTransferrable(withinParty); }, targetPokemon.isPlayer());
        var highestItemTier = itemModifiers.map(function (m) { return m.type.getOrInferTier(poolType); }).reduce(function (highestTier, tier) { return Math.max(tier, highestTier); }, 0);
        var tierItemModifiers = itemModifiers.filter(function (m) { return m.type.getOrInferTier(poolType) === highestItemTier; });
        var heldItemTransferPromises = [];
        var _loop_1 = function (i) {
            if (!tierItemModifiers.length) {
                while (highestItemTier-- && !tierItemModifiers.length) {
                    tierItemModifiers = itemModifiers.filter(function (m) { return m.type.tier === highestItemTier; });
                }
                if (!tierItemModifiers.length) {
                    return "break";
                }
            }
            var randItemIndex = pokemon.randSeedInt(itemModifiers.length);
            var randItem = itemModifiers[randItemIndex];
            heldItemTransferPromises.push(pokemon.scene.tryTransferHeldItemModifier(randItem, pokemon, false, false).then(function (success) {
                if (success) {
                    transferredModifierTypes.push(randItem.type);
                    itemModifiers.splice(randItemIndex, 1);
                }
            }));
        };
        for (var i = 0; i < transferredItemCount; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        Promise.all(heldItemTransferPromises).then(function () {
            for (var _i = 0, transferredModifierTypes_1 = transferredModifierTypes; _i < transferredModifierTypes_1.length; _i++) {
                var mt = transferredModifierTypes_1[_i];
                pokemon.scene.queueMessage(_this.getTransferMessage(pokemon, targetPokemon, mt));
            }
        });
        return !!transferredModifierTypes.length;
    };
    return HeldItemTransferModifier;
}(PokemonHeldItemModifier));
exports.HeldItemTransferModifier = HeldItemTransferModifier;
var TurnHeldItemTransferModifier = /** @class */ (function (_super) {
    __extends(TurnHeldItemTransferModifier, _super);
    function TurnHeldItemTransferModifier(type, pokemonId, stackCount) {
        return _super.call(this, type, pokemonId, stackCount) || this;
    }
    TurnHeldItemTransferModifier.prototype.matchType = function (modifier) {
        return modifier instanceof TurnHeldItemTransferModifier;
    };
    TurnHeldItemTransferModifier.prototype.clone = function () {
        return new TurnHeldItemTransferModifier(this.type, this.pokemonId, this.stackCount);
    };
    TurnHeldItemTransferModifier.prototype.getTransferrable = function (withinParty) {
        return withinParty;
    };
    TurnHeldItemTransferModifier.prototype.getTransferredItemCount = function () {
        return this.getStackCount();
    };
    TurnHeldItemTransferModifier.prototype.getTransferMessage = function (pokemon, targetPokemon, item) {
        return (0, messages_1.getPokemonMessage)(targetPokemon, "'s ".concat(item.name, " was absorbed\nby ").concat(pokemon.name, "'s ").concat(this.type.name, "!"));
    };
    TurnHeldItemTransferModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 1;
    };
    return TurnHeldItemTransferModifier;
}(HeldItemTransferModifier));
exports.TurnHeldItemTransferModifier = TurnHeldItemTransferModifier;
var ContactHeldItemTransferChanceModifier = /** @class */ (function (_super) {
    __extends(ContactHeldItemTransferChanceModifier, _super);
    function ContactHeldItemTransferChanceModifier(type, pokemonId, chancePercent, stackCount) {
        var _this = _super.call(this, type, pokemonId, stackCount) || this;
        _this.chance = chancePercent / 100;
        return _this;
    }
    ContactHeldItemTransferChanceModifier.prototype.matchType = function (modifier) {
        return modifier instanceof ContactHeldItemTransferChanceModifier;
    };
    ContactHeldItemTransferChanceModifier.prototype.clone = function () {
        return new ContactHeldItemTransferChanceModifier(this.type, this.pokemonId, this.chance * 100, this.stackCount);
    };
    ContactHeldItemTransferChanceModifier.prototype.getArgs = function () {
        return _super.prototype.getArgs.call(this).concat(this.chance * 100);
    };
    ContactHeldItemTransferChanceModifier.prototype.getTransferredItemCount = function () {
        return Phaser.Math.RND.realInRange(0, 1) < (this.chance * this.getStackCount()) ? 1 : 0;
    };
    ContactHeldItemTransferChanceModifier.prototype.getTransferMessage = function (pokemon, targetPokemon, item) {
        return (0, messages_1.getPokemonMessage)(targetPokemon, "'s ".concat(item.name, " was snatched\nby ").concat(pokemon.name, "'s ").concat(this.type.name, "!"));
    };
    ContactHeldItemTransferChanceModifier.prototype.getMaxHeldItemCount = function (pokemon) {
        return 5;
    };
    return ContactHeldItemTransferChanceModifier;
}(HeldItemTransferModifier));
exports.ContactHeldItemTransferChanceModifier = ContactHeldItemTransferChanceModifier;
var IvScannerModifier = /** @class */ (function (_super) {
    __extends(IvScannerModifier, _super);
    function IvScannerModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    IvScannerModifier.prototype.match = function (modifier) {
        return modifier instanceof IvScannerModifier;
    };
    IvScannerModifier.prototype.clone = function () {
        return new IvScannerModifier(this.type, this.stackCount);
    };
    IvScannerModifier.prototype.apply = function (args) {
        return true;
    };
    IvScannerModifier.prototype.getMaxStackCount = function (scene) {
        return 3;
    };
    return IvScannerModifier;
}(PersistentModifier));
exports.IvScannerModifier = IvScannerModifier;
var ExtraModifierModifier = /** @class */ (function (_super) {
    __extends(ExtraModifierModifier, _super);
    function ExtraModifierModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    ExtraModifierModifier.prototype.match = function (modifier) {
        return modifier instanceof ExtraModifierModifier;
    };
    ExtraModifierModifier.prototype.clone = function () {
        return new ExtraModifierModifier(this.type, this.stackCount);
    };
    ExtraModifierModifier.prototype.apply = function (args) {
        args[0].value += this.getStackCount();
        return true;
    };
    ExtraModifierModifier.prototype.getMaxStackCount = function (scene) {
        return 3;
    };
    return ExtraModifierModifier;
}(PersistentModifier));
exports.ExtraModifierModifier = ExtraModifierModifier;
var EnemyPersistentModifier = /** @class */ (function (_super) {
    __extends(EnemyPersistentModifier, _super);
    function EnemyPersistentModifier(type, stackCount) {
        return _super.call(this, type, stackCount) || this;
    }
    EnemyPersistentModifier.prototype.getMaxStackCount = function (scene) {
        return 5;
    };
    return EnemyPersistentModifier;
}(PersistentModifier));
exports.EnemyPersistentModifier = EnemyPersistentModifier;
var EnemyDamageMultiplierModifier = /** @class */ (function (_super) {
    __extends(EnemyDamageMultiplierModifier, _super);
    function EnemyDamageMultiplierModifier(type, damageMultiplier, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.damageMultiplier = damageMultiplier;
        return _this;
    }
    EnemyDamageMultiplierModifier.prototype.apply = function (args) {
        args[0].value = Math.floor(args[0].value * Math.pow(this.damageMultiplier, this.getStackCount()));
        return true;
    };
    EnemyDamageMultiplierModifier.prototype.getMaxStackCount = function (scene) {
        return 99;
    };
    return EnemyDamageMultiplierModifier;
}(EnemyPersistentModifier));
var EnemyDamageBoosterModifier = /** @class */ (function (_super) {
    __extends(EnemyDamageBoosterModifier, _super);
    function EnemyDamageBoosterModifier(type, boostPercent, stackCount) {
        //super(type, 1 + ((boostPercent || 10) * 0.01), stackCount);
        return _super.call(this, type, 1.05, stackCount) || this; // Hardcode multiplier temporarily
    }
    EnemyDamageBoosterModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyDamageBoosterModifier;
    };
    EnemyDamageBoosterModifier.prototype.clone = function () {
        return new EnemyDamageBoosterModifier(this.type, (this.damageMultiplier - 1) * 100, this.stackCount);
    };
    EnemyDamageBoosterModifier.prototype.getArgs = function () {
        return [(this.damageMultiplier - 1) * 100];
    };
    EnemyDamageBoosterModifier.prototype.getMaxStackCount = function (scene) {
        return 999;
    };
    return EnemyDamageBoosterModifier;
}(EnemyDamageMultiplierModifier));
exports.EnemyDamageBoosterModifier = EnemyDamageBoosterModifier;
var EnemyDamageReducerModifier = /** @class */ (function (_super) {
    __extends(EnemyDamageReducerModifier, _super);
    function EnemyDamageReducerModifier(type, reductionPercent, stackCount) {
        //super(type, 1 - ((reductionPercent || 5) * 0.01), stackCount);
        return _super.call(this, type, 0.975, stackCount) || this; // Hardcode multiplier temporarily
    }
    EnemyDamageReducerModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyDamageReducerModifier;
    };
    EnemyDamageReducerModifier.prototype.clone = function () {
        return new EnemyDamageReducerModifier(this.type, (1 - this.damageMultiplier) * 100, this.stackCount);
    };
    EnemyDamageReducerModifier.prototype.getArgs = function () {
        return [(1 - this.damageMultiplier) * 100];
    };
    EnemyDamageReducerModifier.prototype.getMaxStackCount = function (scene) {
        return scene.currentBattle.waveIndex < 2000 ? _super.prototype.getMaxStackCount.call(this, scene) : 999;
    };
    return EnemyDamageReducerModifier;
}(EnemyDamageMultiplierModifier));
exports.EnemyDamageReducerModifier = EnemyDamageReducerModifier;
var EnemyTurnHealModifier = /** @class */ (function (_super) {
    __extends(EnemyTurnHealModifier, _super);
    function EnemyTurnHealModifier(type, healPercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        // Hardcode temporarily
        _this.healPercent = 2;
        return _this;
    }
    EnemyTurnHealModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyTurnHealModifier;
    };
    EnemyTurnHealModifier.prototype.clone = function () {
        return new EnemyTurnHealModifier(this.type, this.healPercent, this.stackCount);
    };
    EnemyTurnHealModifier.prototype.getArgs = function () {
        return [this.healPercent];
    };
    EnemyTurnHealModifier.prototype.apply = function (args) {
        var pokemon = args[0];
        if (pokemon.getHpRatio() < 1) {
            var scene = pokemon.scene;
            scene.unshiftPhase(new phases_1.PokemonHealPhase(scene, pokemon.getBattlerIndex(), Math.max(Math.floor(pokemon.getMaxHp() / (100 / this.healPercent)) * this.stackCount, 1), (0, messages_1.getPokemonMessage)(pokemon, "\nrestored some HP!"), true, false, false, false, true));
            return true;
        }
        return false;
    };
    EnemyTurnHealModifier.prototype.getMaxStackCount = function (scene) {
        return 15;
    };
    return EnemyTurnHealModifier;
}(EnemyPersistentModifier));
exports.EnemyTurnHealModifier = EnemyTurnHealModifier;
var EnemyAttackStatusEffectChanceModifier = /** @class */ (function (_super) {
    __extends(EnemyAttackStatusEffectChanceModifier, _super);
    function EnemyAttackStatusEffectChanceModifier(type, effect, chancePercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.effect = effect;
        _this.chance = (chancePercent || 10) / 100;
        return _this;
    }
    EnemyAttackStatusEffectChanceModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyAttackStatusEffectChanceModifier && modifier.effect === this.effect && modifier.chance === this.chance;
    };
    EnemyAttackStatusEffectChanceModifier.prototype.clone = function () {
        return new EnemyAttackStatusEffectChanceModifier(this.type, this.effect, this.chance * 100, this.stackCount);
    };
    EnemyAttackStatusEffectChanceModifier.prototype.getArgs = function () {
        return [this.effect, this.chance * 100];
    };
    EnemyAttackStatusEffectChanceModifier.prototype.apply = function (args) {
        var target = args[0];
        if (Phaser.Math.RND.realInRange(0, 1) < (this.chance * this.getStackCount())) {
            return target.trySetStatus(this.effect, true);
        }
        return false;
    };
    return EnemyAttackStatusEffectChanceModifier;
}(EnemyPersistentModifier));
exports.EnemyAttackStatusEffectChanceModifier = EnemyAttackStatusEffectChanceModifier;
var EnemyStatusEffectHealChanceModifier = /** @class */ (function (_super) {
    __extends(EnemyStatusEffectHealChanceModifier, _super);
    function EnemyStatusEffectHealChanceModifier(type, chancePercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.chance = (chancePercent || 10) / 100;
        return _this;
    }
    EnemyStatusEffectHealChanceModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyStatusEffectHealChanceModifier && modifier.chance === this.chance;
    };
    EnemyStatusEffectHealChanceModifier.prototype.clone = function () {
        return new EnemyStatusEffectHealChanceModifier(this.type, this.chance * 100, this.stackCount);
    };
    EnemyStatusEffectHealChanceModifier.prototype.getArgs = function () {
        return [this.chance * 100];
    };
    EnemyStatusEffectHealChanceModifier.prototype.apply = function (args) {
        var target = args[0];
        if (target.status && Phaser.Math.RND.realInRange(0, 1) < (this.chance * this.getStackCount())) {
            target.scene.queueMessage((0, messages_1.getPokemonMessage)(target, (0, status_effect_1.getStatusEffectHealText)(target.status.effect)));
            target.resetStatus();
            target.updateInfo();
            return true;
        }
        return false;
    };
    return EnemyStatusEffectHealChanceModifier;
}(EnemyPersistentModifier));
exports.EnemyStatusEffectHealChanceModifier = EnemyStatusEffectHealChanceModifier;
var EnemyEndureChanceModifier = /** @class */ (function (_super) {
    __extends(EnemyEndureChanceModifier, _super);
    function EnemyEndureChanceModifier(type, chancePercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.chance = (chancePercent || 2.5) / 100;
        return _this;
    }
    EnemyEndureChanceModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyEndureChanceModifier && modifier.chance === this.chance;
    };
    EnemyEndureChanceModifier.prototype.clone = function () {
        return new EnemyEndureChanceModifier(this.type, this.chance * 100, this.stackCount);
    };
    EnemyEndureChanceModifier.prototype.getArgs = function () {
        return [this.chance * 100];
    };
    EnemyEndureChanceModifier.prototype.apply = function (args) {
        var target = args[0];
        if (target.battleData.endured || Phaser.Math.RND.realInRange(0, 1) >= (this.chance * this.getStackCount())) {
            return false;
        }
        target.addTag(battler_tag_type_1.BattlerTagType.ENDURING, 1);
        target.battleData.endured = true;
        return true;
    };
    EnemyEndureChanceModifier.prototype.getMaxStackCount = function (scene) {
        return 10;
    };
    return EnemyEndureChanceModifier;
}(EnemyPersistentModifier));
exports.EnemyEndureChanceModifier = EnemyEndureChanceModifier;
var EnemyFusionChanceModifier = /** @class */ (function (_super) {
    __extends(EnemyFusionChanceModifier, _super);
    function EnemyFusionChanceModifier(type, chancePercent, stackCount) {
        var _this = _super.call(this, type, stackCount) || this;
        _this.chance = chancePercent / 100;
        return _this;
    }
    EnemyFusionChanceModifier.prototype.match = function (modifier) {
        return modifier instanceof EnemyFusionChanceModifier && modifier.chance === this.chance;
    };
    EnemyFusionChanceModifier.prototype.clone = function () {
        return new EnemyFusionChanceModifier(this.type, this.chance * 100, this.stackCount);
    };
    EnemyFusionChanceModifier.prototype.getArgs = function () {
        return [this.chance * 100];
    };
    EnemyFusionChanceModifier.prototype.apply = function (args) {
        if (Phaser.Math.RND.realInRange(0, 1) >= (this.chance * this.getStackCount())) {
            return false;
        }
        args[0].value = true;
        return true;
    };
    EnemyFusionChanceModifier.prototype.getMaxStackCount = function (scene) {
        return 10;
    };
    return EnemyFusionChanceModifier;
}(EnemyPersistentModifier));
exports.EnemyFusionChanceModifier = EnemyFusionChanceModifier;
/**
 * Uses override from overrides.ts to set PersistentModifiers for starting a new game
 * @param scene current BattleScene
 * @param player is this for player for enemy
 */
function overrideModifiers(scene, player) {
    if (player === void 0) { player = true; }
    var modifierOverride = player ? Overrides.STARTING_MODIFIER_OVERRIDE : Overrides.OPP_MODIFIER_OVERRIDE;
    if (!modifierOverride || modifierOverride.length === 0 || !scene) {
        return;
    } // if no override, do nothing
    // if it's the opponent, we clear all his current modifiers to avoid stacking
    if (!player) {
        scene.clearEnemyModifiers();
    }
    // we loop through all the modifier name given in the override file
    modifierOverride.forEach(function (item) {
        var modifierName = item.name;
        var qty = item.count || 1;
        if (!modifier_type_1.modifierTypes.hasOwnProperty(modifierName)) {
            return;
        } // if the modifier does not exist, we skip it
        var modifierType = modifier_type_1.modifierTypes[modifierName]();
        var modifier = modifierType.withIdFromFunc(modifier_type_1.modifierTypes[modifierName]).newModifier();
        modifier.stackCount = qty;
        if (player) {
            scene.addModifier(modifier, true, false, false, true);
        }
        else {
            scene.addEnemyModifier(modifier, true, true);
        }
    });
}
exports.overrideModifiers = overrideModifiers;
/**
 * Uses override from overrides.ts to set PokemonHeldItemModifiers for starting a new game
 * @param scene current BattleScene
 * @param player is this for player for enemy
 */
function overrideHeldItems(scene, pokemon, player) {
    if (player === void 0) { player = true; }
    var heldItemsOverride = player ? Overrides.STARTING_HELD_ITEMS_OVERRIDE : Overrides.OPP_HELD_ITEMS_OVERRIDE;
    if (!heldItemsOverride || heldItemsOverride.length === 0 || !scene) {
        return;
    } // if no override, do nothing
    // we loop through all the itemName given in the override file
    heldItemsOverride.forEach(function (item) {
        var itemName = item.name;
        var qty = item.count || 1;
        if (!modifier_type_1.modifierTypes.hasOwnProperty(itemName)) {
            return;
        } // if the item does not exist, we skip it
        var modifierType = modifier_type_1.modifierTypes[itemName](); // we retrieve the item in the list
        var itemModifier;
        if (modifierType instanceof ModifierTypes.ModifierTypeGenerator) {
            itemModifier = modifierType.generateType(null, [item.type]).withIdFromFunc(modifier_type_1.modifierTypes[itemName]).newModifier(pokemon);
        }
        else {
            itemModifier = modifierType.withIdFromFunc(modifier_type_1.modifierTypes[itemName]).newModifier(pokemon);
        }
        // we create the item
        itemModifier.pokemonId = pokemon.id; // we assign the created item to the pokemon
        itemModifier.stackCount = qty; // we say how many items we want
        if (player) {
            scene.addModifier(itemModifier, true, false, false, true);
        }
        else {
            scene.addEnemyModifier(itemModifier, true, true);
        }
    });
}
exports.overrideHeldItems = overrideHeldItems;
