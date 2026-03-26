import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'https://localhost:7040/api/review';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  addReview(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  getReviewsByProperty(propertyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/property/${propertyId}`);
  }

  getAverageRating(propertyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/average-rating/${propertyId}`);
  }
}