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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLuckString = exports.getPartyLuckValue = exports.ModifierTypeOption = exports.getDefaultModifierTypeForTier = exports.getDailyRunStarterModifiers = exports.getEnemyModifierTypesForWave = exports.getEnemyBuffModifierForWave = exports.getPlayerShopModifierTypeOptionsForWave = exports.getPlayerModifierTypeOptions = exports.getModifierTypeFuncById = exports.regenerateModifierPoolThresholds = exports.getModifierPoolForType = exports.getModifierType = exports.modifierTypes = exports.EnemyEndureChanceModifierType = exports.EnemyAttackStatusEffectChanceModifierType = exports.TurnHeldItemTransferModifierType = exports.ContactHeldItemTransferChanceModifierType = exports.TerastallizeModifierType = exports.FusePokemonModifierType = exports.FormChangeItemModifierType = exports.EvolutionItemModifierType = exports.TmModifierType = exports.PokemonMultiHitModifierType = exports.PokemonMoveAccuracyBoosterModifierType = exports.PokemonFriendshipBoosterModifierType = exports.PokemonExpBoosterModifierType = exports.ExpBoosterModifierType = exports.MoneyRewardModifierType = exports.PokemonBaseStatBoosterModifierType = exports.AllPokemonLevelIncrementModifierType = exports.PokemonLevelIncrementModifierType = exports.AttackTypeBoosterModifierType = exports.BerryModifierType = exports.TempBattleStatBoosterModifierType = exports.DoubleBattleChanceBoosterModifierType = exports.RememberMoveModifierType = exports.PokemonNatureChangeModifierType = exports.PokemonPpUpModifierType = exports.PokemonAllMovePpRestoreModifierType = exports.PokemonPpRestoreModifierType = exports.PokemonMoveModifierType = exports.PokemonStatusHealModifierType = exports.PokemonReviveModifierType = exports.PokemonHpRestoreModifierType = exports.PokemonHeldItemModifierType = exports.PokemonModifierType = exports.ModifierTypeGenerator = exports.ModifierType = exports.ModifierPoolType = void 0;
exports.getLuckTextTint = void 0;
var Modifiers = require("./modifier");
var move_1 = require("../data/move");
var pokeball_1 = require("../data/pokeball");
var pokemon_evolutions_1 = require("../data/pokemon-evolutions");
var pokemon_stat_1 = require("../data/pokemon-stat");
var tms_1 = require("../data/tms");
var type_1 = require("../data/type");
var party_ui_handler_1 = require("../ui/party-ui-handler");
var Utils = require("../utils");
var temp_battle_stat_1 = require("../data/temp-battle-stat");
var berry_1 = require("../data/berry");
var unlockables_1 = require("../system/unlockables");
var status_effect_1 = require("../data/status-effect");
var pokemon_species_1 = require("../data/pokemon-species");
var voucher_1 = require("../system/voucher");
var pokemon_forms_1 = require("../data/pokemon-forms");
var modifier_tier_1 = require("./modifier-tier");
var nature_1 = require("#app/data/nature");
var i18n_1 = require("#app/plugins/i18n");
var text_1 = require("#app/ui/text");
var outputModifierData = false;
var useMaxWeightForOutput = false;
var ModifierPoolType;
(function (ModifierPoolType) {
    ModifierPoolType[ModifierPoolType["PLAYER"] = 0] = "PLAYER";
    ModifierPoolType[ModifierPoolType["WILD"] = 1] = "WILD";
    ModifierPoolType[ModifierPoolType["TRAINER"] = 2] = "TRAINER";
    ModifierPoolType[ModifierPoolType["ENEMY_BUFF"] = 3] = "ENEMY_BUFF";
    ModifierPoolType[ModifierPoolType["DAILY_STARTER"] = 4] = "DAILY_STARTER";
})(ModifierPoolType || (exports.ModifierPoolType = ModifierPoolType = {}));
var ModifierType = /** @class */ (function () {
    function ModifierType(localeKey, iconImage, newModifierFunc, group, soundName) {
        this.localeKey = localeKey;
        this.iconImage = iconImage;
        this.group = group || "";
        this.soundName = soundName || "restore";
        this.newModifierFunc = newModifierFunc;
    }
    Object.defineProperty(ModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("".concat(this.localeKey, ".name"));
        },
        enumerable: false,
        configurable: true
    });
    ModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("".concat(this.localeKey, ".description"));
    };
    ModifierType.prototype.setTier = function (tier) {
        this.tier = tier;
    };
    ModifierType.prototype.getOrInferTier = function (poolType) {
        var _this = this;
        if (poolType === void 0) { poolType = ModifierPoolType.PLAYER; }
        if (this.tier) {
            return this.tier;
        }
        if (!this.id) {
            return null;
        }
        var poolTypes;
        switch (poolType) {
            case ModifierPoolType.PLAYER:
                poolTypes = [poolType, ModifierPoolType.TRAINER, ModifierPoolType.WILD];
                break;
            case ModifierPoolType.WILD:
                poolTypes = [poolType, ModifierPoolType.PLAYER, ModifierPoolType.TRAINER];
                break;
            case ModifierPoolType.TRAINER:
                poolTypes = [poolType, ModifierPoolType.PLAYER, ModifierPoolType.WILD];
                break;
            default:
                poolTypes = [poolType];
                break;
        }
        // Try multiple pool types in case of stolen items
        for (var _i = 0, poolTypes_1 = poolTypes; _i < poolTypes_1.length; _i++) {
            var type = poolTypes_1[_i];
            var pool = getModifierPoolForType(type);
            for (var _a = 0, _b = Utils.getEnumValues(modifier_tier_1.ModifierTier); _a < _b.length; _a++) {
                var tier = _b[_a];
                if (!pool.hasOwnProperty(tier)) {
                    continue;
                }
                if (pool[tier].find(function (m) { return m.modifierType.id === (_this.generatorId || _this.id); })) {
                    return (this.tier = tier);
                }
            }
        }
        return null;
    };
    ModifierType.prototype.withIdFromFunc = function (func) {
        this.id = Object.keys(exports.modifierTypes).find(function (k) { return exports.modifierTypes[k] === func; });
        return this;
    };
    ModifierType.prototype.newModifier = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.newModifierFunc(this, args);
    };
    return ModifierType;
}());
exports.ModifierType = ModifierType;
var ModifierTypeGenerator = /** @class */ (function (_super) {
    __extends(ModifierTypeGenerator, _super);
    function ModifierTypeGenerator(genTypeFunc) {
        var _this = _super.call(this, null, null, null) || this;
        _this.genTypeFunc = genTypeFunc;
        return _this;
    }
    ModifierTypeGenerator.prototype.generateType = function (party, pregenArgs) {
        var ret = this.genTypeFunc(party, pregenArgs);
        if (ret) {
            ret.generatorId = ret.id;
            ret.id = this.id;
            ret.setTier(this.tier);
        }
        return ret;
    };
    return ModifierTypeGenerator;
}(ModifierType));
exports.ModifierTypeGenerator = ModifierTypeGenerator;
var AddPokeballModifierType = /** @class */ (function (_super) {
    __extends(AddPokeballModifierType, _super);
    function AddPokeballModifierType(iconImage, pokeballType, count) {
        var _this = _super.call(this, "", iconImage, function (_type, _args) { return new Modifiers.AddPokeballModifier(_this, pokeballType, count); }, "pb", "pb_bounce_1") || this;
        _this.pokeballType = pokeballType;
        _this.count = count;
        return _this;
    }
    Object.defineProperty(AddPokeballModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:ModifierType.AddPokeballModifierType.name", {
                "modifierCount": this.count,
                "pokeballName": (0, pokeball_1.getPokeballName)(this.pokeballType),
            });
        },
        enumerable: false,
        configurable: true
    });
    AddPokeballModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.AddPokeballModifierType.description", {
            "modifierCount": this.count,
            "pokeballName": (0, pokeball_1.getPokeballName)(this.pokeballType),
            "catchRate": (0, pokeball_1.getPokeballCatchMultiplier)(this.pokeballType) > -1 ? "".concat((0, pokeball_1.getPokeballCatchMultiplier)(this.pokeballType), "x") : "100%",
            "pokeballAmount": "".concat(scene.pokeballCounts[this.pokeballType]),
        });
    };
    return AddPokeballModifierType;
}(ModifierType));
var AddVoucherModifierType = /** @class */ (function (_super) {
    __extends(AddVoucherModifierType, _super);
    function AddVoucherModifierType(voucherType, count) {
        var _this = _super.call(this, "", (0, voucher_1.getVoucherTypeIcon)(voucherType), function (_type, _args) { return new Modifiers.AddVoucherModifier(_this, voucherType, count); }, "voucher") || this;
        _this.count = count;
        _this.voucherType = voucherType;
        return _this;
    }
    Object.defineProperty(AddVoucherModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:ModifierType.AddVoucherModifierType.name", {
                "modifierCount": this.count,
                "voucherTypeName": (0, voucher_1.getVoucherTypeName)(this.voucherType),
            });
        },
        enumerable: false,
        configurable: true
    });
    AddVoucherModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.AddVoucherModifierType.description", {
            "modifierCount": this.count,
            "voucherTypeName": (0, voucher_1.getVoucherTypeName)(this.voucherType),
        });
    };
    return AddVoucherModifierType;
}(ModifierType));
var PokemonModifierType = /** @class */ (function (_super) {
    __extends(PokemonModifierType, _super);
    function PokemonModifierType(localeKey, iconImage, newModifierFunc, selectFilter, group, soundName) {
        var _this = _super.call(this, localeKey, iconImage, newModifierFunc, group, soundName) || this;
        _this.selectFilter = selectFilter;
        return _this;
    }
    return PokemonModifierType;
}(ModifierType));
exports.PokemonModifierType = PokemonModifierType;
var PokemonHeldItemModifierType = /** @class */ (function (_super) {
    __extends(PokemonHeldItemModifierType, _super);
    function PokemonHeldItemModifierType(localeKey, iconImage, newModifierFunc, group, soundName) {
        var _this = _super.call(this, localeKey, iconImage, newModifierFunc, function (pokemon) {
            var dummyModifier = _this.newModifier(pokemon);
            var matchingModifier = pokemon.scene.findModifier(function (m) { return m instanceof Modifiers.PokemonHeldItemModifier && m.pokemonId === pokemon.id && m.matchType(dummyModifier); });
            var maxStackCount = dummyModifier.getMaxStackCount(pokemon.scene);
            if (!maxStackCount) {
                return i18n_1.default.t("modifierType:ModifierType.PokemonHeldItemModifierType.extra.inoperable", { "pokemonName": pokemon.name });
            }
            if (matchingModifier && matchingModifier.stackCount === maxStackCount) {
                return i18n_1.default.t("modifierType:ModifierType.PokemonHeldItemModifierType.extra.tooMany", { "pokemonName": pokemon.name });
            }
            return null;
        }, group, soundName) || this;
        return _this;
    }
    PokemonHeldItemModifierType.prototype.newModifier = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.prototype.newModifier.apply(this, args);
    };
    return PokemonHeldItemModifierType;
}(PokemonModifierType));
exports.PokemonHeldItemModifierType = PokemonHeldItemModifierType;
var PokemonHpRestoreModifierType = /** @class */ (function (_super) {
    __extends(PokemonHpRestoreModifierType, _super);
    function PokemonHpRestoreModifierType(localeKey, iconImage, restorePoints, restorePercent, healStatus, newModifierFunc, selectFilter, group) {
        if (healStatus === void 0) { healStatus = false; }
        var _this = _super.call(this, localeKey, iconImage, newModifierFunc || (function (_type, args) { return new Modifiers.PokemonHpRestoreModifier(_this, args[0].id, _this.restorePoints, _this.restorePercent, _this.healStatus, false); }), selectFilter || (function (pokemon) {
            if (!pokemon.hp || (pokemon.hp >= pokemon.getMaxHp() && (!_this.healStatus || !pokemon.status))) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }), group || "potion") || this;
        _this.restorePoints = restorePoints;
        _this.restorePercent = restorePercent;
        _this.healStatus = healStatus;
        return _this;
    }
    PokemonHpRestoreModifierType.prototype.getDescription = function (scene) {
        return this.restorePoints
            ? i18n_1.default.t("modifierType:ModifierType.PokemonHpRestoreModifierType.description", {
                restorePoints: this.restorePoints,
                restorePercent: this.restorePercent,
            })
            : this.healStatus
                ? i18n_1.default.t("modifierType:ModifierType.PokemonHpRestoreModifierType.extra.fullyWithStatus")
                : i18n_1.default.t("modifierType:ModifierType.PokemonHpRestoreModifierType.extra.fully");
    };
    return PokemonHpRestoreModifierType;
}(PokemonModifierType));
exports.PokemonHpRestoreModifierType = PokemonHpRestoreModifierType;
var PokemonReviveModifierType = /** @class */ (function (_super) {
    __extends(PokemonReviveModifierType, _super);
    function PokemonReviveModifierType(localeKey, iconImage, restorePercent) {
        var _this = _super.call(this, localeKey, iconImage, 0, restorePercent, false, function (_type, args) { return new Modifiers.PokemonHpRestoreModifier(_this, args[0].id, 0, _this.restorePercent, false, true); }, (function (pokemon) {
            if (!pokemon.isFainted()) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }), "revive") || this;
        _this.selectFilter = function (pokemon) {
            if (pokemon.hp) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        };
        return _this;
    }
    PokemonReviveModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonReviveModifierType.description", { restorePercent: this.restorePercent });
    };
    return PokemonReviveModifierType;
}(PokemonHpRestoreModifierType));
exports.PokemonReviveModifierType = PokemonReviveModifierType;
var PokemonStatusHealModifierType = /** @class */ (function (_super) {
    __extends(PokemonStatusHealModifierType, _super);
    function PokemonStatusHealModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, (function (_type, args) { return new Modifiers.PokemonStatusHealModifier(_this, args[0].id); }), (function (pokemon) {
            if (!pokemon.hp || !pokemon.status) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        })) || this;
        return _this;
    }
    PokemonStatusHealModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonStatusHealModifierType.description");
    };
    return PokemonStatusHealModifierType;
}(PokemonModifierType));
exports.PokemonStatusHealModifierType = PokemonStatusHealModifierType;
var PokemonMoveModifierType = /** @class */ (function (_super) {
    __extends(PokemonMoveModifierType, _super);
    function PokemonMoveModifierType(localeKey, iconImage, newModifierFunc, selectFilter, moveSelectFilter, group) {
        var _this = _super.call(this, localeKey, iconImage, newModifierFunc, selectFilter, group) || this;
        _this.moveSelectFilter = moveSelectFilter;
        return _this;
    }
    return PokemonMoveModifierType;
}(PokemonModifierType));
exports.PokemonMoveModifierType = PokemonMoveModifierType;
var PokemonPpRestoreModifierType = /** @class */ (function (_super) {
    __extends(PokemonPpRestoreModifierType, _super);
    function PokemonPpRestoreModifierType(localeKey, iconImage, restorePoints) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonPpRestoreModifier(_this, args[0].id, args[1], _this.restorePoints); }, function (_pokemon) {
            return null;
        }, function (pokemonMove) {
            if (!pokemonMove.ppUsed) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }, "ether") || this;
        _this.restorePoints = restorePoints;
        return _this;
    }
    PokemonPpRestoreModifierType.prototype.getDescription = function (scene) {
        return this.restorePoints > -1
            ? i18n_1.default.t("modifierType:ModifierType.PokemonPpRestoreModifierType.description", { restorePoints: this.restorePoints })
            : i18n_1.default.t("modifierType:ModifierType.PokemonPpRestoreModifierType.extra.fully");
    };
    return PokemonPpRestoreModifierType;
}(PokemonMoveModifierType));
exports.PokemonPpRestoreModifierType = PokemonPpRestoreModifierType;
var PokemonAllMovePpRestoreModifierType = /** @class */ (function (_super) {
    __extends(PokemonAllMovePpRestoreModifierType, _super);
    function PokemonAllMovePpRestoreModifierType(localeKey, iconImage, restorePoints) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonAllMovePpRestoreModifier(_this, args[0].id, _this.restorePoints); }, function (pokemon) {
            if (!pokemon.getMoveset().filter(function (m) { return m.ppUsed; }).length) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }, "elixir") || this;
        _this.restorePoints = restorePoints;
        return _this;
    }
    PokemonAllMovePpRestoreModifierType.prototype.getDescription = function (scene) {
        return this.restorePoints > -1
            ? i18n_1.default.t("modifierType:ModifierType.PokemonAllMovePpRestoreModifierType.description", { restorePoints: this.restorePoints })
            : i18n_1.default.t("modifierType:ModifierType.PokemonAllMovePpRestoreModifierType.extra.fully");
    };
    return PokemonAllMovePpRestoreModifierType;
}(PokemonModifierType));
exports.PokemonAllMovePpRestoreModifierType = PokemonAllMovePpRestoreModifierType;
var PokemonPpUpModifierType = /** @class */ (function (_super) {
    __extends(PokemonPpUpModifierType, _super);
    function PokemonPpUpModifierType(localeKey, iconImage, upPoints) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonPpUpModifier(_this, args[0].id, args[1], _this.upPoints); }, function (_pokemon) {
            return null;
        }, function (pokemonMove) {
            if (pokemonMove.getMove().pp < 5 || pokemonMove.ppUp >= 3) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }, "ppUp") || this;
        _this.upPoints = upPoints;
        return _this;
    }
    PokemonPpUpModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonPpUpModifierType.description", { upPoints: this.upPoints });
    };
    return PokemonPpUpModifierType;
}(PokemonMoveModifierType));
exports.PokemonPpUpModifierType = PokemonPpUpModifierType;
var PokemonNatureChangeModifierType = /** @class */ (function (_super) {
    __extends(PokemonNatureChangeModifierType, _super);
    function PokemonNatureChangeModifierType(nature) {
        var _a;
        var _this = _super.call(this, "", "mint_".concat(((_a = Utils.getEnumKeys(pokemon_stat_1.Stat).find(function (s) { return (0, nature_1.getNatureStatMultiplier)(nature, pokemon_stat_1.Stat[s]) > 1; })) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "neutral"), (function (_type, args) { return new Modifiers.PokemonNatureChangeModifier(_this, args[0].id, _this.nature); }), (function (pokemon) {
            if (pokemon.getNature() === _this.nature) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }), "mint") || this;
        _this.nature = nature;
        return _this;
    }
    Object.defineProperty(PokemonNatureChangeModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:ModifierType.PokemonNatureChangeModifierType.name", { natureName: (0, nature_1.getNatureName)(this.nature) });
        },
        enumerable: false,
        configurable: true
    });
    PokemonNatureChangeModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonNatureChangeModifierType.description", { natureName: (0, nature_1.getNatureName)(this.nature, true, true, true) });
    };
    return PokemonNatureChangeModifierType;
}(PokemonModifierType));
exports.PokemonNatureChangeModifierType = PokemonNatureChangeModifierType;
var RememberMoveModifierType = /** @class */ (function (_super) {
    __extends(RememberMoveModifierType, _super);
    function RememberMoveModifierType(localeKey, iconImage, group) {
        return _super.call(this, localeKey, iconImage, function (type, args) { return new Modifiers.RememberMoveModifier(type, args[0].id, args[1]); }, function (pokemon) {
            if (!pokemon.getLearnableLevelMoves().length) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }, group) || this;
    }
    return RememberMoveModifierType;
}(PokemonModifierType));
exports.RememberMoveModifierType = RememberMoveModifierType;
var DoubleBattleChanceBoosterModifierType = /** @class */ (function (_super) {
    __extends(DoubleBattleChanceBoosterModifierType, _super);
    function DoubleBattleChanceBoosterModifierType(localeKey, iconImage, battleCount) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, _args) { return new Modifiers.DoubleBattleChanceBoosterModifier(_this, _this.battleCount); }, "lure") || this;
        _this.battleCount = battleCount;
        return _this;
    }
    DoubleBattleChanceBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.DoubleBattleChanceBoosterModifierType.description", { battleCount: this.battleCount });
    };
    return DoubleBattleChanceBoosterModifierType;
}(ModifierType));
exports.DoubleBattleChanceBoosterModifierType = DoubleBattleChanceBoosterModifierType;
var TempBattleStatBoosterModifierType = /** @class */ (function (_super) {
    __extends(TempBattleStatBoosterModifierType, _super);
    function TempBattleStatBoosterModifierType(tempBattleStat) {
        var _this = _super.call(this, "", (0, temp_battle_stat_1.getTempBattleStatBoosterItemName)(tempBattleStat).replace(/\./g, "").replace(/[ ]/g, "_").toLowerCase(), function (_type, _args) { return new Modifiers.TempBattleStatBoosterModifier(_this, _this.tempBattleStat); }) || this;
        _this.tempBattleStat = tempBattleStat;
        return _this;
    }
    Object.defineProperty(TempBattleStatBoosterModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:TempBattleStatBoosterItem.".concat((0, temp_battle_stat_1.getTempBattleStatBoosterItemName)(this.tempBattleStat).replace(/\./g, "").replace(/[ ]/g, "_").toLowerCase()));
        },
        enumerable: false,
        configurable: true
    });
    TempBattleStatBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.TempBattleStatBoosterModifierType.description", { tempBattleStatName: (0, temp_battle_stat_1.getTempBattleStatName)(this.tempBattleStat) });
    };
    TempBattleStatBoosterModifierType.prototype.getPregenArgs = function () {
        return [this.tempBattleStat];
    };
    return TempBattleStatBoosterModifierType;
}(ModifierType));
exports.TempBattleStatBoosterModifierType = TempBattleStatBoosterModifierType;
var BerryModifierType = /** @class */ (function (_super) {
    __extends(BerryModifierType, _super);
    function BerryModifierType(berryType) {
        var _this = _super.call(this, "", "".concat(berry_1.BerryType[berryType].toLowerCase(), "_berry"), function (type, args) { return new Modifiers.BerryModifier(type, args[0].id, berryType); }, "berry") || this;
        _this.berryType = berryType;
        return _this;
    }
    Object.defineProperty(BerryModifierType.prototype, "name", {
        get: function () {
            return (0, berry_1.getBerryName)(this.berryType);
        },
        enumerable: false,
        configurable: true
    });
    BerryModifierType.prototype.getDescription = function (scene) {
        return (0, berry_1.getBerryEffectDescription)(this.berryType);
    };
    BerryModifierType.prototype.getPregenArgs = function () {
        return [this.berryType];
    };
    return BerryModifierType;
}(PokemonHeldItemModifierType));
exports.BerryModifierType = BerryModifierType;
function getAttackTypeBoosterItemName(type) {
    switch (type) {
        case type_1.Type.NORMAL:
            return "Silk Scarf";
        case type_1.Type.FIGHTING:
            return "Black Belt";
        case type_1.Type.FLYING:
            return "Sharp Beak";
        case type_1.Type.POISON:
            return "Poison Barb";
        case type_1.Type.GROUND:
            return "Soft Sand";
        case type_1.Type.ROCK:
            return "Hard Stone";
        case type_1.Type.BUG:
            return "Silver Powder";
        case type_1.Type.GHOST:
            return "Spell Tag";
        case type_1.Type.STEEL:
            return "Metal Coat";
        case type_1.Type.FIRE:
            return "Charcoal";
        case type_1.Type.WATER:
            return "Mystic Water";
        case type_1.Type.GRASS:
            return "Miracle Seed";
        case type_1.Type.ELECTRIC:
            return "Magnet";
        case type_1.Type.PSYCHIC:
            return "Twisted Spoon";
        case type_1.Type.ICE:
            return "Never-Melt Ice";
        case type_1.Type.DRAGON:
            return "Dragon Fang";
        case type_1.Type.DARK:
            return "Black Glasses";
        case type_1.Type.FAIRY:
            return "Fairy Feather";
    }
}
var AttackTypeBoosterModifierType = /** @class */ (function (_super) {
    __extends(AttackTypeBoosterModifierType, _super);
    function AttackTypeBoosterModifierType(moveType, boostPercent) {
        var _this = _super.call(this, "", "".concat(getAttackTypeBoosterItemName(moveType).replace(/[ \-]/g, "_").toLowerCase()), function (_type, args) { return new Modifiers.AttackTypeBoosterModifier(_this, args[0].id, moveType, boostPercent); }) || this;
        _this.moveType = moveType;
        _this.boostPercent = boostPercent;
        return _this;
    }
    Object.defineProperty(AttackTypeBoosterModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:AttackTypeBoosterItem.".concat(getAttackTypeBoosterItemName(this.moveType).replace(/[ \-]/g, "_").toLowerCase()));
        },
        enumerable: false,
        configurable: true
    });
    AttackTypeBoosterModifierType.prototype.getDescription = function (scene) {
        // TODO: Need getTypeName?
        return i18n_1.default.t("modifierType:ModifierType.AttackTypeBoosterModifierType.description", { moveType: i18n_1.default.t("pokemonInfo:Type.".concat(type_1.Type[this.moveType])) });
    };
    AttackTypeBoosterModifierType.prototype.getPregenArgs = function () {
        return [this.moveType];
    };
    return AttackTypeBoosterModifierType;
}(PokemonHeldItemModifierType));
exports.AttackTypeBoosterModifierType = AttackTypeBoosterModifierType;
var PokemonLevelIncrementModifierType = /** @class */ (function (_super) {
    __extends(PokemonLevelIncrementModifierType, _super);
    function PokemonLevelIncrementModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonLevelIncrementModifier(_this, args[0].id); }, function (_pokemon) { return null; }) || this;
        return _this;
    }
    PokemonLevelIncrementModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonLevelIncrementModifierType.description");
    };
    return PokemonLevelIncrementModifierType;
}(PokemonModifierType));
exports.PokemonLevelIncrementModifierType = PokemonLevelIncrementModifierType;
var AllPokemonLevelIncrementModifierType = /** @class */ (function (_super) {
    __extends(AllPokemonLevelIncrementModifierType, _super);
    function AllPokemonLevelIncrementModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, _args) { return new Modifiers.PokemonLevelIncrementModifier(_this, -1); }) || this;
        return _this;
    }
    AllPokemonLevelIncrementModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.AllPokemonLevelIncrementModifierType.description");
    };
    return AllPokemonLevelIncrementModifierType;
}(ModifierType));
exports.AllPokemonLevelIncrementModifierType = AllPokemonLevelIncrementModifierType;
function getBaseStatBoosterItemName(stat) {
    switch (stat) {
        case pokemon_stat_1.Stat.HP:
            return "HP Up";
        case pokemon_stat_1.Stat.ATK:
            return "Protein";
        case pokemon_stat_1.Stat.DEF:
            return "Iron";
        case pokemon_stat_1.Stat.SPATK:
            return "Calcium";
        case pokemon_stat_1.Stat.SPDEF:
            return "Zinc";
        case pokemon_stat_1.Stat.SPD:
            return "Carbos";
    }
}
var PokemonBaseStatBoosterModifierType = /** @class */ (function (_super) {
    __extends(PokemonBaseStatBoosterModifierType, _super);
    function PokemonBaseStatBoosterModifierType(localeName, stat) {
        var _this = _super.call(this, "", localeName.replace(/[ \-]/g, "_").toLowerCase(), function (_type, args) { return new Modifiers.PokemonBaseStatModifier(_this, args[0].id, _this.stat); }) || this;
        _this.localeName = localeName;
        _this.stat = stat;
        return _this;
    }
    Object.defineProperty(PokemonBaseStatBoosterModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:BaseStatBoosterItem.".concat(this.localeName.replace(/[ \-]/g, "_").toLowerCase()));
        },
        enumerable: false,
        configurable: true
    });
    PokemonBaseStatBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonBaseStatBoosterModifierType.description", { statName: (0, pokemon_stat_1.getStatName)(this.stat) });
    };
    PokemonBaseStatBoosterModifierType.prototype.getPregenArgs = function () {
        return [this.stat];
    };
    return PokemonBaseStatBoosterModifierType;
}(PokemonHeldItemModifierType));
exports.PokemonBaseStatBoosterModifierType = PokemonBaseStatBoosterModifierType;
var AllPokemonFullHpRestoreModifierType = /** @class */ (function (_super) {
    __extends(AllPokemonFullHpRestoreModifierType, _super);
    function AllPokemonFullHpRestoreModifierType(localeKey, iconImage, descriptionKey, newModifierFunc) {
        var _this = _super.call(this, localeKey, iconImage, newModifierFunc || (function (_type, _args) { return new Modifiers.PokemonHpRestoreModifier(_this, -1, 0, 100, false); })) || this;
        _this.descriptionKey = descriptionKey;
        return _this;
    }
    AllPokemonFullHpRestoreModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("".concat(this.descriptionKey || "modifierType:ModifierType.AllPokemonFullHpRestoreModifierType", ".description"));
    };
    return AllPokemonFullHpRestoreModifierType;
}(ModifierType));
var AllPokemonFullReviveModifierType = /** @class */ (function (_super) {
    __extends(AllPokemonFullReviveModifierType, _super);
    function AllPokemonFullReviveModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, "modifierType:ModifierType.AllPokemonFullReviveModifierType", function (_type, _args) { return new Modifiers.PokemonHpRestoreModifier(_this, -1, 0, 100, false, true); }) || this;
        return _this;
    }
    return AllPokemonFullReviveModifierType;
}(AllPokemonFullHpRestoreModifierType));
var MoneyRewardModifierType = /** @class */ (function (_super) {
    __extends(MoneyRewardModifierType, _super);
    function MoneyRewardModifierType(localeKey, iconImage, moneyMultiplier, moneyMultiplierDescriptorKey) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, _args) { return new Modifiers.MoneyRewardModifier(_this, moneyMultiplier); }, "money", "buy") || this;
        _this.moneyMultiplier = moneyMultiplier;
        _this.moneyMultiplierDescriptorKey = moneyMultiplierDescriptorKey;
        return _this;
    }
    MoneyRewardModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.MoneyRewardModifierType.description", {
            moneyMultiplier: i18n_1.default.t(this.moneyMultiplierDescriptorKey),
            moneyAmount: scene.getWaveMoneyAmount(this.moneyMultiplier).toLocaleString("en-US"),
        });
    };
    return MoneyRewardModifierType;
}(ModifierType));
exports.MoneyRewardModifierType = MoneyRewardModifierType;
var ExpBoosterModifierType = /** @class */ (function (_super) {
    __extends(ExpBoosterModifierType, _super);
    function ExpBoosterModifierType(localeKey, iconImage, boostPercent) {
        var _this = _super.call(this, localeKey, iconImage, function () { return new Modifiers.ExpBoosterModifier(_this, boostPercent); }) || this;
        _this.boostPercent = boostPercent;
        return _this;
    }
    ExpBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.ExpBoosterModifierType.description", { boostPercent: this.boostPercent });
    };
    return ExpBoosterModifierType;
}(ModifierType));
exports.ExpBoosterModifierType = ExpBoosterModifierType;
var PokemonExpBoosterModifierType = /** @class */ (function (_super) {
    __extends(PokemonExpBoosterModifierType, _super);
    function PokemonExpBoosterModifierType(localeKey, iconImage, boostPercent) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonExpBoosterModifier(_this, args[0].id, boostPercent); }) || this;
        _this.boostPercent = boostPercent;
        return _this;
    }
    PokemonExpBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonExpBoosterModifierType.description", { boostPercent: this.boostPercent });
    };
    return PokemonExpBoosterModifierType;
}(PokemonHeldItemModifierType));
exports.PokemonExpBoosterModifierType = PokemonExpBoosterModifierType;
var PokemonFriendshipBoosterModifierType = /** @class */ (function (_super) {
    __extends(PokemonFriendshipBoosterModifierType, _super);
    function PokemonFriendshipBoosterModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonFriendshipBoosterModifier(_this, args[0].id); }) || this;
        return _this;
    }
    PokemonFriendshipBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonFriendshipBoosterModifierType.description");
    };
    return PokemonFriendshipBoosterModifierType;
}(PokemonHeldItemModifierType));
exports.PokemonFriendshipBoosterModifierType = PokemonFriendshipBoosterModifierType;
var PokemonMoveAccuracyBoosterModifierType = /** @class */ (function (_super) {
    __extends(PokemonMoveAccuracyBoosterModifierType, _super);
    function PokemonMoveAccuracyBoosterModifierType(localeKey, iconImage, amount, group, soundName) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.PokemonMoveAccuracyBoosterModifier(_this, args[0].id, amount); }, group, soundName) || this;
        _this.amount = amount;
        return _this;
    }
    PokemonMoveAccuracyBoosterModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonMoveAccuracyBoosterModifierType.description", { accuracyAmount: this.amount });
    };
    return PokemonMoveAccuracyBoosterModifierType;
}(PokemonHeldItemModifierType));
exports.PokemonMoveAccuracyBoosterModifierType = PokemonMoveAccuracyBoosterModifierType;
var PokemonMultiHitModifierType = /** @class */ (function (_super) {
    __extends(PokemonMultiHitModifierType, _super);
    function PokemonMultiHitModifierType(localeKey, iconImage) {
        return _super.call(this, localeKey, iconImage, function (type, args) { return new Modifiers.PokemonMultiHitModifier(type, args[0].id); }) || this;
    }
    PokemonMultiHitModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.PokemonMultiHitModifierType.description");
    };
    return PokemonMultiHitModifierType;
}(PokemonHeldItemModifierType));
exports.PokemonMultiHitModifierType = PokemonMultiHitModifierType;
var TmModifierType = /** @class */ (function (_super) {
    __extends(TmModifierType, _super);
    function TmModifierType(moveId) {
        var _this = _super.call(this, "", "tm_".concat(type_1.Type[move_1.allMoves[moveId].type].toLowerCase()), function (_type, args) { return new Modifiers.TmModifier(_this, args[0].id); }, function (pokemon) {
            if (pokemon.compatibleTms.indexOf(moveId) === -1 || pokemon.getMoveset().filter(function (m) { return (m === null || m === void 0 ? void 0 : m.moveId) === moveId; }).length) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }, "tm") || this;
        _this.moveId = moveId;
        return _this;
    }
    Object.defineProperty(TmModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:ModifierType.TmModifierType.name", {
                moveId: Utils.padInt(Object.keys(tms_1.tmSpecies).indexOf(this.moveId.toString()) + 1, 3),
                moveName: move_1.allMoves[this.moveId].name,
            });
        },
        enumerable: false,
        configurable: true
    });
    TmModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.TmModifierType.description", { moveName: move_1.allMoves[this.moveId].name });
    };
    return TmModifierType;
}(PokemonModifierType));
exports.TmModifierType = TmModifierType;
var EvolutionItemModifierType = /** @class */ (function (_super) {
    __extends(EvolutionItemModifierType, _super);
    function EvolutionItemModifierType(evolutionItem) {
        var _this = _super.call(this, "", pokemon_evolutions_1.EvolutionItem[evolutionItem].toLowerCase(), function (_type, args) { return new Modifiers.EvolutionItemModifier(_this, args[0].id); }, function (pokemon) {
            if (pokemon_evolutions_1.pokemonEvolutions.hasOwnProperty(pokemon.species.speciesId) && pokemon_evolutions_1.pokemonEvolutions[pokemon.species.speciesId].filter(function (e) { return e.item === _this.evolutionItem
                && (!e.condition || e.condition.predicate(pokemon)); }).length && (pokemon.getFormKey() !== pokemon_species_1.SpeciesFormKey.GIGANTAMAX)) {
                return null;
            }
            else if (pokemon.isFusion() && pokemon_evolutions_1.pokemonEvolutions.hasOwnProperty(pokemon.fusionSpecies.speciesId) && pokemon_evolutions_1.pokemonEvolutions[pokemon.fusionSpecies.speciesId].filter(function (e) { return e.item === _this.evolutionItem
                && (!e.condition || e.condition.predicate(pokemon)); }).length && (pokemon.getFusionFormKey() !== pokemon_species_1.SpeciesFormKey.GIGANTAMAX)) {
                return null;
            }
            return party_ui_handler_1.default.NoEffectMessage;
        }) || this;
        _this.evolutionItem = evolutionItem;
        return _this;
    }
    Object.defineProperty(EvolutionItemModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:EvolutionItem.".concat(pokemon_evolutions_1.EvolutionItem[this.evolutionItem]));
        },
        enumerable: false,
        configurable: true
    });
    EvolutionItemModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.EvolutionItemModifierType.description");
    };
    EvolutionItemModifierType.prototype.getPregenArgs = function () {
        return [this.evolutionItem];
    };
    return EvolutionItemModifierType;
}(PokemonModifierType));
exports.EvolutionItemModifierType = EvolutionItemModifierType;
var FormChangeItemModifierType = /** @class */ (function (_super) {
    __extends(FormChangeItemModifierType, _super);
    function FormChangeItemModifierType(formChangeItem) {
        var _this = _super.call(this, "", pokemon_forms_1.FormChangeItem[formChangeItem].toLowerCase(), function (_type, args) { return new Modifiers.PokemonFormChangeItemModifier(_this, args[0].id, formChangeItem, true); }, function (pokemon) {
            if (pokemon_forms_1.pokemonFormChanges.hasOwnProperty(pokemon.species.speciesId) && !!pokemon_forms_1.pokemonFormChanges[pokemon.species.speciesId].find(function (fc) { return fc.trigger.hasTriggerType(pokemon_forms_1.SpeciesFormChangeItemTrigger)
                && fc.trigger.item === _this.formChangeItem; })) {
                return null;
            }
            return party_ui_handler_1.default.NoEffectMessage;
        }) || this;
        _this.formChangeItem = formChangeItem;
        return _this;
    }
    Object.defineProperty(FormChangeItemModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:FormChangeItem.".concat(pokemon_forms_1.FormChangeItem[this.formChangeItem]));
        },
        enumerable: false,
        configurable: true
    });
    FormChangeItemModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.FormChangeItemModifierType.description");
    };
    FormChangeItemModifierType.prototype.getPregenArgs = function () {
        return [this.formChangeItem];
    };
    return FormChangeItemModifierType;
}(PokemonModifierType));
exports.FormChangeItemModifierType = FormChangeItemModifierType;
var FusePokemonModifierType = /** @class */ (function (_super) {
    __extends(FusePokemonModifierType, _super);
    function FusePokemonModifierType(localeKey, iconImage) {
        var _this = _super.call(this, localeKey, iconImage, function (_type, args) { return new Modifiers.FusePokemonModifier(_this, args[0].id, args[1].id); }, function (pokemon) {
            if (pokemon.isFusion()) {
                return party_ui_handler_1.default.NoEffectMessage;
            }
            return null;
        }) || this;
        return _this;
    }
    FusePokemonModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.FusePokemonModifierType.description");
    };
    return FusePokemonModifierType;
}(PokemonModifierType));
exports.FusePokemonModifierType = FusePokemonModifierType;
var AttackTypeBoosterModifierTypeGenerator = /** @class */ (function (_super) {
    __extends(AttackTypeBoosterModifierTypeGenerator, _super);
    function AttackTypeBoosterModifierTypeGenerator() {
        return _super.call(this, function (party, pregenArgs) {
            if (pregenArgs) {
                return new AttackTypeBoosterModifierType(pregenArgs[0], 20);
            }
            var attackMoveTypes = party.map(function (p) { return p.getMoveset().map(function (m) { return m.getMove(); }).filter(function (m) { return m instanceof move_1.AttackMove; }).map(function (m) { return m.type; }); }).flat();
            if (!attackMoveTypes.length) {
                return null;
            }
            var attackMoveTypeWeights = new Map();
            var totalWeight = 0;
            for (var _i = 0, attackMoveTypes_1 = attackMoveTypes; _i < attackMoveTypes_1.length; _i++) {
                var t = attackMoveTypes_1[_i];
                if (attackMoveTypeWeights.has(t)) {
                    if (attackMoveTypeWeights.get(t) < 3) {
                        attackMoveTypeWeights.set(t, attackMoveTypeWeights.get(t) + 1);
                    }
                    else {
                        continue;
                    }
                }
                else {
                    attackMoveTypeWeights.set(t, 1);
                }
                totalWeight++;
            }
            if (!totalWeight) {
                return null;
            }
            var type;
            var randInt = Utils.randSeedInt(totalWeight);
            var weight = 0;
            for (var _a = 0, _b = attackMoveTypeWeights.keys(); _a < _b.length; _a++) {
                var t = _b[_a];
                var typeWeight = attackMoveTypeWeights.get(t);
                if (randInt <= weight + typeWeight) {
                    type = t;
                    break;
                }
                weight += typeWeight;
            }
            return new AttackTypeBoosterModifierType(type, 20);
        }) || this;
    }
    return AttackTypeBoosterModifierTypeGenerator;
}(ModifierTypeGenerator));
var TmModifierTypeGenerator = /** @class */ (function (_super) {
    __extends(TmModifierTypeGenerator, _super);
    function TmModifierTypeGenerator(tier) {
        return _super.call(this, function (party) {
            var partyMemberCompatibleTms = party.map(function (p) { return p.compatibleTms.filter(function (tm) { return !p.moveset.find(function (m) { return m.moveId === tm; }); }); });
            var tierUniqueCompatibleTms = partyMemberCompatibleTms.flat().filter(function (tm) { return tms_1.tmPoolTiers[tm] === tier; }).filter(function (tm) { return !move_1.allMoves[tm].name.endsWith(" (N)"); }).filter(function (tm, i, array) { return array.indexOf(tm) === i; });
            if (!tierUniqueCompatibleTms.length) {
                return null;
            }
            var randTmIndex = Utils.randSeedInt(tierUniqueCompatibleTms.length);
            return new TmModifierType(tierUniqueCompatibleTms[randTmIndex]);
        }) || this;
    }
    return TmModifierTypeGenerator;
}(ModifierTypeGenerator));
var EvolutionItemModifierTypeGenerator = /** @class */ (function (_super) {
    __extends(EvolutionItemModifierTypeGenerator, _super);
    function EvolutionItemModifierTypeGenerator(rare) {
        return _super.call(this, function (party, pregenArgs) {
            if (pregenArgs) {
                return new EvolutionItemModifierType(pregenArgs[0]);
            }
            var evolutionItemPool = [
                party.filter(function (p) { return pokemon_evolutions_1.pokemonEvolutions.hasOwnProperty(p.species.speciesId); }).map(function (p) {
                    var evolutions = pokemon_evolutions_1.pokemonEvolutions[p.species.speciesId];
                    return evolutions.filter(function (e) { return e.item !== pokemon_evolutions_1.EvolutionItem.NONE && (e.evoFormKey === null || (e.preFormKey || "") === p.getFormKey()) && (!e.condition || e.condition.predicate(p)); });
                }).flat(),
                party.filter(function (p) { return p.isFusion() && pokemon_evolutions_1.pokemonEvolutions.hasOwnProperty(p.fusionSpecies.speciesId); }).map(function (p) {
                    var evolutions = pokemon_evolutions_1.pokemonEvolutions[p.fusionSpecies.speciesId];
                    return evolutions.filter(function (e) { return e.item !== pokemon_evolutions_1.EvolutionItem.NONE && (e.evoFormKey === null || (e.preFormKey || "") === p.getFusionFormKey()) && (!e.condition || e.condition.predicate(p)); });
                }).flat()
            ].flat().flatMap(function (e) { return e.item; }).filter(function (i) { return (i > 50) === rare; });
            if (!evolutionItemPool.length) {
                return null;
            }
            return new EvolutionItemModifierType(evolutionItemPool[Utils.randSeedInt(evolutionItemPool.length)]);
        }) || this;
    }
    return EvolutionItemModifierTypeGenerator;
}(ModifierTypeGenerator));
var FormChangeItemModifierTypeGenerator = /** @class */ (function (_super) {
    __extends(FormChangeItemModifierTypeGenerator, _super);
    function FormChangeItemModifierTypeGenerator() {
        return _super.call(this, function (party, pregenArgs) {
            if (pregenArgs) {
                return new FormChangeItemModifierType(pregenArgs[0]);
            }
            var formChangeItemPool = party.filter(function (p) { return pokemon_forms_1.pokemonFormChanges.hasOwnProperty(p.species.speciesId); }).map(function (p) {
                var formChanges = pokemon_forms_1.pokemonFormChanges[p.species.speciesId];
                return formChanges.filter(function (fc) { return ((fc.formKey.indexOf(pokemon_species_1.SpeciesFormKey.MEGA) === -1 && fc.formKey.indexOf(pokemon_species_1.SpeciesFormKey.PRIMAL) === -1) || party[0].scene.getModifiers(Modifiers.MegaEvolutionAccessModifier).length)
                    && ((fc.formKey.indexOf(pokemon_species_1.SpeciesFormKey.GIGANTAMAX) === -1 && fc.formKey.indexOf(pokemon_species_1.SpeciesFormKey.ETERNAMAX) === -1) || party[0].scene.getModifiers(Modifiers.GigantamaxAccessModifier).length); })
                    .map(function (fc) { return fc.findTrigger(pokemon_forms_1.SpeciesFormChangeItemTrigger); })
                    .filter(function (t) { return t && t.active && !p.scene.findModifier(function (m) { return m instanceof Modifiers.PokemonFormChangeItemModifier && m.pokemonId === p.id && m.formChangeItem === t.item; }); });
            }).flat().flatMap(function (fc) { return fc.item; });
            if (!formChangeItemPool.length) {
                return null;
            }
            return new FormChangeItemModifierType(formChangeItemPool[Utils.randSeedInt(formChangeItemPool.length)]);
        }) || this;
    }
    return FormChangeItemModifierTypeGenerator;
}(ModifierTypeGenerator));
var TerastallizeModifierType = /** @class */ (function (_super) {
    __extends(TerastallizeModifierType, _super);
    function TerastallizeModifierType(teraType) {
        var _this = _super.call(this, "", "".concat(type_1.Type[teraType].toLowerCase(), "_tera_shard"), function (type, args) { return new Modifiers.TerastallizeModifier(type, args[0].id, teraType); }, "tera_shard") || this;
        _this.teraType = teraType;
        return _this;
    }
    Object.defineProperty(TerastallizeModifierType.prototype, "name", {
        get: function () {
            return i18n_1.default.t("modifierType:ModifierType.TerastallizeModifierType.name", { teraType: i18n_1.default.t("pokemonInfo:Type.".concat(type_1.Type[this.teraType])) });
        },
        enumerable: false,
        configurable: true
    });
    TerastallizeModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.TerastallizeModifierType.description", { teraType: i18n_1.default.t("pokemonInfo:Type.".concat(type_1.Type[this.teraType])) });
    };
    TerastallizeModifierType.prototype.getPregenArgs = function () {
        return [this.teraType];
    };
    return TerastallizeModifierType;
}(PokemonHeldItemModifierType));
exports.TerastallizeModifierType = TerastallizeModifierType;
var ContactHeldItemTransferChanceModifierType = /** @class */ (function (_super) {
    __extends(ContactHeldItemTransferChanceModifierType, _super);
    function ContactHeldItemTransferChanceModifierType(localeKey, iconImage, chancePercent, group, soundName) {
        var _this = _super.call(this, localeKey, iconImage, function (type, args) { return new Modifiers.ContactHeldItemTransferChanceModifier(type, args[0].id, chancePercent); }, group, soundName) || this;
        _this.chancePercent = chancePercent;
        return _this;
    }
    ContactHeldItemTransferChanceModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.ContactHeldItemTransferChanceModifierType.description", { chancePercent: this.chancePercent });
    };
    return ContactHeldItemTransferChanceModifierType;
}(PokemonHeldItemModifierType));
exports.ContactHeldItemTransferChanceModifierType = ContactHeldItemTransferChanceModifierType;
var TurnHeldItemTransferModifierType = /** @class */ (function (_super) {
    __extends(TurnHeldItemTransferModifierType, _super);
    function TurnHeldItemTransferModifierType(localeKey, iconImage, group, soundName) {
        return _super.call(this, localeKey, iconImage, function (type, args) { return new Modifiers.TurnHeldItemTransferModifier(type, args[0].id); }, group, soundName) || this;
    }
    TurnHeldItemTransferModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.TurnHeldItemTransferModifierType.description");
    };
    return TurnHeldItemTransferModifierType;
}(PokemonHeldItemModifierType));
exports.TurnHeldItemTransferModifierType = TurnHeldItemTransferModifierType;
var EnemyAttackStatusEffectChanceModifierType = /** @class */ (function (_super) {
    __extends(EnemyAttackStatusEffectChanceModifierType, _super);
    function EnemyAttackStatusEffectChanceModifierType(localeKey, iconImage, chancePercent, effect) {
        var _this = _super.call(this, localeKey, iconImage, function (type, args) { return new Modifiers.EnemyAttackStatusEffectChanceModifier(type, effect, chancePercent); }, "enemy_status_chance") || this;
        _this.chancePercent = chancePercent;
        _this.effect = effect;
        return _this;
    }
    EnemyAttackStatusEffectChanceModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.EnemyAttackStatusEffectChanceModifierType.description", {
            chancePercent: this.chancePercent,
            statusEffect: (0, status_effect_1.getStatusEffectDescriptor)(this.effect),
        });
    };
    return EnemyAttackStatusEffectChanceModifierType;
}(ModifierType));
exports.EnemyAttackStatusEffectChanceModifierType = EnemyAttackStatusEffectChanceModifierType;
var EnemyEndureChanceModifierType = /** @class */ (function (_super) {
    __extends(EnemyEndureChanceModifierType, _super);
    function EnemyEndureChanceModifierType(localeKey, iconImage, chancePercent) {
        var _this = _super.call(this, localeKey, iconImage, function (type, _args) { return new Modifiers.EnemyEndureChanceModifier(type, chancePercent); }, "enemy_endure") || this;
        _this.chancePercent = chancePercent;
        return _this;
    }
    EnemyEndureChanceModifierType.prototype.getDescription = function (scene) {
        return i18n_1.default.t("modifierType:ModifierType.EnemyEndureChanceModifierType.description", { chancePercent: this.chancePercent });
    };
    return EnemyEndureChanceModifierType;
}(ModifierType));
exports.EnemyEndureChanceModifierType = EnemyEndureChanceModifierType;
var WeightedModifierType = /** @class */ (function () {
    function WeightedModifierType(modifierTypeFunc, weight, maxWeight) {
        this.modifierType = modifierTypeFunc();
        this.modifierType.id = Object.keys(exports.modifierTypes).find(function (k) { return exports.modifierTypes[k] === modifierTypeFunc; });
        this.weight = weight;
        this.maxWeight = maxWeight || (!(weight instanceof Function) ? weight : 0);
    }
    WeightedModifierType.prototype.setTier = function (tier) {
        this.modifierType.setTier(tier);
    };
    return WeightedModifierType;
}());
exports.modifierTypes = {
    POKEBALL: function () { return new AddPokeballModifierType("pb", pokeball_1.PokeballType.POKEBALL, 5); },
    GREAT_BALL: function () { return new AddPokeballModifierType("gb", pokeball_1.PokeballType.GREAT_BALL, 5); },
    ULTRA_BALL: function () { return new AddPokeballModifierType("ub", pokeball_1.PokeballType.ULTRA_BALL, 5); },
    ROGUE_BALL: function () { return new AddPokeballModifierType("rb", pokeball_1.PokeballType.ROGUE_BALL, 5); },
    MASTER_BALL: function () { return new AddPokeballModifierType("mb", pokeball_1.PokeballType.MASTER_BALL, 1); },
    RARE_CANDY: function () { return new PokemonLevelIncrementModifierType("modifierType:ModifierType.RARE_CANDY", "rare_candy"); },
    RARER_CANDY: function () { return new AllPokemonLevelIncrementModifierType("modifierType:ModifierType.RARER_CANDY", "rarer_candy"); },
    EVOLUTION_ITEM: function () { return new EvolutionItemModifierTypeGenerator(false); },
    RARE_EVOLUTION_ITEM: function () { return new EvolutionItemModifierTypeGenerator(true); },
    FORM_CHANGE_ITEM: function () { return new FormChangeItemModifierTypeGenerator(); },
    MEGA_BRACELET: function () { return new ModifierType("modifierType:ModifierType.MEGA_BRACELET", "mega_bracelet", function (type, _args) { return new Modifiers.MegaEvolutionAccessModifier(type); }); },
    DYNAMAX_BAND: function () { return new ModifierType("modifierType:ModifierType.DYNAMAX_BAND", "dynamax_band", function (type, _args) { return new Modifiers.GigantamaxAccessModifier(type); }); },
    TERA_ORB: function () { return new ModifierType("modifierType:ModifierType.TERA_ORB", "tera_orb", function (type, _args) { return new Modifiers.TerastallizeAccessModifier(type); }); },
    MAP: function () { return new ModifierType("modifierType:ModifierType.MAP", "map", function (type, _args) { return new Modifiers.MapModifier(type); }); },
    POTION: function () { return new PokemonHpRestoreModifierType("modifierType:ModifierType.POTION", "potion", 20, 10); },
    SUPER_POTION: function () { return new PokemonHpRestoreModifierType("modifierType:ModifierType.SUPER_POTION", "super_potion", 50, 25); },
    HYPER_POTION: function () { return new PokemonHpRestoreModifierType("modifierType:ModifierType.HYPER_POTION", "hyper_potion", 200, 50); },
    MAX_POTION: function () { return new PokemonHpRestoreModifierType("modifierType:ModifierType.MAX_POTION", "max_potion", 0, 100); },
    FULL_RESTORE: function () { return new PokemonHpRestoreModifierType("modifierType:ModifierType.FULL_RESTORE", "full_restore", 0, 100, true); },
    REVIVE: function () { return new PokemonReviveModifierType("modifierType:ModifierType.REVIVE", "revive", 50); },
    MAX_REVIVE: function () { return new PokemonReviveModifierType("modifierType:ModifierType.MAX_REVIVE", "max_revive", 100); },
    FULL_HEAL: function () { return new PokemonStatusHealModifierType("modifierType:ModifierType.FULL_HEAL", "full_heal"); },
    SACRED_ASH: function () { return new AllPokemonFullReviveModifierType("modifierType:ModifierType.SACRED_ASH", "sacred_ash"); },
    REVIVER_SEED: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.REVIVER_SEED", "reviver_seed", function (type, args) { return new Modifiers.PokemonInstantReviveModifier(type, args[0].id); }); },
    ETHER: function () { return new PokemonPpRestoreModifierType("modifierType:ModifierType.ETHER", "ether", 10); },
    MAX_ETHER: function () { return new PokemonPpRestoreModifierType("modifierType:ModifierType.MAX_ETHER", "max_ether", -1); },
    ELIXIR: function () { return new PokemonAllMovePpRestoreModifierType("modifierType:ModifierType.ELIXIR", "elixir", 10); },
    MAX_ELIXIR: function () { return new PokemonAllMovePpRestoreModifierType("modifierType:ModifierType.MAX_ELIXIR", "max_elixir", -1); },
    PP_UP: function () { return new PokemonPpUpModifierType("modifierType:ModifierType.PP_UP", "pp_up", 1); },
    PP_MAX: function () { return new PokemonPpUpModifierType("modifierType:ModifierType.PP_MAX", "pp_max", 3); },
    /*REPEL: () => new DoubleBattleChanceBoosterModifierType('Repel', 5),
    SUPER_REPEL: () => new DoubleBattleChanceBoosterModifierType('Super Repel', 10),
    MAX_REPEL: () => new DoubleBattleChanceBoosterModifierType('Max Repel', 25),*/
    LURE: function () { return new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.LURE", "lure", 5); },
    SUPER_LURE: function () { return new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.SUPER_LURE", "super_lure", 10); },
    MAX_LURE: function () { return new DoubleBattleChanceBoosterModifierType("modifierType:ModifierType.MAX_LURE", "max_lure", 25); },
    TEMP_STAT_BOOSTER: function () { return new ModifierTypeGenerator(function (party, pregenArgs) {
        if (pregenArgs) {
            return new TempBattleStatBoosterModifierType(pregenArgs[0]);
        }
        var randTempBattleStat = Utils.randSeedInt(6);
        return new TempBattleStatBoosterModifierType(randTempBattleStat);
    }); },
    DIRE_HIT: function () { return new TempBattleStatBoosterModifierType(temp_battle_stat_1.TempBattleStat.CRIT); },
    BASE_STAT_BOOSTER: function () { return new ModifierTypeGenerator(function (party, pregenArgs) {
        if (pregenArgs) {
            var stat = pregenArgs[0];
            return new PokemonBaseStatBoosterModifierType(getBaseStatBoosterItemName(stat), stat);
        }
        var randStat = Utils.randSeedInt(6);
        return new PokemonBaseStatBoosterModifierType(getBaseStatBoosterItemName(randStat), randStat);
    }); },
    ATTACK_TYPE_BOOSTER: function () { return new AttackTypeBoosterModifierTypeGenerator(); },
    MINT: function () { return new ModifierTypeGenerator(function (party, pregenArgs) {
        if (pregenArgs) {
            return new PokemonNatureChangeModifierType(pregenArgs[0]);
        }
        return new PokemonNatureChangeModifierType(Utils.randSeedInt(Utils.getEnumValues(nature_1.Nature).length));
    }); },
    TERA_SHARD: function () { return new ModifierTypeGenerator(function (party, pregenArgs) {
        if (pregenArgs) {
            return new TerastallizeModifierType(pregenArgs[0]);
        }
        if (!party[0].scene.getModifiers(Modifiers.TerastallizeAccessModifier).length) {
            return null;
        }
        var type;
        if (!Utils.randSeedInt(3)) {
            var partyMemberTypes = party.map(function (p) { return p.getTypes(false, false, true); }).flat();
            type = Utils.randSeedItem(partyMemberTypes);
        }
        else {
            type = Utils.randSeedInt(64) ? Utils.randSeedInt(18) : type_1.Type.STELLAR;
        }
        return new TerastallizeModifierType(type);
    }); },
    BERRY: function () { return new ModifierTypeGenerator(function (party, pregenArgs) {
        if (pregenArgs) {
            return new BerryModifierType(pregenArgs[0]);
        }
        var berryTypes = Utils.getEnumValues(berry_1.BerryType);
        var randBerryType;
        var rand = Utils.randSeedInt(12);
        if (rand < 2) {
            randBerryType = berry_1.BerryType.SITRUS;
        }
        else if (rand < 4) {
            randBerryType = berry_1.BerryType.LUM;
        }
        else if (rand < 6) {
            randBerryType = berry_1.BerryType.LEPPA;
        }
        else {
            randBerryType = berryTypes[Utils.randSeedInt(berryTypes.length - 3) + 2];
        }
        return new BerryModifierType(randBerryType);
    }); },
    TM_COMMON: function () { return new TmModifierTypeGenerator(modifier_tier_1.ModifierTier.COMMON); },
    TM_GREAT: function () { return new TmModifierTypeGenerator(modifier_tier_1.ModifierTier.GREAT); },
    TM_ULTRA: function () { return new TmModifierTypeGenerator(modifier_tier_1.ModifierTier.ULTRA); },
    MEMORY_MUSHROOM: function () { return new RememberMoveModifierType("modifierType:ModifierType.MEMORY_MUSHROOM", "big_mushroom"); },
    EXP_SHARE: function () { return new ModifierType("modifierType:ModifierType.EXP_SHARE", "exp_share", function (type, _args) { return new Modifiers.ExpShareModifier(type); }); },
    EXP_BALANCE: function () { return new ModifierType("modifierType:ModifierType.EXP_BALANCE", "exp_balance", function (type, _args) { return new Modifiers.ExpBalanceModifier(type); }); },
    OVAL_CHARM: function () { return new ModifierType("modifierType:ModifierType.OVAL_CHARM", "oval_charm", function (type, _args) { return new Modifiers.MultipleParticipantExpBonusModifier(type); }); },
    EXP_CHARM: function () { return new ExpBoosterModifierType("modifierType:ModifierType.EXP_CHARM", "exp_charm", 25); },
    SUPER_EXP_CHARM: function () { return new ExpBoosterModifierType("modifierType:ModifierType.SUPER_EXP_CHARM", "super_exp_charm", 60); },
    GOLDEN_EXP_CHARM: function () { return new ExpBoosterModifierType("modifierType:ModifierType.GOLDEN_EXP_CHARM", "golden_exp_charm", 100); },
    LUCKY_EGG: function () { return new PokemonExpBoosterModifierType("modifierType:ModifierType.LUCKY_EGG", "lucky_egg", 40); },
    GOLDEN_EGG: function () { return new PokemonExpBoosterModifierType("modifierType:ModifierType.GOLDEN_EGG", "golden_egg", 100); },
    SOOTHE_BELL: function () { return new PokemonFriendshipBoosterModifierType("modifierType:ModifierType.SOOTHE_BELL", "soothe_bell"); },
    SOUL_DEW: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.SOUL_DEW", "soul_dew", function (type, args) { return new Modifiers.PokemonNatureWeightModifier(type, args[0].id); }); },
    NUGGET: function () { return new MoneyRewardModifierType("modifierType:ModifierType.NUGGET", "nugget", 1, "modifierType:ModifierType.MoneyRewardModifierType.extra.small"); },
    BIG_NUGGET: function () { return new MoneyRewardModifierType("modifierType:ModifierType.BIG_NUGGET", "big_nugget", 2.5, "modifierType:ModifierType.MoneyRewardModifierType.extra.moderate"); },
    RELIC_GOLD: function () { return new MoneyRewardModifierType("modifierType:ModifierType.RELIC_GOLD", "relic_gold", 10, "modifierType:ModifierType.MoneyRewardModifierType.extra.large"); },
    AMULET_COIN: function () { return new ModifierType("modifierType:ModifierType.AMULET_COIN", "amulet_coin", function (type, _args) { return new Modifiers.MoneyMultiplierModifier(type); }); },
    GOLDEN_PUNCH: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.GOLDEN_PUNCH", "golden_punch", function (type, args) { return new Modifiers.DamageMoneyRewardModifier(type, args[0].id); }); },
    COIN_CASE: function () { return new ModifierType("modifierType:ModifierType.COIN_CASE", "coin_case", function (type, _args) { return new Modifiers.MoneyInterestModifier(type); }); },
    LOCK_CAPSULE: function () { return new ModifierType("modifierType:ModifierType.LOCK_CAPSULE", "lock_capsule", function (type, _args) { return new Modifiers.LockModifierTiersModifier(type); }); },
    GRIP_CLAW: function () { return new ContactHeldItemTransferChanceModifierType("modifierType:ModifierType.GRIP_CLAW", "grip_claw", 10); },
    WIDE_LENS: function () { return new PokemonMoveAccuracyBoosterModifierType("modifierType:ModifierType.WIDE_LENS", "wide_lens", 5); },
    MULTI_LENS: function () { return new PokemonMultiHitModifierType("modifierType:ModifierType.MULTI_LENS", "zoom_lens"); },
    HEALING_CHARM: function () { return new ModifierType("modifierType:ModifierType.HEALING_CHARM", "healing_charm", function (type, _args) { return new Modifiers.HealingBoosterModifier(type, 1.1); }); },
    CANDY_JAR: function () { return new ModifierType("modifierType:ModifierType.CANDY_JAR", "candy_jar", function (type, _args) { return new Modifiers.LevelIncrementBoosterModifier(type); }); },
    BERRY_POUCH: function () { return new ModifierType("modifierType:ModifierType.BERRY_POUCH", "berry_pouch", function (type, _args) { return new Modifiers.PreserveBerryModifier(type); }); },
    FOCUS_BAND: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.FOCUS_BAND", "focus_band", function (type, args) { return new Modifiers.SurviveDamageModifier(type, args[0].id); }); },
    QUICK_CLAW: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.QUICK_CLAW", "quick_claw", function (type, args) { return new Modifiers.BypassSpeedChanceModifier(type, args[0].id); }); },
    KINGS_ROCK: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.KINGS_ROCK", "kings_rock", function (type, args) { return new Modifiers.FlinchChanceModifier(type, args[0].id); }); },
    LEFTOVERS: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.LEFTOVERS", "leftovers", function (type, args) { return new Modifiers.TurnHealModifier(type, args[0].id); }); },
    SHELL_BELL: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.SHELL_BELL", "shell_bell", function (type, args) { return new Modifiers.HitHealModifier(type, args[0].id); }); },
    BATON: function () { return new PokemonHeldItemModifierType("modifierType:ModifierType.BATON", "stick", function (type, args) { return new Modifiers.SwitchEffectTransferModifier(type, args[0].id); }); },
    SHINY_CHARM: function () { return new ModifierType("modifierType:ModifierType.SHINY_CHARM", "shiny_charm", function (type, _args) { return new Modifiers.ShinyRateBoosterModifier(type); }); },
    ABILITY_CHARM: function () { return new ModifierType("modifierType:ModifierType.ABILITY_CHARM", "ability_charm", function (type, _args) { return new Modifiers.HiddenAbilityRateBoosterModifier(type); }); },
    IV_SCANNER: function () { return new ModifierType("modifierType:ModifierType.IV_SCANNER", "scanner", function (type, _args) { return new Modifiers.IvScannerModifier(type); }); },
    DNA_SPLICERS: function () { return new FusePokemonModifierType("modifierType:ModifierType.DNA_SPLICERS", "dna_splicers"); },
    MINI_BLACK_HOLE: function () { return new TurnHeldItemTransferModifierType("modifierType:ModifierType.MINI_BLACK_HOLE", "mini_black_hole"); },
    VOUCHER: function () { return new AddVoucherModifierType(voucher_1.VoucherType.REGULAR, 1); },
    VOUCHER_PLUS: function () { return new AddVoucherModifierType(voucher_1.VoucherType.PLUS, 1); },
    VOUCHER_PREMIUM: function () { return new AddVoucherModifierType(voucher_1.VoucherType.PREMIUM, 1); },
    GOLDEN_POKEBALL: function () { return new ModifierType("modifierType:ModifierType.GOLDEN_POKEBALL", "pb_gold", function (type, _args) { return new Modifiers.ExtraModifierModifier(type); }, null, "pb_bounce_1"); },
    ENEMY_DAMAGE_BOOSTER: function () { return new ModifierType("modifierType:ModifierType.ENEMY_DAMAGE_BOOSTER", "wl_item_drop", function (type, _args) { return new Modifiers.EnemyDamageBoosterModifier(type, 5); }); },
    ENEMY_DAMAGE_REDUCTION: function () { return new ModifierType("modifierType:ModifierType.ENEMY_DAMAGE_REDUCTION", "wl_guard_spec", function (type, _args) { return new Modifiers.EnemyDamageReducerModifier(type, 2.5); }); },
    //ENEMY_SUPER_EFFECT_BOOSTER: () => new ModifierType('Type Advantage Token', 'Increases damage of super effective attacks by 30%', (type, _args) => new Modifiers.EnemySuperEffectiveDamageBoosterModifier(type, 30), 'wl_custom_super_effective'),
    ENEMY_HEAL: function () { return new ModifierType("modifierType:ModifierType.ENEMY_HEAL", "wl_potion", function (type, _args) { return new Modifiers.EnemyTurnHealModifier(type, 2); }); },
    ENEMY_ATTACK_POISON_CHANCE: function () { return new EnemyAttackStatusEffectChanceModifierType("modifierType:ModifierType.ENEMY_ATTACK_POISON_CHANCE", "wl_antidote", 10, status_effect_1.StatusEffect.POISON); },
    ENEMY_ATTACK_PARALYZE_CHANCE: function () { return new EnemyAttackStatusEffectChanceModifierType("modifierType:ModifierType.ENEMY_ATTACK_PARALYZE_CHANCE", "wl_paralyze_heal", 10, status_effect_1.StatusEffect.PARALYSIS); },
    ENEMY_ATTACK_SLEEP_CHANCE: function () { return new EnemyAttackStatusEffectChanceModifierType("modifierType:ModifierType.ENEMY_ATTACK_SLEEP_CHANCE", "wl_awakening", 10, status_effect_1.StatusEffect.SLEEP); },
    ENEMY_ATTACK_FREEZE_CHANCE: function () { return new EnemyAttackStatusEffectChanceModifierType("modifierType:ModifierType.ENEMY_ATTACK_FREEZE_CHANCE", "wl_ice_heal", 10, status_effect_1.StatusEffect.FREEZE); },
    ENEMY_ATTACK_BURN_CHANCE: function () { return new EnemyAttackStatusEffectChanceModifierType("modifierType:ModifierType.ENEMY_ATTACK_BURN_CHANCE", "wl_burn_heal", 10, status_effect_1.StatusEffect.BURN); },
    ENEMY_STATUS_EFFECT_HEAL_CHANCE: function () { return new ModifierType("modifierType:ModifierType.ENEMY_STATUS_EFFECT_HEAL_CHANCE", "wl_full_heal", function (type, _args) { return new Modifiers.EnemyStatusEffectHealChanceModifier(type, 10); }); },
    ENEMY_ENDURE_CHANCE: function () { return new EnemyEndureChanceModifierType("modifierType:ModifierType.ENEMY_ENDURE_CHANCE", "wl_reset_urge", 2.5); },
    ENEMY_FUSED_CHANCE: function () { return new ModifierType("modifierType:ModifierType.ENEMY_FUSED_CHANCE", "wl_custom_spliced", function (type, _args) { return new Modifiers.EnemyFusionChanceModifier(type, 1); }); },
};
var modifierPool = (_a = {},
    _a[modifier_tier_1.ModifierTier.COMMON] = [
        new WeightedModifierType(exports.modifierTypes.POKEBALL, 6),
        new WeightedModifierType(exports.modifierTypes.RARE_CANDY, 2),
        new WeightedModifierType(exports.modifierTypes.POTION, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return (p.getInverseHp() >= 10 || p.getHpRatio() <= 0.875) && !p.isFainted(); }).length, 3);
            return thresholdPartyMemberCount * 3;
        }, 9),
        new WeightedModifierType(exports.modifierTypes.SUPER_POTION, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return (p.getInverseHp() >= 25 || p.getHpRatio() <= 0.75) && !p.isFainted(); }).length, 3);
            return thresholdPartyMemberCount;
        }, 3),
        new WeightedModifierType(exports.modifierTypes.ETHER, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && p.getMoveset().filter(function (m) { return (m.getMovePp() - m.ppUsed) <= 5; }).length; }).length, 3);
            return thresholdPartyMemberCount * 3;
        }, 9),
        new WeightedModifierType(exports.modifierTypes.MAX_ETHER, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && p.getMoveset().filter(function (m) { return (m.getMovePp() - m.ppUsed) <= 5; }).length; }).length, 3);
            return thresholdPartyMemberCount;
        }, 3),
        new WeightedModifierType(exports.modifierTypes.LURE, 2),
        new WeightedModifierType(exports.modifierTypes.TEMP_STAT_BOOSTER, 4),
        new WeightedModifierType(exports.modifierTypes.BERRY, 2),
        new WeightedModifierType(exports.modifierTypes.TM_COMMON, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.COMMON);
        return m;
    }),
    _a[modifier_tier_1.ModifierTier.GREAT] = [
        new WeightedModifierType(exports.modifierTypes.GREAT_BALL, 6),
        new WeightedModifierType(exports.modifierTypes.FULL_HEAL, function (party) {
            var statusEffectPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && !!p.status; }).length, 3);
            return statusEffectPartyMemberCount * 6;
        }, 18),
        new WeightedModifierType(exports.modifierTypes.REVIVE, function (party) {
            var faintedPartyMemberCount = Math.min(party.filter(function (p) { return p.isFainted(); }).length, 3);
            return faintedPartyMemberCount * 9;
        }, 27),
        new WeightedModifierType(exports.modifierTypes.MAX_REVIVE, function (party) {
            var faintedPartyMemberCount = Math.min(party.filter(function (p) { return p.isFainted(); }).length, 3);
            return faintedPartyMemberCount * 3;
        }, 9),
        new WeightedModifierType(exports.modifierTypes.SACRED_ASH, function (party) {
            return party.filter(function (p) { return p.isFainted(); }).length >= Math.ceil(party.length / 2) ? 1 : 0;
        }, 1),
        new WeightedModifierType(exports.modifierTypes.HYPER_POTION, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return (p.getInverseHp() >= 100 || p.getHpRatio() <= 0.625) && !p.isFainted(); }).length, 3);
            return thresholdPartyMemberCount * 3;
        }, 9),
        new WeightedModifierType(exports.modifierTypes.MAX_POTION, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return (p.getInverseHp() >= 150 || p.getHpRatio() <= 0.5) && !p.isFainted(); }).length, 3);
            return thresholdPartyMemberCount;
        }, 3),
        new WeightedModifierType(exports.modifierTypes.FULL_RESTORE, function (party) {
            var statusEffectPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && !!p.status; }).length, 3);
            var thresholdPartyMemberCount = Math.floor((Math.min(party.filter(function (p) { return (p.getInverseHp() >= 150 || p.getHpRatio() <= 0.5) && !p.isFainted(); }).length, 3) + statusEffectPartyMemberCount) / 2);
            return thresholdPartyMemberCount;
        }, 3),
        new WeightedModifierType(exports.modifierTypes.ELIXIR, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && p.getMoveset().filter(function (m) { return (m.getMovePp() - m.ppUsed) <= 5; }).length; }).length, 3);
            return thresholdPartyMemberCount * 3;
        }, 9),
        new WeightedModifierType(exports.modifierTypes.MAX_ELIXIR, function (party) {
            var thresholdPartyMemberCount = Math.min(party.filter(function (p) { return p.hp && p.getMoveset().filter(function (m) { return (m.getMovePp() - m.ppUsed) <= 5; }).length; }).length, 3);
            return thresholdPartyMemberCount;
        }, 3),
        new WeightedModifierType(exports.modifierTypes.DIRE_HIT, 4),
        new WeightedModifierType(exports.modifierTypes.SUPER_LURE, 4),
        new WeightedModifierType(exports.modifierTypes.NUGGET, 5),
        new WeightedModifierType(exports.modifierTypes.EVOLUTION_ITEM, function (party) {
            return Math.min(Math.ceil(party[0].scene.currentBattle.waveIndex / 15), 8);
        }, 8),
        new WeightedModifierType(exports.modifierTypes.MAP, function (party) { return party[0].scene.gameMode.isClassic ? 1 : 0; }, 1),
        new WeightedModifierType(exports.modifierTypes.TM_GREAT, 2),
        new WeightedModifierType(exports.modifierTypes.MEMORY_MUSHROOM, function (party) {
            if (!party.find(function (p) { return p.getLearnableLevelMoves().length; })) {
                return 0;
            }
            var highestPartyLevel = party.map(function (p) { return p.level; }).reduce(function (highestLevel, level) { return Math.max(highestLevel, level); }, 1);
            return Math.min(Math.ceil(highestPartyLevel / 20), 4);
        }, 4),
        new WeightedModifierType(exports.modifierTypes.BASE_STAT_BOOSTER, 3),
        new WeightedModifierType(exports.modifierTypes.TERA_SHARD, 1),
        new WeightedModifierType(exports.modifierTypes.DNA_SPLICERS, function (party) { return party[0].scene.gameMode.isSplicedOnly && party.filter(function (p) { return !p.fusionSpecies; }).length > 1 ? 4 : 0; }),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.GREAT);
        return m;
    }),
    _a[modifier_tier_1.ModifierTier.ULTRA] = [
        new WeightedModifierType(exports.modifierTypes.ULTRA_BALL, 24),
        new WeightedModifierType(exports.modifierTypes.MAX_LURE, 4),
        new WeightedModifierType(exports.modifierTypes.BIG_NUGGET, 12),
        new WeightedModifierType(exports.modifierTypes.PP_UP, 9),
        new WeightedModifierType(exports.modifierTypes.PP_MAX, 3),
        new WeightedModifierType(exports.modifierTypes.MINT, 4),
        new WeightedModifierType(exports.modifierTypes.RARE_EVOLUTION_ITEM, function (party) { return Math.min(Math.ceil(party[0].scene.currentBattle.waveIndex / 15) * 4, 32); }, 32),
        new WeightedModifierType(exports.modifierTypes.AMULET_COIN, 3),
        new WeightedModifierType(exports.modifierTypes.REVIVER_SEED, 4),
        new WeightedModifierType(exports.modifierTypes.CANDY_JAR, 5),
        new WeightedModifierType(exports.modifierTypes.ATTACK_TYPE_BOOSTER, 10),
        new WeightedModifierType(exports.modifierTypes.TM_ULTRA, 8),
        new WeightedModifierType(exports.modifierTypes.RARER_CANDY, 4),
        new WeightedModifierType(exports.modifierTypes.GOLDEN_PUNCH, 2),
        new WeightedModifierType(exports.modifierTypes.IV_SCANNER, 4),
        new WeightedModifierType(exports.modifierTypes.EXP_CHARM, 8),
        new WeightedModifierType(exports.modifierTypes.EXP_SHARE, 12),
        new WeightedModifierType(exports.modifierTypes.EXP_BALANCE, 4),
        new WeightedModifierType(exports.modifierTypes.TERA_ORB, function (party) { return Math.min(Math.max(Math.floor(party[0].scene.currentBattle.waveIndex / 50) * 2, 1), 4); }, 4),
        new WeightedModifierType(exports.modifierTypes.VOUCHER, function (party, rerollCount) { return !party[0].scene.gameMode.isDaily ? Math.max(3 - rerollCount, 0) : 0; }, 3),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ULTRA);
        return m;
    }),
    _a[modifier_tier_1.ModifierTier.ROGUE] = [
        new WeightedModifierType(exports.modifierTypes.ROGUE_BALL, 24),
        new WeightedModifierType(exports.modifierTypes.RELIC_GOLD, 2),
        new WeightedModifierType(exports.modifierTypes.LEFTOVERS, 3),
        new WeightedModifierType(exports.modifierTypes.SHELL_BELL, 3),
        new WeightedModifierType(exports.modifierTypes.BERRY_POUCH, 4),
        new WeightedModifierType(exports.modifierTypes.GRIP_CLAW, 5),
        new WeightedModifierType(exports.modifierTypes.WIDE_LENS, 4),
        new WeightedModifierType(exports.modifierTypes.BATON, 2),
        new WeightedModifierType(exports.modifierTypes.SOUL_DEW, 8),
        //new WeightedModifierType(modifierTypes.OVAL_CHARM, 6),
        new WeightedModifierType(exports.modifierTypes.SOOTHE_BELL, 4),
        new WeightedModifierType(exports.modifierTypes.ABILITY_CHARM, 6),
        new WeightedModifierType(exports.modifierTypes.FOCUS_BAND, 5),
        new WeightedModifierType(exports.modifierTypes.QUICK_CLAW, 3),
        new WeightedModifierType(exports.modifierTypes.KINGS_ROCK, 3),
        new WeightedModifierType(exports.modifierTypes.LOCK_CAPSULE, 3),
        new WeightedModifierType(exports.modifierTypes.SUPER_EXP_CHARM, 10),
        new WeightedModifierType(exports.modifierTypes.FORM_CHANGE_ITEM, 18),
        new WeightedModifierType(exports.modifierTypes.MEGA_BRACELET, function (party) { return Math.min(Math.ceil(party[0].scene.currentBattle.waveIndex / 50), 4) * 8; }, 32),
        new WeightedModifierType(exports.modifierTypes.DYNAMAX_BAND, function (party) { return Math.min(Math.ceil(party[0].scene.currentBattle.waveIndex / 50), 4) * 8; }, 32),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ROGUE);
        return m;
    }),
    _a[modifier_tier_1.ModifierTier.MASTER] = [
        new WeightedModifierType(exports.modifierTypes.MASTER_BALL, 24),
        new WeightedModifierType(exports.modifierTypes.SHINY_CHARM, 14),
        new WeightedModifierType(exports.modifierTypes.HEALING_CHARM, 18),
        new WeightedModifierType(exports.modifierTypes.MULTI_LENS, 18),
        new WeightedModifierType(exports.modifierTypes.VOUCHER_PLUS, function (party, rerollCount) { return !party[0].scene.gameMode.isDaily ? Math.max(9 - rerollCount * 3, 0) : 0; }, 9),
        new WeightedModifierType(exports.modifierTypes.DNA_SPLICERS, function (party) { return !party[0].scene.gameMode.isSplicedOnly && party.filter(function (p) { return !p.fusionSpecies; }).length > 1 ? 24 : 0; }, 24),
        new WeightedModifierType(exports.modifierTypes.MINI_BLACK_HOLE, function (party) { return party[0].scene.gameData.unlocks[unlockables_1.Unlockables.MINI_BLACK_HOLE] ? 1 : 0; }, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.MASTER);
        return m;
    }),
    _a);
