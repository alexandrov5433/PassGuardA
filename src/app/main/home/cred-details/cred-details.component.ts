import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredentialsData } from '../../../types/credentialsData';
import { MessagingService } from '../../../services/messaging.service';
import { DataService } from '../../../services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../shared/confirmationDialog/confirmation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../../../types/dialogData';
import { pipe, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-cred-details',
  imports: [MatIconModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './cred-details.component.html',
  styleUrl: './cred-details.component.css',
  standalone: true
})
export class CredDetailsComponent implements OnChanges, OnDestroy {
  private ngDestroyer: Subject<boolean> = new Subject();

  passwordInputType: 'password' | 'text' = 'password';
  isPasswordVisible: boolean = false;
  canDisplayMicroControlButtons: WritableSignal<boolean> = signal(true);

  isEditingEnabled: WritableSignal<boolean> = signal(false);

  isTitleError: WritableSignal<boolean> = signal(false);
  isUsernameError: WritableSignal<boolean> = signal(false);
  isPasswordError: WritableSignal<boolean> = signal(false);

  @Input({ required: true }) credentialsDetails!: CredentialsData;
  @Output() credentialsEdited = new EventEmitter<string>();
  @Output() credentialsDeleted = new EventEmitter<boolean>();

  form = new FormGroup({
    title: new FormControl('1', [Validators.required]),
    username: new FormControl('2', [Validators.required]),
    password: new FormControl('xxxxxxxxxxxxxxxxxxxx', [Validators.required]),
  });


  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private messagingService: MessagingService,
    private dataService: DataService,
    private dialog: MatDialog
  ) {
    this.iconReg.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./edit.svg')
    );
    this.iconReg.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./delete.svg')
    );
    this.iconReg.addSvgIcon(
      'copy',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./copy.svg')
    );
    this.iconReg.addSvgIcon(
      'eye-open',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./eye-open.svg')
    );
    this.iconReg.addSvgIcon(
      'eye-closed',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./eye-closed.svg')
    );
    this.iconReg.addSvgIcon(
      'cancel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./cancel.svg')
    );
    this.iconReg.addSvgIcon(
      'confirm',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./confirm.svg')
    );
  }

  private disableInputFields() {
    this.form.get('title')?.disable();
    this.form.get('username')?.disable();
    this.form.get('password')?.disable();
  }

  private enableInputFields() {
    this.form.get('title')?.enable();
    this.form.get('username')?.enable();
    this.form.get('password')?.enable();
  }

  /**
  * Returns true if form is invalid and false otherwise.
  * @returns Boolean
  */
  private validateFrom(): boolean {
    const titleValError = this.form.get('title')?.errors?.['required'];
    const usernameValError = this.form.get('username')?.errors?.['required'];
    const passwordValError = this.form.get('password')?.errors?.['required'];
    let errors = [];

    if (titleValError) {
      this.isTitleError.set(true);
      errors.push('title');
    } else {
      this.isTitleError.set(false);
    }
    if (usernameValError) {
      this.isUsernameError.set(true);
      errors.push('username');
    } else {
      this.isUsernameError.set(false);
    }
    if (passwordValError) {
      this.isPasswordError.set(true);
      errors.push('password');
    } else {
      this.isPasswordError.set(false);
    }

    if (errors.length) {
      this.messagingService.showMsg(`Missing fields: ${errors.join(', ')}.`, 3500, 'error-snack-message');
      return true;
    }
    return false;
  }

  private async getPasswordInPlaintext(credentialsId: string): Promise<string | Error> {
    const pass = await this.dataService.getPasswordInPlaintext(credentialsId);
    if (pass instanceof Error) { throw pass };
    return pass;
  }

  async enableEditing() {
    await this.showPasswordInPlainText(this.credentialsDetails.id);
    this.enableInputFields();
    this.isEditingEnabled.set(true);
    this.canDisplayMicroControlButtons.set(false);
    this.messagingService.showMsg('Editing enabled.', 2000, 'simple-snack-message');
  }

  closeEditing() {
    this.hidePasswordText()
    this.disableInputFields();
    this.isEditingEnabled.set(false);
    this.canDisplayMicroControlButtons.set(true);
  }

  cancelAndDiscardEditing() {
    this.form.get('title')?.setValue(this.credentialsDetails.title);
    this.form.get('username')?.setValue(this.credentialsDetails.username);
    this.form.get('password')?.setValue('xxxxxxxxxxxxxxxxxxxx');
    this.closeEditing();
    this.messagingService.showMsg('Editing canceled.', 2000, 'simple-snack-message');
  }

  async saveChanges() {
    if (this.validateFrom()) {
      return;
    }
    const editedCredsData: CredentialsData = {
      id: this.credentialsDetails.id,
      title: this.form.get('title')?.value!,
      username: this.form.get('username')?.value!,
      password: this.form.get('password')?.value!,
    }
    const res = await this.dataService.editCredentials(editedCredsData);
    if (res instanceof Error) {
      this.messagingService.showMsg((res as Error).message, 4000, 'error-snack-message');
      return;
    }
    this.messagingService.showMsg('Credentials edited!', 2000, 'positive-snack-message');
    this.closeEditing();
    this.credentialsEdited.emit(editedCredsData.id);
  }

  async copyValueToClipboard(val: string) {
    await navigator.clipboard.writeText(val);
    this.messagingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
  }

  async deleteCredentials() {
    const dataForDialog: DialogData = {
      title: 'Please confirm!',
      content: `The credentials for "${this.credentialsDetails.title}" will be deleted permanently. Are you sure?`,
      confirmationActionTitle: 'Delete',
      cancelActionTitle: 'Cancel'
    };
    const confirmDeleteDialog: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(
      ConfirmationDialogComponent,
      { data: dataForDialog, panelClass: 'confirmation-dialog' }
    );
    confirmDeleteDialog.afterClosed()
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe(
        async res => {
          if (Boolean(res)) {
            try {
              await this.dataService.deleteCredentials(this.credentialsDetails.id);
              this.messagingService.showMsg('Deletion successful!', 2000, 'positive-snack-message');
              this.credentialsDeleted.emit(true);
            } catch (err) {
              this.messagingService.showMsg((err as Error).message, 3000, 'error-snack-message');
            }
          }
        }
      );
  }

  async copyPasswordToClipboard(credentialsId: string) {
    try {
      const pass = await this.getPasswordInPlaintext(credentialsId);
      await navigator.clipboard.writeText(pass as string);
      this.messagingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
    } catch (e) {
      this.messagingService.showMsg((e as Error).message, 3000, 'error-snack-message');
    }
  }

  async showPasswordInPlainText(credentialsId: string) {
    try {
      const pass = await this.getPasswordInPlaintext(credentialsId);
      this.form.get('password')?.setValue(pass as string);
      this.passwordInputType = 'text';
      this.isPasswordVisible = true;
    } catch (e) {
      this.hidePasswordText();
      this.messagingService.showMsg((e as Error).message, 3000, 'error-snack-message');
    }
  }

  hidePasswordText() {
    this.form.get('password')?.setValue('xxxxxxxxxxxxxxxxxxxx');
    this.passwordInputType = 'password';
    this.isPasswordVisible = false;
  }

  ngOnChanges(): void {
    this.hidePasswordText();
    this.form.get('title')?.setValue(this.credentialsDetails.title);
    this.form.get('username')?.setValue(this.credentialsDetails.username);
    this.disableInputFields();
    if (this.isEditingEnabled()) {
      this.closeEditing();
      this.messagingService.showMsg('Editing canceled.', 2000, 'simple-snack-message');
    }
  }

  ngOnDestroy(): void {
    if (this.isEditingEnabled()) {
      this.messagingService.showMsg('Editing canceled.', 2000, 'simple-snack-message');
    }
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }

}
