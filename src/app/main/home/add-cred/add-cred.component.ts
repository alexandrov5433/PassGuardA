import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-cred',
  imports: [MatIconModule],
  templateUrl: './add-cred.component.html',
  styleUrl: './add-cred.component.css',
  standalone: true
})
export class AddCredComponent {
  constructor (
        private iconReg: MatIconRegistry,
        private domSanitizer: DomSanitizer
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
}
