class PokemonDataExtractor {
    constructor() {
        // this.pokeInfoPath = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[2].list;
        // this.pokeInfoPath = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.renderer.currentMask.camera.renderList[0].scene.sys.make.displayList.list;
        // this.pokeInfoPath = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.renderer.currentMask.camera.renderList[0].scene.sys.make.displayList.list[2].list;
        this.pokeInfoPath = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[2].list;  // Returns the current visible pokemon
        // this.pokeInfoPath = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[2].list[6].battleInfo.parentContainer.list;
    }

    getPokemonData(pokemon) {
        return {
            name: pokemon.species.name,
            passive: pokemon.passive,
            shiny: pokemon.shiny,
            luck: pokemon.luck,
            level: pokemon.level,
            levelExp: pokemon.levelExp,
            ivs: pokemon.ivs,
            hp: pokemon.hp,
            gender: pokemon.gender,
            pokerus: pokemon.pokerus,
            shinySparkle: pokemon.shiny ? pokemon.shinySparkle.frame.texture.key : null,
            stats: pokemon.stats,
            turnData: {
                attacksReceived: pokemon.turnData.attacksReceived,
                currDamageDealt: pokemon.turnData.currDamageDealt,
                damageDealt: pokemon.turnData.damageDealt,
                damageTaken: pokemon.turnData.damageTaken
            },
            battleData: {
                abilitiesApplied: pokemon.battleData.abilitiesApplied,
                berriesEaten: pokemon.battleData.berriesEaten,
                endured: pokemon.battleData.endured,
                hitCount: pokemon.battleData.hitCount
            },
            moveset: pokemon.moveset.map(move => ({
                moveId: move.moveId,
                ppUp: move.ppUp,
                ppUsed: move.ppUsed,
                virtual: move.virtual
            })),
            species: {
                ability1: pokemon.species.ability1,
                ability2: pokemon.species.ability2,
                abilityHidden: pokemon.species.abilityHidden,
                baseExp: pokemon.species.baseExp,
                baseFriendship: pokemon.species.baseFriendship,
                baseStats: pokemon.species.baseStats,
                baseTotal: pokemon.species.baseTotal,
                canChangeForm: pokemon.species.canChangeForm,
                catchRate: pokemon.species.catchRate,
                formIndex: pokemon.species.formIndex,
                forms: pokemon.species.forms,
                genderDiffs: pokemon.species.genderDiffs,
                generation: pokemon.species.generation,
                growthRate: pokemon.species.growthRate,
                height: pokemon.species.height,
                legendary: pokemon.species.legendary,
                malePercent: pokemon.species.malePercent,
                mythical: pokemon.species.mythical,
                name: pokemon.species.name,
                species: pokemon.species.species,
                speciesId: pokemon.species.speciesId,
                subLegendary: pokemon.species.subLegendary,
                type1: pokemon.species.type1,
                type2: pokemon.species.type2,
                weight: pokemon.species.weight
            }
        };
    }

    extractData() {
        // Identify the Pokemon objects by their constructor names
        const allPokemon = this.pokeInfoPath.filter(child => {
            const isEnemyPokemon = child.constructor.name === 'EnemyPokemon';
            const isPlayerPokemon = child.constructor.name === 'PlayerPokemon';
            return isEnemyPokemon || isPlayerPokemon;
        });

        const enemyPokemons = allPokemon.filter(pokemon => pokemon.constructor.name === 'EnemyPokemon');
        const myPokemons = allPokemon.filter(pokemon => pokemon.constructor.name === 'PlayerPokemon');

        const allPokemonData = {
            enemyPokemons: enemyPokemons.map(pokemon => this.getPokemonData(pokemon)),
            myPokemons: myPokemons.map(pokemon => this.getPokemonData(pokemon))
        };

        console.log(JSON.stringify(allPokemonData, null, 2));
    }
}

const dataExtractor = new PokemonDataExtractor();
dataExtractor.extractData();