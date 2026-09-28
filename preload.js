const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onLoadFile: (callback) => ipcRenderer.on('load-file', (_event, data) => callback(data)),
    saveFileDialog: (data) => ipcRenderer.invoke('save-file-dialog', data),
    saveFile: (data) => ipcRenderer.invoke('save-file', data),
    setAsDefault: () => ipcRenderer.invoke('set-as-default'),
    openNewWindow: () => ipcRenderer.invoke('new-window'),
    getVersion: () => ipcRenderer.invoke('get-version')
});
