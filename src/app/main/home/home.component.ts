import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CredDetailsComponent } from './cred-details/cred-details.component';
import { AddCredComponent } from './add-cred/add-cred.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CredentialsData } from '../../types/credentialsData';
import { DataService } from '../../services/data.service';
import { CredSerchEventTarget } from '../../types/credSearchEventTarget';
import { MessagingService } from '../../services/messaging.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, CredDetailsComponent, AddCredComponent, LoaderComponent, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true
})
export class HomeComponent implements OnInit {
  credentialsOverviewData: WritableSignal<Array<CredentialsData> | null> = signal(null);
  credentialsDetailsData!: CredentialsData;

  isOverviewLoading: WritableSignal<boolean> = signal(false);
  isDetailsLoading: WritableSignal<boolean> = signal(false);

  isDetailsDisplayed: WritableSignal<boolean> = signal(false);
  showAddCreds: WritableSignal<boolean> = signal(false);

  markSelectedById: String = '';

  constructor(
    private iconReg: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private messagingService: MessagingService,
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
    this.iconReg.addSvgIcon(
      'info',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./info.svg')
    );
  }

  viewCredentialDetails(id: string) {
    this.markSelectedById = id;
    this.showAddCreds.set(false);
    this.isDetailsDisplayed.set(true)
    this.isDetailsLoading.set(true);
    const credDetailsData: CredentialsData = this.credentialsOverviewData()?.find(c => c.id == id)!;
    this.credentialsDetailsData = credDetailsData;
    this.isDetailsLoading.set(false);
  }

  openAddCredentials() {
    this.showAddCreds.set(true);
    this.isDetailsDisplayed.set(false);
    this.markSelectedById = '';
  }

  onCloseAddition() {
    this.showAddCreds.set(false);
    this.isDetailsDisplayed.set(false);
    this.markSelectedById = '';
  }

  async onSuccessfulAddition() {
    this.onCloseAddition();
    await this.loadCredentialOverviewData();
  }

  async onCredentialsEdited(idOfEditedCredentials: string) {
    const idCreds: string = idOfEditedCredentials;
    await this.loadCredentialOverviewData();
    this.viewCredentialDetails(idCreds);
  }

  async onCredentialsDeleted() {
    await this.loadCredentialOverviewData();
    this.showAddCreds.set(false);
    this.isDetailsDisplayed.set(false);
    this.markSelectedById = '';
  }

  searchForCredentialInOverview(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }
    const searchVal = (event?.target as CredSerchEventTarget).value;
    const regex = new RegExp(`${searchVal}`, 'i');
    const credId: string = this.credentialsOverviewData()?.find(c => regex.test(c.title))?.id || '';
    if (!credId) {
      this.messagingService.showMsg(`No credentials found with title: "${searchVal}".`, 2000, 'simple-snack-message');
      return;
    } else {
      document.getElementById(credId)!.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
    this.viewCredentialDetails(credId);
  }

  async loadCredentialOverviewData() {
    this.isOverviewLoading.set(true);
    let credsOverviewData = await this.dataService.getCredentialsOverviewData();
    this.isOverviewLoading.set(false);
    if (credsOverviewData.length === 0) {
      this.credentialsOverviewData.set(null);
    } else {
      this.credentialsOverviewData.set(credsOverviewData);
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadCredentialOverviewData();
  }
}
