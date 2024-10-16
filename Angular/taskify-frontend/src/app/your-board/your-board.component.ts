import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-your-board',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './your-board.component.html',
  styleUrl: './your-board.component.css'
})
export class YourBoardComponent {
  showAddBoardForm = false;
  newBoardName = '';
  boards: { name: string }[] = [];

  constructor(private router: Router) {}


  toggleAddBoardForm() {
    this.showAddBoardForm = !this.showAddBoardForm;
  }

  addBoard() {
    if (this.newBoardName) {
      this.boards.push({ name: this.newBoardName });
      this.router.navigate(['/task-manager', this.newBoardName]);
      this.newBoardName = '';
      this.showAddBoardForm = false;
    }
  }
}
