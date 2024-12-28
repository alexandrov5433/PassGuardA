import { Component, computed, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountSettings } from '../../../types/accountSettings';
import { SettingsService } from '../../../services/settings.service';
import { MessagingService } from '../../../services/messaging.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteAccountConfirmationDialogComponent } from './delete-account-confirmation-dialog/delete-account-confirmation-dialog.component';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [MatIconModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit, OnDestroy {
  ngDestroyer: Subject<boolean> = new Subject();
  accountSettings: WritableSignal<AccountSettings | null> = signal(null);

  // block acc
  blockAllowedAttempts: WritableSignal<number> = signal(5);
  blockDuration: WritableSignal<number> = signal(1);
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
    variableName: 'numberOfPermittedAttempts' | 'timeForBlockedStateHours' | 'timeUntilAutoLogoutMinutes'
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
    this.reloadAccVars();
    this.messaging.showMsg('Changes saved!', 2000, 'positive-snack-message');
  }

  private async loadAccSettings() {
    const accSettings = await this.settingsService.getAccountSettings();
    if (accSettings instanceof Error) {
      return this.messaging.showMsg((accSettings as Error).message, 3000, 'error-snack-message');
    }
    this.accountSettings.set(accSettings);
  }

  private reloadAccVars() {
    const attempts = this.accountSettings()?.blockAccAfterNumberFailedLogins.numberOfPermittedAttempts || 5;
    const time = this.accountSettings()?.blockAccAfterNumberFailedLogins.timeForBlockedStateHours || 1
    // const deleteAttempts = this.accountSettings()?.deleteAccAfterNumberFailedLogins.numberOfPermittedAttempts || 10;
    this.blockAllowedAttempts.set(attempts);
    this.blockDuration.set(time);
    // this.deleteAllowedAttempts.set(deleteAttempts);
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

  async ngOnInit() {
    await this.loadAccSettings();
    this.reloadAccVars();
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
