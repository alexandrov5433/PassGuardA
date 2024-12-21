import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-cred-details',
  imports: [MatIconModule],
  templateUrl: './cred-details.component.html',
  styleUrl: './cred-details.component.css',
  standalone: true
})
export class CredDetailsComponent {
  constructor (
        private iconReg: MatIconRegistry,
        private domSanitizer: DomSanitizer
  ) {
    this.iconReg.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./edit.svg')
    );
    this.iconReg.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./delete.svg')
    );
  }
}
