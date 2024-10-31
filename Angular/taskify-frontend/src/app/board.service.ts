import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = 'http://127.0.0.1:5000/api/your-board';

  constructor(private http: HttpClient) {}

  createBoard(board: { name: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || '',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl, board, { headers });
  }

  getBoards(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || ''
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }

  updateBoard(id: number, board: { name: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || '',
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, board, { headers });
  }

  deleteBoard(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token') || ''
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
