import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-appearance',
  imports: [MatIconModule],
  templateUrl: './appearance.component.html',
  styleUrl: './appearance.component.css'
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
}
