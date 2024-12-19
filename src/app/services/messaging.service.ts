import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(
    private snack: MatSnackBar
  ) { }

  showMsg(msg: string, duration: number, panelClass = 'simple-snack-message') {
    this.snack.open(msg, '',{
      panelClass: panelClass,
      duration: duration
    });
  }
}
