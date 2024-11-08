import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Component decorator for configuring metadata like selector, template, styles, and imports
@Component({
  selector: 'app-forgot-password',  // Component tag name for use in templates
  standalone: true,  // Indicates the component is independent, not part of a module
  imports: [
    RouterLink,       // Enables linking to routes
    RouterLinkActive  // Manages active class for active links
  ],
  templateUrl: './forgot-password.component.html',  // Path to HTML template
  styleUrl: './forgot-password.component.css'       // Path to component-specific styles
})

// ForgotPasswordComponent class definition: currently no logic inside
export class ForgotPasswordComponent {

}