var wildModifierPool = (_b = {},
    _b[modifier_tier_1.ModifierTier.COMMON] = [
        new WeightedModifierType(exports.modifierTypes.BERRY, 1)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.COMMON);
        return m;
    }),
    _b[modifier_tier_1.ModifierTier.GREAT] = [
        new WeightedModifierType(exports.modifierTypes.BASE_STAT_BOOSTER, 1)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.GREAT);
        return m;
    }),
    _b[modifier_tier_1.ModifierTier.ULTRA] = [
        new WeightedModifierType(exports.modifierTypes.ATTACK_TYPE_BOOSTER, 10),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ULTRA);
        return m;
    }),
    _b[modifier_tier_1.ModifierTier.ROGUE] = [
        new WeightedModifierType(exports.modifierTypes.LUCKY_EGG, 4),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ROGUE);
        return m;
    }),
    _b[modifier_tier_1.ModifierTier.MASTER] = [
        new WeightedModifierType(exports.modifierTypes.GOLDEN_EGG, 1)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.MASTER);
        return m;
    }),
    _b);
var trainerModifierPool = (_c = {},
    _c[modifier_tier_1.ModifierTier.COMMON] = [
        new WeightedModifierType(exports.modifierTypes.BERRY, 8),
        new WeightedModifierType(exports.modifierTypes.BASE_STAT_BOOSTER, 3)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.COMMON);
        return m;
    }),
    _c[modifier_tier_1.ModifierTier.GREAT] = [
        new WeightedModifierType(exports.modifierTypes.BASE_STAT_BOOSTER, 3),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.GREAT);
        return m;
    }),
    _c[modifier_tier_1.ModifierTier.ULTRA] = [
        new WeightedModifierType(exports.modifierTypes.ATTACK_TYPE_BOOSTER, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ULTRA);
        return m;
    }),
    _c[modifier_tier_1.ModifierTier.ROGUE] = [
        new WeightedModifierType(exports.modifierTypes.REVIVER_SEED, 2),
        new WeightedModifierType(exports.modifierTypes.FOCUS_BAND, 2),
        new WeightedModifierType(exports.modifierTypes.LUCKY_EGG, 4),
        new WeightedModifierType(exports.modifierTypes.QUICK_CLAW, 1),
        new WeightedModifierType(exports.modifierTypes.GRIP_CLAW, 1),
        new WeightedModifierType(exports.modifierTypes.WIDE_LENS, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ROGUE);
        return m;
    }),
    _c[modifier_tier_1.ModifierTier.MASTER] = [
        new WeightedModifierType(exports.modifierTypes.KINGS_ROCK, 1),
        new WeightedModifierType(exports.modifierTypes.LEFTOVERS, 1),
        new WeightedModifierType(exports.modifierTypes.SHELL_BELL, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.MASTER);
        return m;
    }),
    _c);
