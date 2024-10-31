import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BoardService } from '../board.service';
import { HttpErrorResponse } from '@angular/common/http';

interface Board {
  id: number;
  name: string;
}

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
  styleUrls: ['./your-board.component.css']
})
export class YourBoardComponent implements OnInit {
  showAddBoardForm = false;
  newBoardName = '';
  boards: Board[] = [];

  constructor(private router: Router, private boardService: BoardService) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards: Board[]) => {
        this.boards = boards;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erreur lors de la récupération des boards :", error);
      }
    });
  }

  toggleAddBoardForm() {
    this.showAddBoardForm = !this.showAddBoardForm;
  }

  addBoard() {
    if (this.newBoardName) {
      this.boardService.createBoard({ name: this.newBoardName }).subscribe({
        next: (board: Board) => {
          this.boards.push({ id: board.id, name: board.name });
          this.newBoardName = '';
          this.showAddBoardForm = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error("Erreur lors de la création du board :", error);
        }
      });
    }
  }

  navigateToTaskManager(boardName: string) {
    this.router.navigate(['/task-manager', boardName]);
  }
}
