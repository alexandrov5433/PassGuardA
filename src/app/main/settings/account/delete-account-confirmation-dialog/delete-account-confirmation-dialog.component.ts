import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-delete-account-confirmation-dialog',
  imports: [MatDialogModule],
  templateUrl: './delete-account-confirmation-dialog.component.html',
  styleUrl: './delete-account-confirmation-dialog.component.css'
})
export class DeleteAccountConfirmationDialogComponent {
  constructor(
    private selfDialogRef: MatDialogRef<DeleteAccountConfirmationDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  onCancel() {
    this.selfDialogRef.close(false);
  }

  onDelete() {
    this.selfDialogRef.close(true);
  }
}
