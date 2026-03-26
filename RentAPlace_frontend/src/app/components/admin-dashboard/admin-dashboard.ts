import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  properties: any[] = [];
  activeTab = 'users';
  successMsg = '';
  errorMsg = '';
  loggedInUserId: number = 0;
  private baseUrl = 'https://localhost:7040/api/admin';

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  ngOnInit() {
    this.loggedInUserId = Number(localStorage.getItem('userId'));
    this.loadUsers();
    this.loadProperties();
  }

  loadUsers() {
    this.http.get(`${this.baseUrl}/users`, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.users = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadProperties() {
    this.http.get(`${this.baseUrl}/properties`, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.properties = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  deleteUser(id: number) {
    if (id === this.loggedInUserId) {
      this.errorMsg = 'You cannot delete your own account';
      return;
    }
    this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.successMsg = 'User deleted successfully';
        this.errorMsg = '';
        this.loadUsers();
      },
      error: () => this.errorMsg = 'Failed to delete user'
    });
  }

  deleteProperty(id: number) {
    this.http.delete(`${this.baseUrl}/properties/${id}`, { headers: this.getHeaders(), responseType: 'text' }).subscribe({
      next: () => {
        this.successMsg = 'Property deleted successfully';
        this.errorMsg = '';
        this.loadProperties();
      },
      error: () => this.errorMsg = 'Failed to delete property'
    });
  }

  getRoleName(roleId: number): string {
    if (roleId === 1) return 'Admin';
    if (roleId === 2) return 'Owner';
    if (roleId === 3) return 'Renter';
    return 'Unknown';
  }
}