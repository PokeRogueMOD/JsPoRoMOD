import { EGG_SEED } from '../constants/eggSeed.js';
import { EggTier } from '../constants/eggTiers.js';

export class Egg {
    constructor(id, gachaType, hatchWaves, timestamp) {
        this.id = id;
        this.tier = Math.floor(id / EGG_SEED);
        this.gachaType = gachaType;
        this.hatchWaves = hatchWaves;
        this.timestamp = timestamp;
    }

    isManaphyEgg() {
        return this.tier === EggTier.COMMON && !(this.id % 255);
    }

    getKey() {
        if (this.isManaphyEgg()) {
            return 'manaphy';
        }
        return this.tier.toString();
    }
}

function getIdRange(tier) {
    const start = tier * EGG_SEED;
    const end = (tier + 1) * EGG_SEED - 1;
    return [start || 255, end];
}

function getRandomIdInRange(start, end, isManaphy = false) {
    if (isManaphy) {
        return Math.floor(Math.random() * ((end - start) / 255)) * 255 + start;
    } else {
        let result = Math.floor(Math.random() * (end - start + 1)) + start;
        result = result % 255 !== 0 ? result : result - 1;
        return result > 0 ? result : 1;
    }
}

export function* generateEggs(tier, gachaType, hatchWaves) {
    const isManaphy = tier === EggTier.MANAPHY;
    const [start, end] = getIdRange(isManaphy ? EggTier.COMMON : tier);

    while (true) {
        const eggId = getRandomIdInRange(start, end, isManaphy);
        const timestamp = Date.now();

        yield new Egg(eggId, gachaType, hatchWaves, timestamp);
    }
}
