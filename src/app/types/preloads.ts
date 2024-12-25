export type Preloads =  {
	accExists: Function,
	// navTo: (view) => ipcRenderer.send('navTo', view),
	// devTools: () => ipcRenderer.invoke('devTools:toggle'),
	register: Function,
	login: Function,
	logout: Function,
	credOverviewReq: Function,
	addCreds: Function,
	fetchPassPlainText: Function,
	// deleteCredsById: (credId) => ipcRenderer.invoke('deleteCredsById', credId),
	// fetchCredsById: (credId) => ipcRenderer.invoke('fetchCredsById', credId),
	// sendCorrectionForCredsById: (credId, data) => ipcRenderer.invoke('sendCorrectionForCredsById', credId, data),
	generatePassword: Function
}