import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [MatIconModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  standalone: true
})
export class SettingsComponent {

  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.iconReg.addSvgIcon(
      'account',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./account.svg')
    );
    this.iconReg.addSvgIcon(
      'moon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./moon.svg')
    );
  }
}
