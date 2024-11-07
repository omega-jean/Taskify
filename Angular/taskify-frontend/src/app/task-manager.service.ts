import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Card {
  id: number;
  title: string;
  description: string;
  status: string;
  boardId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private baseUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getTasks(boardId: number): Observable<Card[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });
    return this.http.get<Card[]>(`${this.baseUrl}/your-board/${boardId}/task-manager`, { headers });
  }

  createTask(task: Card): Observable<Card> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Card>(`${this.baseUrl}/task-manager`, task, { headers });
  }

  updateTask(task: Card): Observable<Card> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Card>(`${this.baseUrl}/task-manager/${task.id}`, task, { headers });
  }

  deleteTask(taskId: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });
    return this.http.delete<void>(`${this.baseUrl}/task-manager/${taskId}`, { headers });
  }

  addCardToBoard(boardId: number, card: Card): Observable<Card> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Card>(`${this.baseUrl}/your-board/${boardId}/task-manager`, card, { headers });
  }
}
