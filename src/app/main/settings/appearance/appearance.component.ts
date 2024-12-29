import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-appearance',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './appearance.component.html',
  styleUrl: '../all-specific-settings.component.css'
})
export class AppearanceComponent {
  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.iconReg.addSvgIcon(
      'toggle-on',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./toggle-on.svg')
    );
    this.iconReg.addSvgIcon(
      'toggle-off',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./toggle-off.svg')
    );
  }

  themeCange(theme: 'light' | 'dark') {
    console.log(theme);
    
  }
}
