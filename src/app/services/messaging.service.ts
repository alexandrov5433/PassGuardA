import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(
    private snack: MatSnackBar
  ) { }

  /**
   * Displays a given message for the user.
   * @param msg The message to display.
   * @param duration The duration for which to display the message in milliseconds.
   * @param {String} panelClass The class determining the styling of the message.
   */
  showMsg(msg: string, duration: number = 2000, panelClass: 'simple-snack-message' | 'error-snack-message' | 'positive-snack-message' = 'simple-snack-message') {
    this.snack.open(msg, '',{
      panelClass: panelClass,
      duration: duration
    });
  }
}
