const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  closeApp: () => ipcRenderer.send('close-app'),
  openConfig: () => ipcRenderer.send('open-config'),
  
  saveData: (data) => ipcRenderer.send('save-data', data),
  
  closeConfig: () => ipcRenderer.send('close-config'),
  minimizeConfig: () => ipcRenderer.send('minimize-config'),
  
  onDataUpdated: (callback) => {
    ipcRenderer.on('data-updated', (event, data) => {
      callback(data);
    });
  }
});

