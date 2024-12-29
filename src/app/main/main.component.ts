import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { MessagingService } from '../services/messaging.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from '../services/settings.service';
import { AccountSettings } from '../types/accountSettings';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLink, MatIconModule, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true
})
export class MainComponent implements OnInit, OnDestroy {
  ngDestroyer: Subject<boolean> = new Subject();
  clock: WritableSignal<number> = signal(0);

  constructor(
    private user: UserService,
    private router: Router,
    private messaging: MessagingService,
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private settingsSservice: SettingsService
  ) {
    this.iconReg.addSvgIcon(
      'settings',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./settings.svg')
    );
    this.iconReg.addSvgIcon(
      'home',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./home.svg')
    );
  }

  async logout() {
    const res = await this.user.logout();
    if (res instanceof Error) {
      this.messaging.showMsg(res.message, 3000, 'error-snack-message');
    }
    return this.router.navigate(['/login']);
  }

  activityListener(event: Event) {
    this.clock.set(0);
  }

  async ngOnInit() {
    const res = await this.settingsSservice.getAccountSettings();
    if (res instanceof Error) {
      return;
    }
    const autoLogoutSettings = (res as AccountSettings).automaticLogout;
    if (!autoLogoutSettings.state) {
      return;
    }
    const autoLogoutLimit: number = Number(autoLogoutSettings.timeUntilAutoLogoutMinutes) * 60000;
    // clock incrementer
    interval(1000)
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe(() => {
        this.clock.set(this.clock() + 1000);
      });
    // time limit guard
    interval(1000)
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe(async trigger => {
        if (this.clock() >= autoLogoutLimit) {
          await this.logout();
        }
      });
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
