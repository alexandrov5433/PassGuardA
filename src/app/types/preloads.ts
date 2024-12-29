import { AccountData } from "./accountData"
import { AccountSettings } from "./accountSettings"
import { AppearanceSettings } from "./appearanceSettings"
import { ThemeVariables } from "./themeVariables"

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
	getSettings: (settingsType: string) => Promise<AccountSettings | AppearanceSettings | Error>,
	setSettings: (settingsType: string, settingsSubType: string, newSettingsObj: any) => Promise<true | Error>,
	restoreDefaultSettings: () => Promise<true | Error>,
	deleteUserAccount: (password: string) => Promise<true | Error>,
	getThemeVariables: (themeStyle: string) => Promise<ThemeVariables | Error>,
}