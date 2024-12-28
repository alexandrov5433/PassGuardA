import { AccountData } from "./accountData"
import { AccountSettings } from "./accountSettings"

export type Preloads =  {
	accExists: () => Promise<boolean | Error>,
	register: (accountData: AccountData) => Promise<true | Error>,
	login: (accountData: AccountData) => Promise<true | Error>,
	logout: () => Promise<true | Error>,
	credOverviewReq: Function,
	addCreds: Function,
	fetchPassPlainText: Function,
	deleteCredsById: (credId: string) => Promise<true | Error>,
	sendCorrectionForCredsById: Function,
	generatePassword: Function,
	getSettings: (settingsType: string) => Promise<AccountSettings | Error>,
	setSettings: (settingsType: string, settingsSubType: string, newSettingsObj: any) => Promise<true | Error>,
	restoreDefaultSettings: () => Promise<true | Error>,
	deleteUserAccount: (password: string) => Promise<true | Error>
}