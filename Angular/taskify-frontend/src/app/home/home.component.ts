import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home', // Component selector to identify in HTML
  standalone: true, // Indicates a standalone component
  imports: [
    RouterLink, // Enables linking to other routes
    RouterLinkActive, // Provides active class binding for routes
    CommonModule // Common Angular directives and utilities
  ],
  templateUrl: './home.component.html', // HTML template file
  styleUrls: ['./home.component.css'] // CSS styles file
})
export class HomeComponent {
  isMenuOpen = false; // Tracks menu open/close state

  // Constructor injects AuthService for authentication and Router for navigation
  constructor(private authService: AuthService, private router: Router) {}

  // Toggles the state of the menu (open or closed)
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Logs the user out by calling logout method in AuthService
  onLogout() {
    this.authService.logout();
  }

  // Checks if user is authenticated via AuthService
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Handles board access: navigates to board if authenticated, otherwise to login
  onAccessBoards(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/your-board']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
