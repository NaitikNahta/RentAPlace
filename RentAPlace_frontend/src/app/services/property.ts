import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = 'https://localhost:7040/api/property';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
  const token = this.authService.getToken();

  if (token) {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  return new HttpHeaders();
}

  getAllProperties(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getPropertiesByOwner(ownerId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/owner/${ownerId}`);
  }

  addProperty(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  updateProperty(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() });
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  searchProperties(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, { params });
  }

  getTopRated(): Observable<any> {
    return this.http.get(`${this.baseUrl}/top-rated`);
  }

  getPropertyImages(propertyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/images/${propertyId}`);
  }
  uploadImage(propertyId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/upload-image?propertyId=${propertyId}`, formData, { headers: this.getHeaders() });
} deleteImage(imageId: number) {
  return this.http.delete(`${this.baseUrl}/delete-image/${imageId}`, {
    headers: this.getHeaders()
  });
}
}