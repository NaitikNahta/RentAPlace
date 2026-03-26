import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7040/api';

  constructor(private http: HttpClient) {}

  // LOGIN API
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, data);
  }

  // REGISTER API
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, data);
  }

  // SAVE SESSION
  saveSession(user: any) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userRole', user.role);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // LOGIN CHECK (IMPORTANT FIX)
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== '';
  }

  // GET ROLE
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // GET USER ID
  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  // GET USER NAME
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  // LOGOUT
  logout() {
    localStorage.clear();
  }
}