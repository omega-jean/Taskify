import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      confirmPassword
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authentication`, {
      email,
      password
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
