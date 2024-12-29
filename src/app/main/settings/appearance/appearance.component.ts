import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsService } from '../../../services/settings.service';
import { MessagingService } from '../../../services/messaging.service';
import { AccountSettings } from '../../../types/accountSettings';
import { AppearanceSettings } from '../../../types/appearanceSettings';

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
    await this.setAppearanceSettings(theme, 'theme', 'style');
    await this.loadAppearanceSettings();
    this.messaging.showMsg('Changes saved!', 2000, 'positive-snack-message');
  }

  private async setAppearanceSettings(
    variableNewValue: string | number,
    settingsSubType: 'theme',
    variableName: 'style'
  ) {
    const newSettingsObj = this.appearanceSettings()?.[settingsSubType];
    if (!newSettingsObj) {
      this.messaging.showMsg('The specified settings do not exist.', 3000, 'error-snack-message');
      return;
    }
    (newSettingsObj as any)[variableName] = variableNewValue;
    const res = await this.settingsService.setSettings(
      'appearanceSettings',
      settingsSubType,
      newSettingsObj
    );
    if (res instanceof Error) {
      this.messaging.showMsg((res as Error).message, 3000, 'error-snack-message');
      return;
    }
  }

  private async loadAppearanceSettings() {
    const _appearanceSettings = await this.settingsService.getSettings('accountSettings');
    if (_appearanceSettings instanceof Error) {
      return this.messaging.showMsg((_appearanceSettings as Error).message, 3000, 'error-snack-message');
    }
    if ((_appearanceSettings as AccountSettings).automaticLogout) {
      return this.messaging.showMsg('AccountSettings can not be used in Appearance component.', 3000, 'error-snack-message');
    }
    this.appearanceSettings.set(_appearanceSettings as AppearanceSettings);
  }

  private updateTheme() {
    const root = document.querySelector(':root');
    const props = getComputedStyle(root!);
    const settings = Object.entries(this.appearanceSettings() || {});
    for (let [key, val] of settings) {
      props.setProperty(key, val);
    }
    console.log(props.getPropertyValue('--claret'));
  }

  async ngOnInit() {
    await this.loadAppearanceSettings();
  }

}
