import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'https://localhost:7040/api/message';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  sendMessage(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  getConversation(senderId: number, receiverId: number, propertyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/conversation`, {
      params: { senderId, receiverId, propertyId },
      headers: this.getHeaders()
    });
  }
}