import { Injectable } from '@angular/core';
import { Preloads } from '../types/preloads';
import { WindowNew } from '../types/windowNew';
import { AccountSettings } from '../types/accountSettings';
import { AppearanceSettings } from '../types/appearanceSettings';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private preloads: Preloads = (window as unknown as WindowNew).preloads;

    async getSettings(
        settingsType: 'accountSettings' | 'appearanceSettings'
    ): Promise<AccountSettings | AppearanceSettings | Error> {
        return await this.preloads.getSettings('accountSettings');
    }
    async setSettings(
        settingsType: 'accountSettings' | 'appearanceSettings',
        settingsSubType: 'deleteAccAfterNumberFailedLogins' | 'blockAccAfterNumberFailedLogins' | 'automaticLogout' | 'theme',
        newSettingsObj: any
    ): Promise<true | Error> {
        return await this.preloads.setSettings(settingsType, settingsSubType, newSettingsObj);
    }

    async restoreDefaultSettings() :Promise<true | Error> {
        return await this.preloads.restoreDefaultSettings();
    }
}