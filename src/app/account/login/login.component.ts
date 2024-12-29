import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { AccountData } from '../../types/accountData';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, LoaderComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  isLoading: WritableSignal<boolean> = signal(false);

  usernameError: WritableSignal<boolean> = signal(false);
  passwordError: WritableSignal<boolean> = signal(false);
  
  constructor(
    private user: UserService,
    private messaging: MessagingService,
    private router: Router
  ) {}

  async login() {
    this.isLoading.set(true);
    this.validate();
    if (this.form.invalid) {
      this.messaging.showMsg('Please fill out both fields.', 3000, 'error-snack-message');
      this.isLoading.set(false);
      return;
    }
    const loginData: AccountData = {
      username: this.form.get('username')?.value || '',
      password: this.form.get('password')?.value || ''
    }
    const res = await this.user.login(loginData);
    if (res instanceof Error) {
      this.messaging.showMsg(res.message, 5000, 'error-snack-message');
    } else {
      this.messaging.showMsg('Login successfull!', 5000, 'simple-snack-message');
      this.router.navigate(['/main/home']);
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

  async ngOnInit() {
    try {
      const accExists = await this.user.accountExists();
      if (accExists === false) {
        this.router.navigate(['/register']);
      }
    } catch (err) {
      this.messaging.showMsg((err as Error).message, 3000, 'error-snack-message');
    }
  }
}
