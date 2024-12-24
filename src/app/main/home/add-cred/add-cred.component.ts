import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-cred',
  imports: [MatIconModule, MatTooltipModule, ReactiveFormsModule],
  templateUrl: './add-cred.component.html',
  styleUrl: './add-cred.component.css',
  standalone: true
})
export class AddCredComponent {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  settingsForm = new FormGroup({
    passLength: new FormControl(''),
    lowercase: new FormControl(''),
    uppercase: new FormControl(''),
    digits: new FormControl(''),
    symbols: new FormControl(''),
    excludeSimilars: new FormControl(''),
    charsToExclude: new FormControl('')
});

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

  async addCredentials() {
    console.log(this.form?.errors);
    
  }
}
