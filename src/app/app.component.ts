import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { MessagingService } from './services/messaging.service';
import { SettingsService } from './services/settings.service';
import { AccountSettings } from './types/accountSettings';
import { RootElement } from './types/rootElem';
import { AppearanceSettings } from './types/appearanceSettings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private user: UserService,
    private router: Router,
    private messaging: MessagingService,
    private settingsService: SettingsService
  ) { }

  private async themeSetter() {
    const res = await this.settingsService.getSettings('appearanceSettings');
    if (res instanceof Error) {
      this.messaging.showMsg((res as Error).message, 3000, 'error-snack-message');
      return;
    } else if ((res as AccountSettings).automaticLogout) {
      this.messaging.showMsg('AccountSettings can not be used to set theme.', 3000, 'error-snack-message');
      return;
    }
    const themeStyle: string = (res as AppearanceSettings).theme.style;
    const root: RootElement | null = document.querySelector(':root');
    if (!root) {
      throw new Error('Root element could not be found.');
    }
    const themeVars = await this.settingsService.getThemeStyleVariables(themeStyle);
    if (themeVars instanceof Error) {
      this.messaging.showMsg((themeVars as Error).message, 3000, 'error-snack-message');
      return;
    }
    for (let [key, val] of Object.entries(themeVars)) {
      root.style.setProperty(key, val);
    }
  }

  async ngOnInit() {
    try {
      await this.themeSetter();
      const accountExists = await this.user.accountExists();
      if ((typeof accountExists) === 'number') {
        this.router.navigate(['/blocked']);
      }
      if (accountExists === true) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/register']);
      }
    } catch (err) {
      this.messaging.showMsg((err as Error).message, 3000, 'error-snack-message');
    }
  }
}
