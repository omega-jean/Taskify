import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
})
export class RegisterComponent {
  // Form group for the registration form
  registerForm: FormGroup;
  
  // Error message to display in case of a failed registration
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize the form group with validation rules
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email field with required and email format validation
      password: ['', [Validators.required, Validators.minLength(6)]],  // Password field with minimum length validation
      confirmPassword: ['', [Validators.required]]  // Confirm password field with required validation
    });
  }

  // Method to handle form submission
  onSubmit() {
    // Check if the form is valid before making the HTTP request
    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;

      // Send POST request to the registration API with the form data
      this.http.post('http://127.0.0.1:5000/api/register', { email, password, confirmPassword }).subscribe({
        // On successful registration, navigate to the login page
        next: (response) => {
          console.log(response);
          this.router.navigate(['/login']);
        },
        // On error, set an error message to display to the user
        error: (err) => {
          this.errorMessage = err.error ? err.error.error : 'An error has occurred. Please try again.';
        }
      });
    }
    // Prevent default form submission behavior
    return false;
  }
}
