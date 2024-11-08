// Importing necessary Angular modules and services
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // Router for navigation
import { AuthService } from '../auth.service'; // AuthService to handle authentication
import { FormsModule } from '@angular/forms'; // FormsModule to handle form data binding

@Component({
  selector: 'app-login', // Component selector used in the HTML
  standalone: true, // Marks this component as standalone (not part of a module)
  templateUrl: './login.component.html', // Link to the component's HTML template
  styleUrls: ['./login.component.css'], // Link to the component's CSS styles
  imports: [
    FormsModule, // Importing FormsModule for two-way data binding with ngModel
    RouterLink, // Import RouterLink to handle navigation
    RouterLinkActive // Import RouterLinkActive for active link styling
  ]
})
export class LoginComponent {
  email: string = ''; // Email model for the login form
  password: string = ''; // Password model for the login form
  errorMessage: string | null = null; // Error message to display in case of login failure

  // Constructor with injected AuthService and Router
  constructor(private authService: AuthService, private router: Router) {}

  // Method that handles the form submission
  onSubmit() {
    // Logging email and password to the console (for debugging purposes)
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    // Calling the login method from AuthService
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // If login is successful, save the token and navigate to the user's board
        this.authService.saveToken(response.token);
        this.router.navigate(['/your-board']);
      },
      error: (err) => {
        // In case of an error, log it and display the error message
        console.error(err);
        this.errorMessage = err.error.error || 'An error occurred while logging in.';
      }
    });
  }
}
