import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MessagingService } from '../../../../services/messaging.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-export-credentials-dialog',
  imports: [MatDialogModule],
  templateUrl: './export-credentials-dialog.component.html',
  styleUrl: './export-credentials-dialog.component.css'
})
export class ExportCredentialsDialogComponent {
  constructor(
    private selfDialogRef: MatDialogRef<ExportCredentialsDialogComponent>,
    private dataSevice: DataService,
    private messaging: MessagingService
  ) { }

  onCancel() {
    this.selfDialogRef.close(false);
  }

  async onExport(password: string, path: string) {
    const res = await this.dataSevice.exportCredentials(password, path);
    if (res instanceof Error) {
      this.messaging.showMsg((res as Error).message, 2500, 'error-snack-message');
      return;
    }
    this.selfDialogRef.close(true);
  }

  checkForCapslock(event: KeyboardEvent) {
    if (event.getModifierState('CapsLock')) {
      this.messaging.showMsg('CapsLock is turned on!', 2000, 'simple-snack-message');
    }
  }
}