var enemyBuffModifierPool = (_d = {},
    _d[modifier_tier_1.ModifierTier.COMMON] = [
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_BOOSTER, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_REDUCTION, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ATTACK_POISON_CHANCE, 2),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ATTACK_PARALYZE_CHANCE, 2),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ATTACK_SLEEP_CHANCE, 2),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ATTACK_FREEZE_CHANCE, 2),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ATTACK_BURN_CHANCE, 2),
        new WeightedModifierType(exports.modifierTypes.ENEMY_STATUS_EFFECT_HEAL_CHANCE, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ENDURE_CHANCE, 5),
        new WeightedModifierType(exports.modifierTypes.ENEMY_FUSED_CHANCE, 1)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.COMMON);
        return m;
    }),
    _d[modifier_tier_1.ModifierTier.GREAT] = [
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_BOOSTER, 5),
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_REDUCTION, 5),
        new WeightedModifierType(exports.modifierTypes.ENEMY_STATUS_EFFECT_HEAL_CHANCE, 5),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ENDURE_CHANCE, 5),
        new WeightedModifierType(exports.modifierTypes.ENEMY_FUSED_CHANCE, 1)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.GREAT);
        return m;
    }),
    _d[modifier_tier_1.ModifierTier.ULTRA] = [
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_BOOSTER, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_DAMAGE_REDUCTION, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_HEAL, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_STATUS_EFFECT_HEAL_CHANCE, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_ENDURE_CHANCE, 10),
        new WeightedModifierType(exports.modifierTypes.ENEMY_FUSED_CHANCE, 5)
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ULTRA);
        return m;
    }),
    _d[modifier_tier_1.ModifierTier.ROGUE] = [].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ROGUE);
        return m;
    }),
    _d[modifier_tier_1.ModifierTier.MASTER] = [].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.MASTER);
        return m;
    }),
    _d);
