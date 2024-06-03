import json

NEEDED = ['Phaser', 'gameInfo']  # Phaser holds all the scene data and gameInfo just holds basic team infos
"""
Enemy Poke Info: Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[2].list[5]
My Poke Info: Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[2].list[6]
If there are 4 pokemon, the first two are the enemys starting from the left and the second to are my own
Enenemys Class name is `Ek`, my pokemon are `hk`

# Stuff to grab from fight scene

# parse Pokemon
name: "Glumanda"
passive: false
shiny:  true
luck: 3
level: 5
levelExp: 0
ivs: (6) [31, 31, 31, 31, 31, 31]
hp: 20
gender: 0 (== Male)
pokerus: false
shinySparkle.frame.texture.key (== shiny_3)
stats: (6) [20, 11, 10, 12, 11, 13]

turnData: Ok
  attacksReceived: []
  currDamageDealt: 0
  damageDealt: 0
  damageTaken: 0

battleData: dk
  abilitiesApplied: []
  berriesEaten: []
  endured: false
  hitCount: 0

moveset: Array(4)
  0: zp
    moveId: 10
    ppUp: 0
    ppUsed: 0
    virtual: false
  1: zp
    moveId: 45
    ppUp: 0
    ppUsed: 0
    virtual: false
  2: zp
    moveId: 52
    ppUp: 0
    ppUsed: 0
    virtual: false
  3: zp
    moveId: 349
    ppUp: 0
    ppUsed: 0
    virtual: false
species: _y
  ability1: 66
  ability2: 0
  abilityHidden: 94
  baseExp: 62
  baseFriendship: 50
  baseStats: (6) [39, 52, 43, 60, 50, 65]
  baseTotal: 309
  canChangeForm: false
  catchRate: 45
  formIndex: 0
  forms: []
  genderDiffs: false
  generation: 1
  growthRate: 3
  height: 0.6
  legendary: false
  malePercent: 87.5
  mythical: false
  name: "Glumanda"
  species: "Lizard Pokémon"
  speciesId: 4
  subLegendary: false
  type1: 9 (Fire?)
  type2: null
  weight: 8.5

Contains everything, like if its shiny, moves, stats etc, i need to write a dedicated parser for this object to quickly extract the current game state,
also extract the current select object etc to select pokemon and actions.

This is the bottom bar text, if its not a empty string, the bar will be shown
# Home screen (can be ignored, since we are waiting for the login inputs anyway)
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input._tempHitTest[0].scene.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].list[3].list[0]._text
# After Login
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[8].list[2].list[3].list[0]._text
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[8].list[2].list[3].list[0]._text
#IG
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.displayList.list[8].list[2].list[3].list[0]._text

# Select Options
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].list[6].list[0]._text (Fight)
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].list[6].list[1]._text (Ball)
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].list[6].list[2]._text (Pokemon)
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].list[6].list[3]._text (Flee)

# Account stats
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameData.gameStats
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameData.eggs
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameData.starterData
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameData.voucherCounts
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameMode
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.gameSpeed
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.pokeballCounts
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.input.pointers[0].camera.renderList[0].scene.sys.make.scene.trainer.scene.waveCountText._text

# Pause the game
Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.isPaused = true
"""

def get_js_objects(driver, search_keys):
    # Define the JavaScript to get the specific objects
    jss = f'''
    const searchKeys = {json.dumps(search_keys)};

    const results = {{}};

    function getCircularReplacer() {{
      const seen = new WeakSet();
      return (key, value) => {{
        if (typeof value === "object" && value !== null) {{
          if (seen.has(value)) {{
            return;
          }}
          seen.add(value);
        }}
        return value;
      }};
    }}

    function cleanObject(obj, seen = new WeakSet()) {{
      if (typeof obj !== "object" || obj === null || seen.has(obj)) {{
        return obj;
      }}

      seen.add(obj);

      if (Array.isArray(obj)) {{
        return obj.map(item => cleanObject(item, seen));
      }}

      const cleanObj = {{}};
      for (const key in obj) {{
        if (Object.prototype.hasOwnProperty.call(obj, key)) {{
          try {{
            const value = obj[key];
            if (typeof value === 'object' && value !== null) {{
              cleanObj[key] = cleanObject(value, seen);
            }} else if (typeof value !== 'function') {{
              cleanObj[key] = value;
            }}
          }} catch (err) {{
            console.error(`Error processing ${{key}}:`, err);
          }}
        }}
      }}
      return cleanObj;
    }}

    function searchObject(obj, path = "window", seen = new WeakSet()) {{
      if (typeof obj !== "object" || obj === null || seen.has(obj)) {{
        return;
      }}

      seen.add(obj);

      for (const key in obj) {{
        if (Object.prototype.hasOwnProperty.call(obj, key)) {{
          const value = obj[key];
          const currentPath = Array.isArray(obj) ? `${{path}}[${{key}}]` : `${{path}}.${{key}}`;

          if (searchKeys.includes(key)) {{
            try {{
              results[currentPath] = cleanObject(value);
            }} catch (err) {{
              console.error(`Error processing ${{currentPath}}:`, err);
            }}
          }}

          if (typeof value === "object" && value !== null) {{
            searchObject(value, currentPath, seen);
          }}
        }}
      }}
    }}

    try {{
      searchObject(window);
      return JSON.stringify(results, getCircularReplacer());
    }} catch (err) {{
      console.error('Error during searchObject execution:', err);
      return JSON.stringify({{ error: err.toString() }});
    }}
    '''

    # Execute the script and get the result
    js_data = driver.execute_script(jss)

    # Convert the JSON string to a Python dictionary
    data = json.loads(js_data)

    return data
