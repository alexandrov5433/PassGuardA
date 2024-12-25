import { Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredentialsData } from '../../../types/credentialsData';
import { MessagingService } from '../../../services/messaging.service';
import { DataService } from '../../../services/data.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-cred-details',
  imports: [MatIconModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './cred-details.component.html',
  styleUrl: './cred-details.component.css',
  standalone: true
})
export class CredDetailsComponent implements OnChanges {

  passwordInputType: 'password' | 'text' = 'password';
  isPasswordVisible: boolean = false;
  canDisplayShowHidePassButtons: WritableSignal<boolean> = signal(true);

  areInputFieldsDisabled: WritableSignal<boolean> = signal(true);
  isEditingEnabled: WritableSignal<boolean> = signal(false);

  isTitleError: WritableSignal<boolean> = signal(false);
  isUsernameError: WritableSignal<boolean> = signal(false);
  isPasswordError: WritableSignal<boolean> = signal(false);

  @Input({ required: true }) credentialsDetails!: CredentialsData;
  @Output() credentialsEdited = new EventEmitter<string>();

  form = new FormGroup({
    title: new FormControl('1', [Validators.required]),
    username: new FormControl('2', [Validators.required]),
    password: new FormControl('xxxxxxxxxxxxxxxxxxxx', [Validators.required]),
  });


  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private messagingService: MessagingService,
    private dataService: DataService
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

  async enableEditing() {
    await this.showPasswordInPlainText(this.credentialsDetails.id);
    this.areInputFieldsDisabled.set(false);
    this.isEditingEnabled.set(true);
    this.canDisplayShowHidePassButtons.set(false);
    this.messagingService.showMsg('Editing enabled.', 2000, 'simple-snack-message');
  }

  closeEditing() {
    this.hidePasswordText()
    this.areInputFieldsDisabled.set(true);
    this.isEditingEnabled.set(false);
    this.canDisplayShowHidePassButtons.set(true);
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
    // const res = await this.dataService.editCredentials(editedCredsData);
    // if (res instanceof Error) {
    //   this.messagingService.showMsg((res as Error).message, 4000, 'error-snack-message');
    //   return;
    // }
    this.messagingService.showMsg('Credentials edited!', 2000, 'positive-snack-message');
    // this.closeEditing();
    // this.credentialsEdited.emit(editedCredsData.id);
  }

  async copyValueToClipboard(val: string) {
    await navigator.clipboard.writeText(val);
    this.messagingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
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

  async copyPasswordToClipboard(credentialsId: string) {
    try {
      const pass = await this.getPasswordInPlaintext(credentialsId);
      await navigator.clipboard.writeText(pass as string);
      this.messagingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
    } catch (e) {
      console.error((e as Error).message);
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
      console.error((e as Error).message);
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
    if (this.isEditingEnabled()) {
      this.closeEditing();
    }
  }

}
