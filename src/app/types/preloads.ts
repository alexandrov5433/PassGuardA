import { AccountData } from "./accountData"
import { AccountSettings } from "./accountSettings"
import { AppearanceSettings } from "./appearanceSettings"
import { CredentialsData } from "./credentialsData"
import { NewCredentialsData } from "./newCredentialsData"
import { PassGenOptions } from "./passwordGenerationOptions"
import { ThemeVariables } from "./themeVariables"

export type Preloads =  {
	accExists: () => Promise<boolean| number | Error>,
	register: (accountData: AccountData) => Promise<true | Error>,
	login: (accountData: AccountData) => Promise<true | Error>,
	logout: () => Promise<true | Error>,
	credOverviewReq: () => Promise<CredentialsData[] | [] | Error>,
	addCreds: (newCredsData: NewCredentialsData) => Promise<true | Error>,
	fetchPassPlainText: (credId: string) => Promise<string | Error>,
	deleteCredsById: (credId: string) => Promise<true | Error>,
	sendCorrectionForCredsById: (credentialsData: CredentialsData) => Promise<true | Error>,
	generatePassword: (passGenOptions?: PassGenOptions) => Promise<string | Error>,
	getSettings: (settingsType: string) => Promise<AccountSettings | AppearanceSettings | Error>,
	setSettings: (settingsType: string, settingsSubType: string, newSettingsObj: any) => Promise<true | Error>,
	restoreDefaultSettings: () => Promise<true | Error>,
	deleteUserAccount: (password: string) => Promise<true | Error>,
	getThemeVariables: (themeStyle: string) => Promise<ThemeVariables | Error>,
	exportCredentialsPlain: (destinationFullPath: string, password: string) => Promise<true | Error>,
}