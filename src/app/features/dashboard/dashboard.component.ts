import { Component } from '@angular/core';
// import { NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    // Clear the tokens and navigate to the login page.
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
