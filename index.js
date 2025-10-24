const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('no-sandbox');

let mainWindow;
let configWindow;

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 280;
  const winHeight = 350; 

  const xPos = width - winWidth - 20;
  const yPos = 20;

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: xPos,
    y: yPos,
    frame: false, 
    transparent: true, 
    movable: false, 
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true, 
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join('src', 'index.html'));

  mainWindow.setIcon(path.join(__dirname, 'icon.png'));

  ipcMain.on('close-app', () => {
    mainWindow.close();
  });

  ipcMain.on('open-config', () => {
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.focus();
      return;
    }

    configWindow = new BrowserWindow({
      width: 600,
      height: 550, 
      title: 'Configuration',
      frame: false, 
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'), 
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    configWindow.loadFile(path.join('src', 'config.html')); 
    configWindow.setIcon(path.join(__dirname, 'icon.png'));

    configWindow.on('closed', () => {
      configWindow = null;
    });
  });

  ipcMain.on('save-data', (event, data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('data-updated', data);
    }
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.close();
    }
  });

  ipcMain.on('close-config', () => {
    if (configWindow && !configWindow.isDestroyed()) {
      configWindow.close();
    }
  });

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

