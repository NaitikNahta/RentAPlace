import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'https://localhost:7040/api/reservation';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  createReservation(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  getReservationsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getReservationsByProperty(propertyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/property/${propertyId}`, { headers: this.getHeaders() });
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status?status=${status}`, {}, { headers: this.getHeaders() });
  }
}