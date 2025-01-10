import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blocked',
  imports: [],
  templateUrl: './blocked.component.html',
  styleUrl: './blocked.component.css'
})
export class BlockedComponent implements OnInit {

  datetimeToUnblock: WritableSignal<string> = signal('');
  constructor(
    private userService: UserService,
    private messaging: MessagingService,
    private router: Router
  ) {}

  private formatToUserFriendlyDatetimeFormat(ms: number) {
    
  }

  async ngOnInit() {
    const accountExists = await this.userService.accountExists();
    if ((typeof accountExists) === 'number') {


    } else if (accountExists instanceof Error) {
      this.messaging.showMsg((accountExists as Error).message, 3000, 'error-snack-message');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
