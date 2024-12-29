import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsService } from '../../../services/settings.service';
import { MessagingService } from '../../../services/messaging.service';
import { AccountSettings } from '../../../types/accountSettings';
import { AppearanceSettings } from '../../../types/appearanceSettings';
import { RootElement } from '../../../types/rootElem';

@Component({
  selector: 'app-appearance',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './appearance.component.html',
  styleUrl: '../all-specific-settings.component.css'
})
export class AppearanceComponent implements OnInit {
  appearanceSettings: WritableSignal<AppearanceSettings | null> = signal(null);

  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private messaging: MessagingService
  ) {
    this.iconReg.addSvgIcon(
      'toggle-on',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./toggle-on.svg')
    );
    this.iconReg.addSvgIcon(
      'toggle-off',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./toggle-off.svg')
    );
  }

  async changeThemeSetting(theme: 'light' | 'dark') {
    try {
      await this.setAppearanceSettings(theme, 'theme', 'style');
      await this.loadAppearanceSettings();
      await this.updateTheme();
      this.messaging.showMsg('Changes saved!', 2000, 'positive-snack-message');
    } catch (err) {
      this.messaging.showMsg((err as Error).message, 3000, 'error-snack-message');
    }
  }

  private async setAppearanceSettings(
    variableNewValue: string | number,
    settingsSubType: 'theme',
    variableName: 'style'
  ) {
    const newSettingsObj = this.appearanceSettings()?.[settingsSubType];
    if (!newSettingsObj) {
      throw new Error('The specified settings do not exist.');
    }
    (newSettingsObj as any)[variableName] = variableNewValue;
    const res = await this.settingsService.setSettings(
      'appearanceSettings',
      settingsSubType,
      newSettingsObj
    );
    if (res instanceof Error) {
      throw res;
    }
  }

  private async loadAppearanceSettings() {
    const _appearanceSettings = await this.settingsService.getSettings('appearanceSettings');
    if (_appearanceSettings instanceof Error) {
      return this.messaging.showMsg((_appearanceSettings as Error).message, 3000, 'error-snack-message');
    }
    if ((_appearanceSettings as AccountSettings).automaticLogout) {
      return this.messaging.showMsg('AccountSettings can not be used in Appearance component.', 3000, 'error-snack-message');
    }
    this.appearanceSettings.set(_appearanceSettings as AppearanceSettings);
  }

  private async updateTheme() {
    const root: RootElement | null = document.querySelector(':root');
    if (!root) {
      throw new Error('Root element could not be found.');
    }
    const themeVars = await this.settingsService.getThemeStyleVariables(this.appearanceSettings()?.theme.style || 'dark'); 
    if (themeVars instanceof Error) {
      throw themeVars;
    }
    for (let [key, val] of Object.entries(themeVars)) {
      root.style.setProperty(key, val);
    }
  }

  async ngOnInit() {
    await this.loadAppearanceSettings();
  }

}
