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
	deleteCredsById: (credId: string) => Promise<true | Error>,
	// fetchCredsById: (credId) => ipcRenderer.invoke('fetchCredsById', credId),
	sendCorrectionForCredsById: Function,
	generatePassword: Function
}