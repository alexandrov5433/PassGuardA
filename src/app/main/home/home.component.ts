import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredDetailsComponent } from './cred-details/cred-details.component';
import { AddCredComponent } from './add-cred/add-cred.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CredentialsData } from '../../types/credentialsOverview';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CredDetailsComponent, AddCredComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent implements OnInit{
  credentialsOverviewData: WritableSignal<Array<CredentialsData> | null> = signal(null);
  credentialsDetailsData: WritableSignal<CredentialsData | null> = signal(null);

  isOverviewLoading: WritableSignal<boolean> = signal(false);
  isDetailsLoading: WritableSignal<boolean> = signal(false);

  constructor (
        private iconReg: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private dataService: DataService
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

  viewCredentialDetails(id: string) {
    console.log(id);
    
  }

  async ngOnInit(): Promise<void> {
    this.isOverviewLoading.set(true);
    let credsOverviewData = await this.dataService.getCredentialsOverviewData();
    this.isOverviewLoading.set(false);
    if (credsOverviewData.length === 0) {
      this.credentialsOverviewData.set(null);
    } else {
      this.credentialsOverviewData.set(credsOverviewData);
    }
  }
}