var dailyStarterModifierPool = (_e = {},
    _e[modifier_tier_1.ModifierTier.COMMON] = [
        new WeightedModifierType(exports.modifierTypes.BASE_STAT_BOOSTER, 1),
        new WeightedModifierType(exports.modifierTypes.BERRY, 3),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.COMMON);
        return m;
    }),
    _e[modifier_tier_1.ModifierTier.GREAT] = [
        new WeightedModifierType(exports.modifierTypes.ATTACK_TYPE_BOOSTER, 5),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.GREAT);
        return m;
    }),
    _e[modifier_tier_1.ModifierTier.ULTRA] = [
        new WeightedModifierType(exports.modifierTypes.REVIVER_SEED, 4),
        new WeightedModifierType(exports.modifierTypes.SOOTHE_BELL, 1),
        new WeightedModifierType(exports.modifierTypes.SOUL_DEW, 1),
        new WeightedModifierType(exports.modifierTypes.GOLDEN_PUNCH, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ULTRA);
        return m;
    }),
    _e[modifier_tier_1.ModifierTier.ROGUE] = [
        new WeightedModifierType(exports.modifierTypes.GRIP_CLAW, 5),
        new WeightedModifierType(exports.modifierTypes.BATON, 2),
        new WeightedModifierType(exports.modifierTypes.FOCUS_BAND, 5),
        new WeightedModifierType(exports.modifierTypes.QUICK_CLAW, 3),
        new WeightedModifierType(exports.modifierTypes.KINGS_ROCK, 3),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.ROGUE);
        return m;
    }),
    _e[modifier_tier_1.ModifierTier.MASTER] = [
        new WeightedModifierType(exports.modifierTypes.LEFTOVERS, 1),
        new WeightedModifierType(exports.modifierTypes.SHELL_BELL, 1),
    ].map(function (m) {
        m.setTier(modifier_tier_1.ModifierTier.MASTER);
        return m;
    }),
    _e);
