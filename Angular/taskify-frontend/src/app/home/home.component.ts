import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout() {
    this.authService.logout();
  }
}
