import { Component, EventEmitter, Output, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { MessagingService } from '../../../services/messaging.service';
import { PassGenOptions } from '../../../types/passwordGenerationOptions';
import { NewCredentialsData } from '../../../types/newCredentialsData';

@Component({
  selector: 'app-add-cred',
  imports: [MatIconModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './add-cred.component.html',
  styleUrl: './add-cred.component.css',
  standalone: true
})
export class AddCredComponent {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  isTitleError: WritableSignal<boolean> = signal(false);
  isUsernameError: WritableSignal<boolean> = signal(false);
  isPasswordError: WritableSignal<boolean> = signal(false);

  settingsForm = new FormGroup({
    passLength: new FormControl('20'),
    lowercase: new FormControl(true),
    uppercase: new FormControl(true),
    digits: new FormControl(true),
    symbols: new FormControl(true),
    excludeSimilars: new FormControl(false),
    charsToExclude: new FormControl('')
  });

  isPassLengthInvalid: WritableSignal<boolean> = signal(false);
  isCharsToExcludeInvalid: WritableSignal<boolean> = signal(false);

  @Output() closeAddition = new EventEmitter();
  @Output() successfulAddition = new EventEmitter();

  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private messagingService: MessagingService
  ) {
    this.iconReg.addSvgIcon(
      'cancel',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./cancel.svg')
    );
    this.iconReg.addSvgIcon(
      'confirm',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./confirm.svg')
    );
  }

  async generateRandompassword() {
    if (this.validateSettignsForm()) {
      return;
    }
    const passGenOptions: PassGenOptions = {
      passLength: Number(this.settingsForm.get('passLength')?.value) || 20,
      lowercase: Boolean(this.settingsForm.get('lowercase')?.value),
      uppercase: Boolean(this.settingsForm.get('uppercase')?.value),
      digits: Boolean(this.settingsForm.get('digits')?.value),
      symbols: Boolean(this.settingsForm.get('symbols')?.value),
      excludeSimilars: Boolean(this.settingsForm.get('excludeSimilars')?.value),
      charsToExclude: this.settingsForm.get('charsToExclude')?.value || ''
    };
    const randomPass = await this.dataService.generateRandomPassword(passGenOptions);
    this.form.get('password')?.setValue(randomPass);
    this.messagingService.showMsg('Password generated!', 1500, 'simple-snack-message');
  }

  async addCredentials() {
    if (this.validateFrom()) {
      return;
    }
    const newCredsData: NewCredentialsData = {
      title: this.form.get('title')?.value!,
      username: this.form.get('username')?.value!,
      password: this.form.get('password')?.value!,
    }
    const res = await this.dataService.saveNewCredentials(newCredsData);
    if (res instanceof Error) {
      this.messagingService.showMsg((res as Error).message, 4000, 'error-snack-message');
      return;
    }
    this.messagingService.showMsg('Credentials added!', 2000, 'positive-snack-message');
    this.triggerSuccessfulAddition();
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
  /**
   * Returns true if form is invalid and false otherwise.
   * @returns Boolean
   */
  private validateSettignsForm(): boolean {
    if (!isMinOneCharOptionSelected(this.settingsForm)) {
      this.messagingService.showMsg('Please select at least one character option from: "Use lowercase letters", "Use uppercase letters", "Use digits" and "Use symbols".', 3500, 'error-snack-message');
      return true;
    }
    if (areAllCharactersExcluded(this.settingsForm)) {
      this.messagingService.showMsg('You can not exclude all characters used for generation.', 3500, 'error-snack-message');
      this.isCharsToExcludeInvalid.set(true);
      return true;
    } else {
      this.isCharsToExcludeInvalid.set(false);
    }
    const passLengthVal: string = this.settingsForm.get('passLength')?.value || '';
    let error = false;
    if (/^\D$/.test(passLengthVal)) {
      error = true;
    } else if (Number(passLengthVal) <= 0) {
      error = true;
    } else if (passLengthVal.startsWith('0')) {
      error = true;
    }
    if (error) {
      this.isPassLengthInvalid.set(true);
      this.messagingService.showMsg('For password length, please enter a whole number bigger than 0.', 3500, 'error-snack-message');
      return true;
    }
    this.isPassLengthInvalid.set(false);
    return false;

    function isMinOneCharOptionSelected(settingsForm: FormGroup): boolean {
      let res: boolean = false;
      ['lowercase',
        'uppercase',
        'digits',
        'symbols'].forEach(controlName => {
          if (settingsForm.get(controlName)?.value === true) {
            res = true;
          }
        });
      return res;
    }

    function areAllCharactersExcluded(settingsForm: FormGroup) {
      const charsToExclude = (settingsForm.get('charsToExclude')?.value || '').split('');
      if (!charsToExclude.length) {
        return false;
      }
      const charLib = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        digits: '0123456789',
        symbols: '!@#$%^&*()_-+=[]{}|:;"<>,.?/~',
      }
      let charsToUseWhenGenerating = '';
      ['lowercase',
        'uppercase',
        'digits',
        'symbols'].forEach(controlName => {
          if (settingsForm.get(controlName)?.value === true) {
            charsToUseWhenGenerating += (charLib as any)[controlName];
          }
        });
      
      for (let c of charsToExclude) {
        charsToUseWhenGenerating = charsToUseWhenGenerating.replaceAll(c, '');
      }
      if (charsToUseWhenGenerating) {
        return false;
      }
      return true;
    }
  }

  isChecked(controlName: string) {
    return this.settingsForm.get(controlName)?.value;
  }

  triggerCloseAddition() {
    this.closeAddition.emit(true);
  }
  triggerSuccessfulAddition() {
    this.successfulAddition.emit(true);
  }
}
