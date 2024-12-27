import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountSettings } from '../../../types/accountSettings';
import { SettingsService } from '../../../services/settings.service';
import { MessagingService } from '../../../services/messaging.service';

@Component({
  selector: 'app-account',
  imports: [MatIconModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  accountSettings: WritableSignal<AccountSettings | null> = signal(null);

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

  async ngOnInit() {
    const accSettings = await this.settingsService.getAccountSettings();
    if (accSettings instanceof Error) {
      return this.messaging.showMsg((accSettings as Error).message, 3000, 'error-snack-message');
    }
    this.accountSettings.set(accSettings);
  }
}
