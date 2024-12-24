import { Component, Input } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredentialsData } from '../../../types/credentialsData';
import { MessagingService } from '../../../services/messaging.service';
import { DataService } from '../../../services/data.service';


@Component({
  selector: 'app-cred-details',
  imports: [MatIconModule],
  templateUrl: './cred-details.component.html',
  styleUrl: './cred-details.component.css',
  standalone: true
})
export class CredDetailsComponent {

  passwordValue: string = 'xxxxxxxxxxxxxxxxxxxx';
  passwordInputType: 'password' | 'text' = 'password';
  isPasswordVisible: boolean = false;
  
  @Input({ required: true }) credentialsDetails!: CredentialsData;
  
  constructor (
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private messgingService: MessagingService,
    private dataService: DataService
  ) {
    this.iconReg.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./edit.svg')
    );
    this.iconReg.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./delete.svg')
    );
    this.iconReg.addSvgIcon(
      'copy',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./copy.svg')
    );
    this.iconReg.addSvgIcon(
      'eye-open',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./eye-open.svg')
    );
    this.iconReg.addSvgIcon(
      'eye-closed',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./eye-closed.svg')
    );
  }

  async copyValueToClipboard(val: string) {
    await navigator.clipboard.writeText(val);
    this.messgingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
  }

  private async getPasswordInPlaintext(credentialsId: string): Promise<string | Error> {
    const pass = await this.dataService.getPasswordInPlaintext(credentialsId);
    if (pass instanceof Error) { throw pass };
    return pass;
  }

  async copyPasswordToClipboard(credentialsId: string) {
    try {
      const pass = await this.getPasswordInPlaintext(credentialsId);
      await navigator.clipboard.writeText(pass as string);
      this.messgingService.showMsg('Copied to clipboard!', 1500, 'positive-snack-message');
    } catch (e) {
      console.error((e as Error).message);
      this.messgingService.showMsg((e as Error).message, 3000, 'error-snack-message');
    }
  }

  async showPasswordInPlainText(credentialsId: string) {
    try {
      const pass = await this.getPasswordInPlaintext(credentialsId);
      this.passwordValue = pass as string;
      this.passwordInputType = 'text';
      this.isPasswordVisible = true;
    } catch (e) {
      console.error((e as Error).message);
      this.hidePasswordText();
      this.messgingService.showMsg((e as Error).message, 3000, 'error-snack-message');
    }
  }
  
  hidePasswordText() {
      this.passwordValue = 'xxxxxxxxxxxxxxxxxxxx'
      this.passwordInputType = 'password';
      this.isPasswordVisible = false;
  }

}