function getModifierType(modifierTypeFunc) {
    var modifierType = modifierTypeFunc();
    if (!modifierType.id) {
        modifierType.id = Object.keys(exports.modifierTypes).find(function (k) { return exports.modifierTypes[k] === modifierTypeFunc; });
    }
    return modifierType;
}
exports.getModifierType = getModifierType;
var modifierPoolThresholds = {};
var ignoredPoolIndexes = {};
var dailyStarterModifierPoolThresholds = {};
var ignoredDailyStarterPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
var enemyModifierPoolThresholds = {};
var enemyIgnoredPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
var enemyBuffModifierPoolThresholds = {};
var enemyBuffIgnoredPoolIndexes = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
function getModifierPoolForType(poolType) {
    var pool;
    switch (poolType) {
        case ModifierPoolType.PLAYER:
            pool = modifierPool;
            break;
        case ModifierPoolType.WILD:
            pool = wildModifierPool;
            break;
        case ModifierPoolType.TRAINER:
            pool = trainerModifierPool;
            break;
        case ModifierPoolType.ENEMY_BUFF:
            pool = enemyBuffModifierPool;
            break;
        case ModifierPoolType.DAILY_STARTER:
            pool = dailyStarterModifierPool;
            break;
    }
    return pool;
}
exports.getModifierPoolForType = getModifierPoolForType;
var tierWeights = [769 / 1024, 192 / 1024, 48 / 1024, 12 / 1024, 1 / 1024];
function regenerateModifierPoolThresholds(party, poolType, rerollCount) {
    if (rerollCount === void 0) { rerollCount = 0; }
    var pool = getModifierPoolForType(poolType);
    var ignoredIndexes = {};
    var modifierTableData = {};
    var thresholds = Object.fromEntries(new Map(Object.keys(pool).map(function (t) {
        ignoredIndexes[t] = [];
        var thresholds = new Map();
        var tierModifierIds = [];
        var tierMaxWeight = 0;
        var i = 0;
        pool[t].reduce(function (total, modifierType) {
            var weightedModifierType = modifierType;
            var existingModifiers = party[0].scene.findModifiers(function (m) { return (m.type.generatorId || m.type.id) === weightedModifierType.modifierType.id; }, poolType === ModifierPoolType.PLAYER);
            var itemModifierType = weightedModifierType.modifierType instanceof ModifierTypeGenerator
                ? weightedModifierType.modifierType.generateType(party)
                : weightedModifierType.modifierType;
            var weight = !existingModifiers.length
                || itemModifierType instanceof PokemonHeldItemModifierType
                || itemModifierType instanceof FormChangeItemModifierType
                || existingModifiers.find(function (m) { return m.stackCount < m.getMaxStackCount(party[0].scene, true); })
                ? weightedModifierType.weight instanceof Function
                    ? weightedModifierType.weight(party, rerollCount)
                    : weightedModifierType.weight
                : 0;
            if (weightedModifierType.maxWeight) {
                var modifierId = weightedModifierType.modifierType.generatorId || weightedModifierType.modifierType.id;
                tierModifierIds.push(modifierId);
                var outputWeight = useMaxWeightForOutput ? weightedModifierType.maxWeight : weight;
                modifierTableData[modifierId] = { weight: outputWeight, tier: parseInt(t), tierPercent: 0, totalPercent: 0 };
                tierMaxWeight += outputWeight;
            }
            if (weight) {
                total += weight;
            }
            else {
                ignoredIndexes[t].push(i++);
                return total;
            }
            thresholds.set(total, i++);
            return total;
        }, 0);
        for (var _i = 0, tierModifierIds_1 = tierModifierIds; _i < tierModifierIds_1.length; _i++) {
            var id = tierModifierIds_1[_i];
            modifierTableData[id].tierPercent = Math.floor((modifierTableData[id].weight / tierMaxWeight) * 10000) / 100;
        }
        return [t, Object.fromEntries(thresholds)];
    })));
    for (var _i = 0, _a = Object.keys(modifierTableData); _i < _a.length; _i++) {
        var id = _a[_i];
        modifierTableData[id].totalPercent = Math.floor(modifierTableData[id].tierPercent * tierWeights[modifierTableData[id].tier] * 100) / 100;
        modifierTableData[id].tier = modifier_tier_1.ModifierTier[modifierTableData[id].tier];
    }
    if (outputModifierData) {
        console.table(modifierTableData);
    }
    switch (poolType) {
        case ModifierPoolType.PLAYER:
            modifierPoolThresholds = thresholds;
            ignoredPoolIndexes = ignoredIndexes;
            break;
        case ModifierPoolType.WILD:
        case ModifierPoolType.TRAINER:
            enemyModifierPoolThresholds = thresholds;
            enemyIgnoredPoolIndexes = ignoredIndexes;
            break;
        case ModifierPoolType.ENEMY_BUFF:
            enemyBuffModifierPoolThresholds = thresholds;
            enemyBuffIgnoredPoolIndexes = ignoredIndexes;
            break;
        case ModifierPoolType.DAILY_STARTER:
            dailyStarterModifierPoolThresholds = thresholds;
            ignoredDailyStarterPoolIndexes = ignoredIndexes;
            break;
    }
}
exports.regenerateModifierPoolThresholds = regenerateModifierPoolThresholds;
function getModifierTypeFuncById(id) {
    return exports.modifierTypes[id];
}
exports.getModifierTypeFuncById = getModifierTypeFuncById;
function getPlayerModifierTypeOptions(count, party, modifierTiers) {
    var options = [];
    var retryCount = Math.min(count * 5, 50);
    new Array(count).fill(0).map(function (_, i) {
        var candidate = getNewModifierTypeOption(party, ModifierPoolType.PLAYER, (modifierTiers === null || modifierTiers === void 0 ? void 0 : modifierTiers.length) > i ? modifierTiers[i] : undefined);
        var r = 0;
        while (options.length && ++r < retryCount && options.filter(function (o) { return o.type.name === candidate.type.name || o.type.group === candidate.type.group; }).length) {
            candidate = getNewModifierTypeOption(party, ModifierPoolType.PLAYER, candidate.type.tier, candidate.upgradeCount);
        }
        options.push(candidate);
    });
    return options;
}
exports.getPlayerModifierTypeOptions = getPlayerModifierTypeOptions;
function getPlayerShopModifierTypeOptionsForWave(waveIndex, baseCost) {
    if (!(waveIndex % 10)) {
        return [];
    }
    var options = [
        [
            new ModifierTypeOption(exports.modifierTypes.POTION(), 0, baseCost * 0.2),
            new ModifierTypeOption(exports.modifierTypes.ETHER(), 0, baseCost * 0.4),
            new ModifierTypeOption(exports.modifierTypes.REVIVE(), 0, baseCost * 2)
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.SUPER_POTION(), 0, baseCost * 0.45),
            new ModifierTypeOption(exports.modifierTypes.FULL_HEAL(), 0, baseCost),
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.ELIXIR(), 0, baseCost),
            new ModifierTypeOption(exports.modifierTypes.MAX_ETHER(), 0, baseCost)
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.HYPER_POTION(), 0, baseCost * 0.8),
            new ModifierTypeOption(exports.modifierTypes.MAX_REVIVE(), 0, baseCost * 2.75)
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.MAX_POTION(), 0, baseCost * 1.5),
            new ModifierTypeOption(exports.modifierTypes.MAX_ELIXIR(), 0, baseCost * 2.5)
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.FULL_RESTORE(), 0, baseCost * 2.25)
        ],
        [
            new ModifierTypeOption(exports.modifierTypes.SACRED_ASH(), 0, baseCost * 10)
        ]
    ];
    return options.slice(0, Math.ceil(Math.max(waveIndex + 10, 0) / 30)).flat();
}
exports.getPlayerShopModifierTypeOptionsForWave = getPlayerShopModifierTypeOptionsForWave;
function getEnemyBuffModifierForWave(tier, enemyModifiers, scene) {
    var tierStackCount = tier === modifier_tier_1.ModifierTier.ULTRA ? 5 : tier === modifier_tier_1.ModifierTier.GREAT ? 3 : 1;
    var retryCount = 50;
    var candidate = getNewModifierTypeOption(null, ModifierPoolType.ENEMY_BUFF, tier);
    var r = 0;
    var matchingModifier;
    while (++r < retryCount && (matchingModifier = enemyModifiers.find(function (m) { return m.type.id === candidate.type.id; })) && matchingModifier.getMaxStackCount(scene) < matchingModifier.stackCount + (r < 10 ? tierStackCount : 1)) {
        candidate = getNewModifierTypeOption(null, ModifierPoolType.ENEMY_BUFF, tier);
    }
    var modifier = candidate.type.newModifier();
    modifier.stackCount = tierStackCount;
    return modifier;
}
exports.getEnemyBuffModifierForWave = getEnemyBuffModifierForWave;
function getEnemyModifierTypesForWave(waveIndex, count, party, poolType, upgradeChance) {
    if (upgradeChance === void 0) { upgradeChance = 0; }
    var ret = new Array(count).fill(0).map(function () { return getNewModifierTypeOption(party, poolType, undefined, upgradeChance && !Utils.randSeedInt(upgradeChance) ? 1 : 0).type; });
    if (!(waveIndex % 1000)) {
        ret.push(getModifierType(exports.modifierTypes.MINI_BLACK_HOLE));
    }
    return ret;
}
exports.getEnemyModifierTypesForWave = getEnemyModifierTypesForWave;
function getDailyRunStarterModifiers(party) {
    var ret = [];
    for (var _i = 0, party_1 = party; _i < party_1.length; _i++) {
        var p = party_1[_i];
        for (var m = 0; m < 3; m++) {
            var tierValue = Utils.randSeedInt(64);
            var tier = tierValue > 25 ? modifier_tier_1.ModifierTier.COMMON : tierValue > 12 ? modifier_tier_1.ModifierTier.GREAT : tierValue > 4 ? modifier_tier_1.ModifierTier.ULTRA : tierValue ? modifier_tier_1.ModifierTier.ROGUE : modifier_tier_1.ModifierTier.MASTER;
            var modifier = getNewModifierTypeOption(party, ModifierPoolType.DAILY_STARTER, tier).type.newModifier(p);
            ret.push(modifier);
        }
    }
    return ret;
}
exports.getDailyRunStarterModifiers = getDailyRunStarterModifiers;
function getNewModifierTypeOption(party, poolType, tier, upgradeCount, retryCount) {
    if (retryCount === void 0) { retryCount = 0; }
    var player = !poolType;
    var pool = getModifierPoolForType(poolType);
    var thresholds;
    switch (poolType) {
        case ModifierPoolType.PLAYER:
            thresholds = modifierPoolThresholds;
            break;
        case ModifierPoolType.WILD:
            thresholds = enemyModifierPoolThresholds;
            break;
        case ModifierPoolType.TRAINER:
            thresholds = enemyModifierPoolThresholds;
            break;
        case ModifierPoolType.ENEMY_BUFF:
            thresholds = enemyBuffModifierPoolThresholds;
            break;
        case ModifierPoolType.DAILY_STARTER:
            thresholds = dailyStarterModifierPoolThresholds;
            break;
    }
    if (tier === undefined) {
        var tierValue = Utils.randSeedInt(1024);
        if (!upgradeCount) {
            upgradeCount = 0;
        }
        if (player && tierValue) {
            var partyLuckValue = getPartyLuckValue(party);
            var upgradeOdds = Math.floor(128 / ((partyLuckValue + 4) / 4));
            var upgraded = false;
            do {
                upgraded = Utils.randSeedInt(upgradeOdds) < 4;
                if (upgraded) {
                    upgradeCount++;
                }
            } while (upgraded);
        }
        tier = tierValue > 255 ? modifier_tier_1.ModifierTier.COMMON : tierValue > 60 ? modifier_tier_1.ModifierTier.GREAT : tierValue > 12 ? modifier_tier_1.ModifierTier.ULTRA : tierValue ? modifier_tier_1.ModifierTier.ROGUE : modifier_tier_1.ModifierTier.MASTER;
        // Does this actually do anything?
        if (!upgradeCount) {
            upgradeCount = Math.min(upgradeCount, modifier_tier_1.ModifierTier.MASTER - tier);
        }
        tier += upgradeCount;
        while (tier && (!modifierPool.hasOwnProperty(tier) || !modifierPool[tier].length)) {
            tier--;
            if (upgradeCount) {
                upgradeCount--;
            }
        }
    }
    else if (upgradeCount === undefined && player) {
        upgradeCount = 0;
        if (tier < modifier_tier_1.ModifierTier.MASTER) {
            var partyShinyCount = party.filter(function (p) { return p.isShiny() && !p.isFainted(); }).length;
            var upgradeOdds = Math.floor(32 / ((partyShinyCount + 2) / 2));
            while (modifierPool.hasOwnProperty(tier + upgradeCount + 1) && modifierPool[tier + upgradeCount + 1].length) {
                if (!Utils.randSeedInt(upgradeOdds)) {
                    upgradeCount++;
                }
                else {
                    break;
                }
            }
            tier += upgradeCount;
        }
    }
    else if (retryCount === 10 && tier) {
        retryCount = 0;
        tier--;
    }
    var tierThresholds = Object.keys(thresholds[tier]);
    var totalWeight = parseInt(tierThresholds[tierThresholds.length - 1]);
    var value = Utils.randSeedInt(totalWeight);
    var index;
    for (var _i = 0, tierThresholds_1 = tierThresholds; _i < tierThresholds_1.length; _i++) {
        var t = tierThresholds_1[_i];
        var threshold = parseInt(t);
        if (value < threshold) {
            index = thresholds[tier][threshold];
            break;
        }
    }
    if (index === undefined) {
        return null;
    }
    if (player) {
        console.log(index, ignoredPoolIndexes[tier].filter(function (i) { return i <= index; }).length, ignoredPoolIndexes[tier]);
    }
    var modifierType = (pool[tier][index]).modifierType;
    if (modifierType instanceof ModifierTypeGenerator) {
        modifierType = modifierType.generateType(party);
        if (modifierType === null) {
            if (player) {
                console.log(modifier_tier_1.ModifierTier[tier], upgradeCount);
            }
            return getNewModifierTypeOption(party, poolType, tier, upgradeCount, ++retryCount);
        }
    }
    console.log(modifierType, !player ? "(enemy)" : "");
    return new ModifierTypeOption(modifierType, upgradeCount);
}
function getDefaultModifierTypeForTier(tier) {
    var modifierType = modifierPool[tier || modifier_tier_1.ModifierTier.COMMON][0];
    if (modifierType instanceof WeightedModifierType) {
        modifierType = modifierType.modifierType;
    }
    return modifierType;
}
exports.getDefaultModifierTypeForTier = getDefaultModifierTypeForTier;
var ModifierTypeOption = /** @class */ (function () {
    function ModifierTypeOption(type, upgradeCount, cost) {
        if (cost === void 0) { cost = 0; }
        this.type = type;
        this.upgradeCount = upgradeCount;
        this.cost = Math.min(Math.round(cost), Number.MAX_SAFE_INTEGER);
    }
    return ModifierTypeOption;
}());
exports.ModifierTypeOption = ModifierTypeOption;
function getPartyLuckValue(party) {
    return Phaser.Math.Clamp(party.map(function (p) { return p.isFainted() ? 0 : p.getLuck(); })
        .reduce(function (total, value) { return total += value; }, 0), 0, 14);
}
exports.getPartyLuckValue = getPartyLuckValue;
function getLuckString(luckValue) {
    return ["D", "C", "C+", "B-", "B", "B+", "A-", "A", "A+", "A++", "S", "S+", "SS", "SS+", "SSS"][luckValue];
}
exports.getLuckString = getLuckString;
function getLuckTextTint(luckValue) {
    var modifierTier = luckValue ? luckValue > 2 ? luckValue > 5 ? luckValue > 9 ? luckValue > 11 ? modifier_tier_1.ModifierTier.LUXURY : modifier_tier_1.ModifierTier.MASTER : modifier_tier_1.ModifierTier.ROGUE : modifier_tier_1.ModifierTier.ULTRA : modifier_tier_1.ModifierTier.GREAT : modifier_tier_1.ModifierTier.COMMON;
    return (0, text_1.getModifierTierTextTint)(modifierTier);
}
exports.getLuckTextTint = getLuckTextTint;
