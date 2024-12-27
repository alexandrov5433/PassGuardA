import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private user: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    // const accountExists = await this.user.accountExists();
    // if (accountExists) {
    //   this.router.navigate(['/login']);
    // } else {
    //   this.router.navigate(['/register']);
    // }
  }
}
