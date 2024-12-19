import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { LoginData } from '../../types/loginData';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, LoaderComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  isLoading: WritableSignal<boolean> = signal(false);

  usernameError: WritableSignal<boolean> = signal(false);
  passwordError: WritableSignal<boolean> = signal(false);
  
  constructor(
    private user: UserService,
    private messaging: MessagingService
  ) {}

  async login() {
    this.isLoading.set(true);
    this.validate();
    if (this.form.invalid) {
      this.messaging.showMsg('Please fill out both fields.', 3000, 'error-snack-message');
      this.isLoading.set(false);
      return;
    }
    const loginData: LoginData = {
      username: this.form.get('username')?.value || '',
      password: this.form.get('password')?.value || ''
    }
    const res = await this.user.login(loginData);
    if (res instanceof Error) {
      this.messaging.showMsg(res.message, 5000, 'error-snack-message');
    } else {
      this.messaging.showMsg('Login successfull!', 5000, 'simple-snack-message');
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
  }
}
