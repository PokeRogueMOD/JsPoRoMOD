// main.js

// ----------------------------------
//  Required Modules
// ----------------------------------
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const globals = require("./globals");
const discordRPCs = require("./discord_rpc");
const localShortcuts = require("./local_shortcuts");
const utils = require("./utils");

// The code from your File tab (and others) will still be required and used
// e.g. const { getTabData, downloadLatestGameFiles } = require("./file_tab");
// or wherever else it's needed.

utils.updateMenu(); // Keep your original call

// ----------------------------------
//  Function to Fetch Remote Mod
// ----------------------------------
function fetchRemoteMod(modUrl, savePath) {
  return new Promise((resolve, reject) => {
    https.get(modUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download mod. Status code: ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(savePath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close(() => {
          resolve();
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// ----------------------------------
//  Create Main Window
// ----------------------------------
function createWindow() {
  // Attempt to fetch your JS mod first, then proceed
  const modUrl = 'https://raw.githubusercontent.com/PokeRogueMOD/JsPoRoMOD/refs/heads/main/js-poro-mod/mod.min.js';
  const userDataPath = app.getPath('userData');
  const localModPath = path.join(userDataPath, 'mod.min.js');

  // We'll fetch the mod asynchronously, but we won't block creating the window.
  // If you want to wait for it before loading the game, move the window creation
  // *inside* the .then() chain. For now, let's just do them in parallel.

  fetchRemoteMod(modUrl, localModPath)
    .then(() => {
      console.log("[Mod] Fetched/updated mod successfully.");
    })
    .catch(err => {
      console.warn("[Mod] Could not update mod:", err.message);
      console.warn("[Mod] Will use existing file if it exists.");
    });

  // Now create your main BrowserWindow (same as your original code)
  globals.mainWindow = new BrowserWindow({
    width: 1280,
    height: 749,
    autoHideMenuBar: true,
    menuBarVisible: false,
    icon: 'icons/PR',
    show: false // we reveal it later after load
  });

  // Register shortcuts and do the standard stuff
  localShortcuts.registerLocalShortcuts();
  utils.loadSettings();
  utils.applyDarkMode();
  utils.applyCursorHide();
  utils.updateMenu();

  // Save settings on close
  globals.mainWindow.on('close', () => {
    utils.saveSettings();
  });

  // Clean up other windows when the main window closes
  globals.mainWindow.on('closed', async () => {
    globals.mainWindow = null;

    if (globals.wikiWindow) {
      globals.wikiWindow.close();
      globals.wikiWindow = null;
    }
    if (globals.pokedexWindow) {
      globals.pokedexWindow.close();
      globals.pokedexWindow = null;
    }
    if (globals.typeChartWindow) {
      globals.typeChartWindow.close();
      globals.typeChartWindow = null;
    }
    if (globals.horizontalTypeChartWindow) {
      globals.horizontalTypeChartWindow.close();
      globals.horizontalTypeChartWindow = null;
    }
    if (globals.typeCalculatorWindow) {
      globals.typeCalculatorWindow.close();
      globals.typeCalculatorWindow = null;
    }
    if (globals.teamBuilderWindow) {
      globals.teamBuilderWindow.close();
      globals.teamBuilderWindow = null;
    }
    if (globals.smogonWindow) {
      globals.smogonWindow.close();
      globals.smogonWindow = null;
    }

    app.quit();
  });

  // Set up Discord RPC if needed
  discordRPCs.setup();

  // Offline or Online loading (same as original)
  if (globals.isOfflineMode) {
    void globals.mainWindow.loadFile(path.join(globals.gameDir, 'index.html'));
  } else if (globals.isBeta) {
    void globals.mainWindow.loadURL('https://beta.pokerogue.net/');
  } else if (globals.isPRMLMode) {
    void globals.mainWindow.loadURL('https://mokerogue.net/');
  } else {
    void globals.mainWindow.loadURL('https://pokerogue.net/');
  }

  // Once the page is loaded, fix resolution, show window, and inject your mod
  globals.mainWindow.webContents.on('did-finish-load', () => {
    // Original resolution and showing logic
    if (globals.onStart) {
      const gameWidth = 1280;
      const gameHeight = 770;
      setTimeout(() => {
        globals.mainWindow.setSize(gameWidth, 769);
        globals.mainWindow.setSize(gameWidth, gameHeight);
        globals.mainWindow.show();

        // Reload settings after the game is displayed
        utils.loadSettings();
        globals.mainWindow.center();
        globals.onStart = false;
      }, 100);
    }

    // Example: remove an element
    void globals.mainWindow.webContents.executeJavaScript(`
      setTimeout(() => {
        var tncLinks = document.getElementById('tnc-links');
        if (tncLinks) {
          tncLinks.remove();
        }
      }, 30);
    `);

    // Finally, inject your downloaded mod if it exists
    if (fs.existsSync(localModPath)) {
      const modCode = fs.readFileSync(localModPath, 'utf8');
      globals.mainWindow.webContents.executeJavaScript(modCode)
        .then(() => {
          console.log("[Mod] Injected custom JS mod.");
        })
        .catch(err => {
          console.error("[Mod] Error injecting mod:", err);
        });
    } else {
      console.log("[Mod] No local mod file found; skipping injection.");
    }
  });
}

// ----------------------------------
//  App Lifecycle
// ----------------------------------
app.whenReady().then(() => {
  // If on macOS, gameDir is in userData; otherwise local path
  if (process.platform === 'darwin') {
    globals.gameDir = path.join(app.getPath('userData'), 'game');
  } else {
    globals.gameDir = path.join(__dirname, '../..', 'game');
  }
  globals.gameFilesDownloaded = fs.existsSync(globals.gameDir);
  globals.currentVersionPath = path.join(globals.gameDir, 'currentVersion.txt');

  // Check if we were asked to clear cache
  if (process.argv.includes('--clear-cache')) {
    const userDataPath = app.getPath('userData');
    const settingsFilePath = path.join(userDataPath, 'settings.json');
    const localStorageDirPath = path.join(userDataPath, 'Local Storage');
    const offlineGameDirPath = path.join(userDataPath, 'game');

    // Delete everything except certain files/folders
    const files = fs.readdirSync(userDataPath);
    files.forEach(file => {
      const filePath = path.join(userDataPath, file);
      if (
        filePath !== settingsFilePath &&
        filePath !== localStorageDirPath &&
        filePath !== offlineGameDirPath
      ) {
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmdirSync(filePath, { recursive: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    });
    app.commandLine.removeSwitch('clear-cache');
  }

  // Finally create the main window
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
