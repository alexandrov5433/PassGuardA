import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private user: UserService,
    private router: Router,
    private messaging: MessagingService
  ) { }

  async ngOnInit() {
    try {
      const accountExists = await this.user.accountExists();
      if (accountExists === true) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/register']);
      }
    } catch (err) {
      this.messaging.showMsg((err as Error).message, 3000, 'error-snack-message');
    }
  }
}
