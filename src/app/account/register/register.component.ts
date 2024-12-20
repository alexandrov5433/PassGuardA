import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MessagingService } from '../../services/messaging.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { passwordMatchValadator } from '../../validators/registration-pass-match.validator';
import { AccountData } from '../../types/accountData';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rePassword: new FormControl('', [Validators.required]),
  }, passwordMatchValadator());

  isLoading: WritableSignal<boolean> = signal(false);

  usernameError: WritableSignal<boolean> = signal(false);
  passwordError: WritableSignal<boolean> = signal(false);
  rePasswordError: WritableSignal<boolean> = signal(false);
  showPassMatchErrorMsg: WritableSignal<boolean> = signal(false);

  constructor(
    private user: UserService,
    private messaging: MessagingService,
    private data: DataService
  ) { }

  async register() {
    this.isLoading.set(true);
    this.validate();
    if (this.form.invalid) {
      if (this.showPassMatchErrorMsg()) {
        this.messaging.showMsg('Passwords must match.', 2000, 'error-snack-message');
      } else {
        this.messaging.showMsg('Please fill out all fields.', 2000, 'error-snack-message');
      }
      this.isLoading.set(false);
      return;
    }
    const registerData: AccountData = {
      username: this.form.get('username')?.value || '',
      password: this.form.get('password')?.value || '',
    };
    const res = await this.user.register(registerData);
    if (res instanceof Error) {
      this.messaging.showMsg(res.message, 5000, 'error-snack-message');
      if (res.message === 'An account already exists.') {
        //TODO redirect to login
        console.log('Redirecting... to login.');
      }
    } else {
      this.messaging.showMsg('Registration successfull!', 3000, 'simple-snack-message');
      //TODO redirect
    }
    this.isLoading.set(false);
  }

  validate() {
    if (this.form.get('username')?.errors?.['required']) {
      this.usernameError.set(true);
    } else {
      this.usernameError.set(false);
    }

    if (this.form.get('password')?.errors?.['required']) {
      this.passwordError.set(true);
    } else {
      this.passwordError.set(false);
    }

    if (this.form.get('rePassword')?.errors?.['required']) {
      this.rePasswordError.set(true);
    } else {
      this.rePasswordError.set(false);
    }

    if (
      !this.form.get('password')?.errors?.['required'] &&
      !this.form.get('rePassword')?.errors?.['required']
    ) {
      if (this.form.errors?.['passwordMatch']) {
        this.showPassMatchErrorMsg.set(true);
        this.passwordError.set(true);
        this.rePasswordError.set(true);
      } else {
        this.showPassMatchErrorMsg.set(false);
        this.passwordError.set(false);
        this.rePasswordError.set(false);
      }
    }

  }

  async randomizePassword() {
    const pass = await this.data.generateRandomPassword();
    this.form.setValue({
      username: this.form.get('username')?.value || '',
      password: pass,
      rePassword: pass
    });
  }
}
