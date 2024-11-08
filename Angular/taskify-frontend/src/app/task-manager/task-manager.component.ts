import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from '../auth.service';

// Card interface to structure task card data
interface Card {
  id: number;
  title: string;
  description: string;
  status: string;
  showOptions?: boolean;
}

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent {
  // UI State variables
  isMenuOpen = false;
  openMenuIndex: number | null = null;
  addListFormVisible = false;
  addListForm: FormGroup;

  taskLists: { id: number; title: string; cards: Card[]; newCard: string; cardFormVisible: boolean }[] = [];
  selectedCard: Card | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    // Initialize the add list form
    this.addListForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  // Handle logout
  onLogout() {
    this.authService.logout();
  }

  // Toggle sidebar menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Toggle task list menu
  toggleListMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  // Submit new list form
  onSubmit() {
    if (this.addListForm.valid) {
      const newList = {
        id: Date.now(),
        title: this.addListForm.value.title,
        cards: [],
        newCard: '',
        cardFormVisible: false
      };
      this.taskLists.push(newList);
      this.addListForm.reset();
      this.addListFormVisible = false;
    }
  }

  // Toggle card form visibility
  toggleCardForm(listIndex: number) {
    this.taskLists[listIndex].cardFormVisible = !this.taskLists[listIndex].cardFormVisible;
  }

  // Add new card to list
  addCard(listIndex: number) {
    const selectedList = this.taskLists[listIndex];
    if (selectedList.newCard.trim()) {
      const newCard: Card = {
        id: Date.now(),
        title: selectedList.newCard,
        description: '',
        status: 'pending',
        showOptions: false
      };
      selectedList.cards.push(newCard);
      selectedList.newCard = '';
      selectedList.cardFormVisible = false;
    }
  }

  // Add task via prompt
  addTask(listIndex: number) {
    const newTaskTitle = prompt('Enter the title for the new task:');
    if (newTaskTitle && newTaskTitle.trim()) {
      const newTask: Card = {
        id: Date.now(),
        title: newTaskTitle,
        description: '',
        status: 'pending',
        showOptions: false
      };
      this.taskLists[listIndex].cards.push(newTask);
    }
  }

  // Toggle card options
  toggleCardOptions(listIndex: number, cardIndex: number): void {
    const card = this.taskLists[listIndex].cards[cardIndex];
    card.showOptions = !card.showOptions;
  }

  // Show card details
  showCardDetails(card: Card) {
    this.selectedCard = { ...card };
  }

  // Close card details view
  closeCardDetails() {
    this.selectedCard = null;
  }

  // Update card data
  updateCard() {
    if (this.selectedCard) {
      for (const list of this.taskLists) {
        const cardIndex = list.cards.findIndex(c => c.id === this.selectedCard!.id);
        if (cardIndex !== -1) {
          list.cards[cardIndex] = { ...this.selectedCard };
          break;
        }
      }
      this.closeCardDetails();
    }
  }

  // Modify card title
  modifyTitleCard(card: Card): void {
    const newTitle = prompt('Enter a new title for the card:', card.title);
    if (newTitle && newTitle.trim()) {
      const listIndex = this.taskLists.findIndex(list => list.cards.includes(card));
      if (listIndex !== -1) {
        const cardIndex = this.taskLists[listIndex].cards.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          this.taskLists[listIndex].cards[cardIndex].title = newTitle;
        }
      }
    }
  }

  // Duplicate a card
  duplicateCard(listIndex: number, cardIndex: number): void {
    const card = this.taskLists[listIndex].cards[cardIndex];
    const newCard = {
      ...card,
      id: Date.now(),
      title: card.title + ' (Copy)'
    };
    this.taskLists[listIndex].cards.push(newCard);
  }

  // Delete a card
  deleteCard(listIndex: number, cardIndex: number): void {
    const confirmDelete = confirm('Are you sure you want to remove this card?');
    if (confirmDelete) {
      this.taskLists[listIndex].cards.splice(cardIndex, 1);
    }
  }

  // Modify task list title
  modifyTitle(list: any): void {
    const newTitle = prompt('Enter a new title for the list:', list.title);
    if (newTitle && newTitle.trim()) {
      list.title = newTitle;
    }
  }

  // Duplicate a task list
  duplicateList(list: any): void {
    const newList = {
      ...list,
      id: Date.now(),
      title: list.title + ' (Copy)',
      cards: list.cards.map((card: Card) => ({ ...card, id: Date.now() }))
    };
    this.taskLists.push(newList);
  }

  // Delete a task list
  deleteList(index: number): void {
    const confirmDelete = confirm('Are you sure you want to remove this list?');
    if (confirmDelete) {
      this.taskLists.splice(index, 1);
    }
  }

  // Handle drag and drop
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.taskLists, event.previousIndex, event.currentIndex);
  }
}
