import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BoardService } from '../board.service';
import { HttpErrorResponse } from '@angular/common/http';

// Interface to define the structure of a Board object
interface Board {
  id: number;
  name: string;
}

@Component({
  selector: 'app-your-board', // Component selector
  standalone: true,
  imports: [
    RouterLink,  // Importing Angular Router components
    RouterLinkActive,
    CommonModule,  // Importing common functionalities for the component
    FormsModule,  // Importing forms for two-way data binding
  ],
  templateUrl: './your-board.component.html',  // HTML template for this component
  styleUrls: ['./your-board.component.css']  // CSS styles for this component
})
export class YourBoardComponent implements OnInit {
  // Declare component properties
  showAddBoardForm = false;
  newBoardName = '';
  boards: Board[] = [];

  constructor(private router: Router, private boardService: BoardService) {}

  // Lifecycle hook to load boards when component initializes
  ngOnInit() {
    this.loadBoards();
  }

  // Method to fetch boards from the BoardService
  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards: Board[]) => {
        this.boards = boards;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Error fetching boards:", error);
      }
    });
  }

  // Method to toggle the display of the 'Create Board' form
  toggleAddBoardForm() {
    this.showAddBoardForm = !this.showAddBoardForm;
  }

  // Method to create a new board
  addBoard() {
    if (this.newBoardName) {
      this.boardService.createBoard({ name: this.newBoardName }).subscribe({
        next: (board: Board) => {
          this.boards.push({ id: board.id, name: board.name });
          this.newBoardName = '';  // Clear input field
          this.showAddBoardForm = false;  // Hide the form
        },
        error: (error: HttpErrorResponse) => {
          console.error("Error creating board:", error);
        }
      });
    }
  }

  // Method to navigate to the task manager for a specific board
  navigateToTaskManager(boardName: string) {
    this.router.navigate(['/task-manager', boardName]);
  }
}
