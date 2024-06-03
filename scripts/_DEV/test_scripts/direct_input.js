// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set home menu cursor (0 = Continue, 1 = New, 2 = Load, 3 = Daily)
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set battle / skill cursor (0 = Battle, 1 = Ball, 2 = Pokemon, 3 = Flee)

// To get the list of battle options to select the correct index
// Array.isArray(Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[6].list) ? Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[6].list.filter(obj => obj.constructor.name === 'Text').map(obj => obj._text) : [];

// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[7].list.map(obj => obj._text)  // To get the list of skills to select the correct index

// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set switch cursor (0 = yes, 1 = no)
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set ball cursor (0 = poke, 1 = super, 2 = hyper, 3 = rogue, 4 = master, 5 = cancel)
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set pokemon cursor (0 = slot 1, 1 = slot 2, 2 = slot 3, 3 = slot 4, 4 = slot 5, 5 = slot 6)
// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[2].setCursor(0)  // set pokemon selected cursor (0 = send, 1 = summary, 2 = cancel)

// Function to simulate pressing a key
function pressKey(keyCode) {
    // Create a new keyboard event for the key down
    let keyDownEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        keyCode: keyCode,
        code: `Key${String.fromCharCode(keyCode)}`,
        key: String.fromCharCode(keyCode).toLowerCase(),
    });

    // Create a new keyboard event for the key up
    let keyUpEvent = new KeyboardEvent("keyup", {
        bubbles: true,
        cancelable: true,
        keyCode: keyCode,
        code: `Key${String.fromCharCode(keyCode)}`,
        key: String.fromCharCode(keyCode).toLowerCase(),
    });

    // Dispatch the keydown event to simulate pressing the key
    document.dispatchEvent(keyDownEvent);

    // Use a timeout to simulate the keyup event shortly after the keydown event
    setTimeout(() => {
        document.dispatchEvent(keyUpEvent);
    }, 100); // Adjust the delay as needed (100ms in this example)
}

// Example usage: Simulate pressing the space key
pressKey(Phaser.Input.Keyboard.KeyCodes.SPACE);




// Function to get the list of pokeballs to get the index from the list with the ammounts
// Access the text values
const pokeballTypesText = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[16].list[1]._text;
const pokeballAmountsText = Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[16].list[2]._text;

// Split the text into arrays
const pokeballTypes = pokeballTypesText.split('\n');
const pokeballAmounts = pokeballAmountsText.split('\n');

// Generate the list of dictionaries
const pokeballList = pokeballTypes.map((type, index) => {
    if (pokeballAmounts[index] && pokeballAmounts[index].startsWith('x')) {
        const sanitizedType = type.replace('é', 'e').toLowerCase();
        const amount = parseInt(pokeballAmounts[index].substring(1)); // Remove 'x' and convert to number
        return { [sanitizedType]: amount };
    } else {
        console.warn(`Amount for ${type} is missing or invalid.`);
        return null;
    }
}).filter(item => item !== null); // Remove any null entries

console.log(pokeballList);


// Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.keys.battle.sys.cameras.cameras[0].renderList[0].displayList.list[8].list[3].list[22].list[1].list.map(obj => obj.pokemon.name)  // To get list with indexes of switch pokemon