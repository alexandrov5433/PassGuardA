import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredDetailsComponent } from './cred-details/cred-details.component';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CredDetailsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent {

  constructor (
        private iconReg: MatIconRegistry,
        private domSanitizer: DomSanitizer
  ) {
    this.iconReg.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./search.svg')
    );
    this.iconReg.addSvgIcon(
      'add',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./add.svg')
    );
    this.iconReg.addSvgIcon(
      'arrow-right',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./arrow-right.svg')
    );
    this.iconReg.addSvgIcon(
      'empty-page',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./empty-page.svg')
    );
    this.iconReg.addSvgIcon(
      'page-text',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./page-text.svg')
    );

  }
}
