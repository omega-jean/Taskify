import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from '../auth.service';

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
  isMenuOpen = false;
  openMenuIndex: number | null = null;
  addListFormVisible = false;
  addListForm: FormGroup;

  taskLists: { id: number; title: string; cards: Card[]; newCard: string; cardFormVisible: boolean }[] = [];
  selectedCard: Card | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.addListForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  onLogout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleListMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

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

  toggleCardForm(listIndex: number) {
    this.taskLists[listIndex].cardFormVisible = !this.taskLists[listIndex].cardFormVisible;
  }

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

  addTask(listIndex: number) {
    const newTaskTitle = prompt('Enter the title for the new task:');
    if (newTaskTitle !== null && newTaskTitle.trim() !== '') {
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

  toggleCardOptions(listIndex: number, cardIndex: number): void {
    const card = this.taskLists[listIndex].cards[cardIndex];
    card.showOptions = !card.showOptions;
  }

  showCardDetails(card: Card) {
    this.selectedCard = { ...card };
  }

  closeCardDetails() {
    this.selectedCard = null;
  }

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

  modifyTitleCard(card: Card): void {
    const newTitle = prompt('Enter a new title for the card:', card.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      const listIndex = this.taskLists.findIndex(list => list.cards.includes(card));
      if (listIndex !== -1) {
        const cardIndex = this.taskLists[listIndex].cards.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          this.taskLists[listIndex].cards[cardIndex].title = newTitle;
        }
      }
    }
  }

  duplicateCard(listIndex: number, cardIndex: number): void {
    const card = this.taskLists[listIndex].cards[cardIndex];
    const newCard = {
      ...card,
      id: Date.now(),
      title: card.title + ' (Copy)'
    };
    this.taskLists[listIndex].cards.push(newCard);
  }

  deleteCard(listIndex: number, cardIndex: number): void {
    const confirmDelete = confirm('Are you sure you want to remove this card?');
    if (confirmDelete) {
      this.taskLists[listIndex].cards.splice(cardIndex, 1);
    }
  }

  modifyTitle(list: any): void {
    const newTitle = prompt('Enter a new title for the list:', list.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      list.title = newTitle;
    }
  }

  duplicateList(list: any): void {
    const newList = {
      ...list,
      id: Date.now(),
      title: list.title + ' (Copy)',
      cards: list.cards.map((card: Card) => ({ ...card, id: Date.now() }))
    };
    this.taskLists.push(newList);
  }

  deleteList(index: number): void {
    const confirmDelete = confirm('Are you sure you want to remove this list?');
    if (confirmDelete) {
      this.taskLists.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.taskLists, event.previousIndex, event.currentIndex);
  }
}
