import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { MessagingService } from '../../../../services/messaging.service';
@Component({
  selector: 'app-delete-account-confirmation-dialog',
  imports: [MatDialogModule],
  templateUrl: './delete-account-confirmation-dialog.component.html',
  styleUrl: './delete-account-confirmation-dialog.component.css'
})
export class DeleteAccountConfirmationDialogComponent {
  constructor(
    private selfDialogRef: MatDialogRef<DeleteAccountConfirmationDialogComponent>,
    private userService: UserService,
    private messaging: MessagingService
  ) { }

  onCancel() {
    this.selfDialogRef.close(false);
  }

  async onDelete(password: string) {
    const res = await this.userService.deleteUserAccount(password);
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
