const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('preloads', {
	accExists: () => ipcRenderer.invoke('accountExists'),
	// navTo: (view) => ipcRenderer.send('navTo', view),
	// devTools: () => ipcRenderer.invoke('devTools:toggle'),
	register: (regData) => ipcRenderer.invoke('register', regData),
	login: (loginData) => ipcRenderer.invoke('login', loginData),
	// logout: () => ipcRenderer.invoke('logout'),
	// credOverviewReq: () => ipcRenderer.invoke('credOverviewReq'),
	// addCreds: (creds) => ipcRenderer.send('addCreds', creds),
	// fetchPassPlainText: (credId) => ipcRenderer.invoke('fetchPassPlainText', credId),
	// deleteCredsById: (credId) => ipcRenderer.invoke('deleteCredsById', credId),
	// fetchCredsById: (credId) => ipcRenderer.invoke('fetchCredsById', credId),
	// sendCorrectionForCredsById: (credId, data) => ipcRenderer.invoke('sendCorrectionForCredsById', credId, data),
	generatePassword: (passSettings) => ipcRenderer.invoke('passwordGeneration', passSettings)
});