const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('preloads', {
	accExists: () => ipcRenderer.invoke('accountExists'),
	register: (regData) => ipcRenderer.invoke('register', regData),
	login: (loginData) => ipcRenderer.invoke('login', loginData),
	logout: () => ipcRenderer.invoke('logout'),
	credOverviewReq: () => ipcRenderer.invoke('credOverviewReq'),
	addCreds: (creds) => ipcRenderer.invoke('addCreds', creds),
	fetchPassPlainText: (credId) => ipcRenderer.invoke('fetchPassPlainText', credId),
	deleteCredsById: (credId) => ipcRenderer.invoke('deleteCredsById', credId),
	sendCorrectionForCredsById: (data) => ipcRenderer.invoke('sendCorrectionForCredsById', data),
	generatePassword: (passSettings) => ipcRenderer.invoke('passwordGeneration', passSettings),
	getSettings: (settingsType) => ipcRenderer.invoke('getSettings', settingsType),
	setSettings: (settingsType, settingsSubType, newSettingsObj) => ipcRenderer.invoke('setSettings', settingsType, settingsSubType, newSettingsObj),
	restoreDefaultSettings: () => ipcRenderer.invoke('restoreDefaultSettings'),
	deleteUserAccount: (password) => ipcRenderer.invoke('deleteUserAccount', password)
});