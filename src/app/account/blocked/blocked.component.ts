import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blocked',
  imports: [],
  templateUrl: './blocked.component.html',
  styleUrl: './blocked.component.css'
})
export class BlockedComponent implements OnInit, OnDestroy {
  ngDestroyer: Subject<boolean> = new Subject();
  datetimeToUnblockUserFriedly: WritableSignal<string> = signal('');
  datetimeToUnblock: WritableSignal<number> = signal(0);

  constructor(
    private userService: UserService,
    private messaging: MessagingService,
    private router: Router
  ) { }

  private formatToUserFriendlyDatetime(ms: number) {
    const date = new Date(ms);
    const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return formatter.format(date);
  }

  private startClock() {
    interval(1000)
      .pipe(takeUntil(this.ngDestroyer))
      .subscribe(async () => {
        const currentTime = new Date().getTime();
        if (currentTime >= this.datetimeToUnblock()) {
          const res = await this.userService.unblockAccount();
          if (res instanceof Error) {
            this.messaging.showMsg((res as Error).message, 3000, 'error-snack-message');
          }
          if (res) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  async ngOnInit() {
    const accountExists = await this.userService.accountExists();
    if ((typeof accountExists) === 'number') {
      const unblockDate = this.formatToUserFriendlyDatetime(accountExists as number);
      this.datetimeToUnblockUserFriedly.set(unblockDate);
      this.datetimeToUnblock.set(accountExists as number);
      this.startClock();
    } else if (accountExists instanceof Error) {
      this.messaging.showMsg((accountExists as Error).message, 3000, 'error-snack-message');
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.ngDestroyer.next(true);
    this.ngDestroyer.complete();
  }
}
