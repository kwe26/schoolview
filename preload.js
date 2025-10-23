const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process (index.html)
// to talk to the main process (main.js)
contextBridge.exposeInMainWorld('api', {
  // --- Main Window Methods ---
  closeApp: () => ipcRenderer.send('close-app'),
  openConfig: () => ipcRenderer.send('open-config'),
  onDataUpdated: (callback) => 
    ipcRenderer.on('data-updated', (event, data) => callback(data)),
  
  // --- Config Window Methods ---
  saveData: (data) => ipcRenderer.send('save-data', data),
  closeConfig: () => ipcRenderer.send('close-config'),
  minimizeConfig: () => ipcRenderer.send('minimize-config'), // <-- ADDED
});

