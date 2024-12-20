import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { MessagingService } from '../services/messaging.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, RouterLink, MatIconModule, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  standalone: true
})
export class MainComponent {

  constructor(
    private user: UserService,
    private router: Router,
    private messaging: MessagingService,
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
    if (res === true) {
      return this.router.navigate(['/login']);
    } else if (res instanceof Error) {
      return this.messaging.showMsg(res.message, 3000, 'error-snack-message');
    }
    return;
  }
}
