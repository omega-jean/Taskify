import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  taskLists: { title: string; description: string; cards: string[]; newCard: string; cardFormVisible: boolean }[] = [];
  draggingIndex: number | null = null;

  constructor(private formBuilder: FormBuilder) {
    this.addListForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleListMenu(index: number) {
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  onSubmit() {
    if (this.addListForm.valid) {
      const newTask = { ...this.addListForm.value, cards: [], newCard: '', cardFormVisible: false };
      this.taskLists.push(newTask);
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
      selectedList.cards.push(selectedList.newCard);
      selectedList.newCard = '';
      selectedList.cardFormVisible = false;
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
      title: list.title + ' (Copy)',
      cards: [...list.cards],
      cardFormVisible: false
    };
    this.taskLists.push(newList);
  }

  deleteList(index: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this list?');
    if (confirmDelete) {
      this.taskLists.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<{ title: string; cards: string[]; newCard: string; cardFormVisible: boolean }[]>) {
    moveItemInArray(this.taskLists, event.previousIndex, event.currentIndex);
    this.draggingIndex = null;
  }

  dragStarted(index: number) {
    this.draggingIndex = index;
  }

  dragEnded() {
    this.draggingIndex = null;
  }
}