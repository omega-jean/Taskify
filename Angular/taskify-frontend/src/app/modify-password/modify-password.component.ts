import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  // Selector for the component, used to reference it in the template
  selector: 'app-modify-password',
  
  // Indicating that this component is standalone and doesn't rely on other modules
  standalone: true,

  // Imports required for routing functionality in this component
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  
  // Template URL and stylesheet URL for the component
  templateUrl: './modify-password.component.html',
  styleUrl: './modify-password.component.css'
})
export class ModifyPasswordComponent {
  // Component class logic can be added here if needed in the future
}
