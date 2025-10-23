const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('no-sandbox');


let mainWindow;
let configWindow;

function createMainWindow() {
  // Get primary display's work area dimensions
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Define window size
  const winWidth = 280;
  const winHeight = 350; // Increased height for the clock

  // Calculate position for top-right corner (with some padding)
  const xPos = width - winWidth - 20;
  const yPos = 20;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: xPos,
    y: yPos,
    frame: false, // No window frame (title bar, etc.)
    transparent: true, // Transparency removed
    movable: false, // Window is now non-moveable
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true, // Don't show in the taskbar
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  // set icon to ./icon.png
  mainWindow.setIcon(path.join(__dirname, 'icon.png'));

  // Set up handler to close the app
  ipcMain.on('close-app', () => {
    mainWindow.close();
  });

  // Set up handler to open the config window
  ipcMain.on('open-config', () => {
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.focus();
      return;
    }

    configWindow = new BrowserWindow({
      width: 400,
      height: 550, // Increased height for all options
      title: 'Configuration',
      frame: false, // <-- ADDED: Remove default frame
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), // Re-use the same preload
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    configWindow.loadFile('config.html'); // Load the new config file
    // set icon
    configWindow.setIcon(path.join(__dirname, 'icon.png'));

    configWindow.on('closed', () => {
      configWindow = null;
    });
  });

  // Handler for config window to send data back to main window
  ipcMain.on('save-data', (event, data) => {
    // Send the updated data to the main window
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('data-updated', data);
    }
    // Close the config window
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.close();
    }
  });

  // Handler for config window to just close itself
  ipcMain.on('close-config', () => {
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.close();
    }
  });

  // --- ADDED: Handler for config window to minimize itself ---
  ipcMain.on('minimize-config', () => {
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.minimize();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


