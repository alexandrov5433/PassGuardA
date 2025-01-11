import { Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountSettings } from '../../../types/accountSettings';
import { SettingsService } from '../../../services/settings.service';
import { MessagingService } from '../../../services/messaging.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountConfirmationDialogComponent } from './delete-account-confirmation-dialog/delete-account-confirmation-dialog.component';
import { ExportCredentialsDialogComponent } from './export-credentials-dialog/export-credentials-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AppearanceSettings } from '../../../types/appearanceSettings';

@Component({
  selector: 'app-account',
  imports: [MatIconModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: '../all-specific-settings.component.css'
})
export class AccountComponent implements OnInit, OnDestroy {
  ngDestroyer: Subject<boolean> = new Subject();
  accountSettings: WritableSignal<AccountSettings | null> = signal(null);

  // block acc
  blockAllowedAttempts: Signal<number> = computed(() => {
    return this.accountSettings()?.blockAccAfterNumberFailedLogins.numberOfPermittedAttempts || 5;
  });
  blockDuration: Signal<number> = computed(() => {
    return this.accountSettings()?.blockAccAfterNumberFailedLogins.timeForBlockedStateMinutes || 30;
  });
  // delete acc
  deleteAllowedAttempts: Signal<number> = computed(() => {
    return this.accountSettings()?.deleteAccAfterNumberFailedLogins.numberOfPermittedAttempts || 10;
  });
  // auto logout
  autoLogoutMinutes: Signal<number> = computed(() => {
    return this.accountSettings()?.automaticLogout.timeUntilAutoLogoutMinutes || 30;
  }); 

  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private messaging: MessagingService,
    private dialog: MatDialog,
    private router: Router
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

  async toggleSettingState(settingsSubType: 'deleteAccAfterNumberFailedLogins' | 'blockAccAfterNumberFailedLogins' | 'automaticLogout') {
    const newSettingsObj = this.accountSettings()?.[settingsSubType];
    if (!newSettingsObj) {
      this.messaging.showMsg('The specified settings do not exist.', 3000, 'error-snack-message');
      return;
    }
    newSettingsObj!.state = !newSettingsObj!.state;
    const res = await this.settingsService.setSettings('accountSettings', settingsSubType, newSettingsObj);
    if (res instanceof Error) {
      this.messaging.showMsg((res as Error).message, 3000, 'error-snack-message');
      return;
    }
    await this.loadAccSettings();
  }

  async setAccountVariable(
    variableNewValue: string | number,
    settingsSubType: 'deleteAccAfterNumberFailedLogins' | 'blockAccAfterNumberFailedLogins' | 'automaticLogout',
    variableName: 'numberOfPermittedAttempts' | 'timeForBlockedStateMinutes' | 'timeUntilAutoLogoutMinutes'
  ) {
    variableNewValue = Math.ceil(Number(variableNewValue));
    if (variableNewValue < 1) {
      this.messaging.showMsg(`The value "${variableNewValue}" is not acceptable. Please enter a whole number, 1 or grater.`, 3500, 'error-snack-message');
      return;
    }
    const newSettingsObj = this.accountSettings()?.[settingsSubType];
    if (!newSettingsObj) {
      this.messaging.showMsg('The specified settings do not exist.', 3000, 'error-snack-message');
      return;
    }
    (newSettingsObj as any)[variableName] = variableNewValue;
    const res = await this.settingsService.setSettings(
      'accountSettings',
      settingsSubType,
      newSettingsObj
    );
    if (res instanceof Error) {
      this.messaging.showMsg((res as Error).message, 3000, 'error-snack-message');
      return;
    }
    await this.loadAccSettings();
    this.messaging.showMsg('Changes saved!', 2000, 'positive-snack-message');
  }

  private async loadAccSettings() {
    const accSettings = await this.settingsService.getSettings('accountSettings');
    if (accSettings instanceof Error) {
      return this.messaging.showMsg((accSettings as Error).message, 3000, 'error-snack-message');
    }
    if ((accSettings as AppearanceSettings).theme) {
      return this.messaging.showMsg('AppearanceSettings can not be used in Account component.', 3000, 'error-snack-message');
    }
    this.accountSettings.set(accSettings as AccountSettings);
  }

  async deleteAccount() {
    const accountDeletionDialog = this.dialog.open(
      DeleteAccountConfirmationDialogComponent,
      { panelClass: 'confirmation-dialog' }
    );
    accountDeletionDialog.afterClosed()
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe((res: boolean) => {
        if (res) {
          this.messaging.showMsg('Account deleted successfully!', 3000, 'positive-snack-message');
          this.router.navigate(['/register']);
          return;
        }
      });
  }

  async exportCredentials() {
    const exportCredentialsDialog = this.dialog.open(
      ExportCredentialsDialogComponent,
      { panelClass: 'confirmation-dialog' }
    );
    exportCredentialsDialog.afterClosed()
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe((res: boolean) => {
        if (res) {
          this.messaging.showMsg('Credentials exported successfully!', 3000, 'positive-snack-message');
          return;
        }
      });
  }

  async ngOnInit() {
    await this.loadAccSettings();
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
