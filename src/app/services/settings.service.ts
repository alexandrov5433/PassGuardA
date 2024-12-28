import { Injectable } from '@angular/core';
import { Preloads } from '../types/preloads';
import { WindowNew } from '../types/windowNew';
import { AccountSettings } from '../types/accountSettings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private preloads: Preloads = (window as unknown as WindowNew).preloads;

    async getAccountSettings(): Promise<AccountSettings | Error> {
        return await this.preloads.getSettings('accountSettings');
    }
    async setSettings(
        settingsType: 'accountSettings',
        settingsSubType: 'deleteAccAfterNumberFailedLogins' | 'blockAccAfterNumberFailedLogins' | 'automaticLogout',
        newSettingsObj: any
    ): Promise<true | Error> {
        return await this.preloads.setSettings(settingsType, settingsSubType, newSettingsObj);
    }

    async restoreDefaultSettings() :Promise<true | Error> {
        return await this.preloads.restoreDefaultSettings();
    }
}