import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  topRatedProperties: any[] = [];
  propertyImages: { [key: number]: string } = {};
  searchLocation = '';
  searchType = '';

  constructor(
    private propertyService: PropertyService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.propertyService.getTopRated().subscribe({
      next: (res) => {
        this.topRatedProperties = res;
        this.cdr.detectChanges();
        this.loadFirstImages();
      },
      error: (err) => console.error(err)
    });
  }

  loadFirstImages() {
    this.topRatedProperties.forEach(property => {
      this.propertyService.getPropertyImages(property.id).subscribe({
        next: (images) => {
          if (images && images.length > 0) {
            this.propertyImages[property.id] = 'https://localhost:7040' + images[0].imageUrl;
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    });
  }

  onSearch() {
    this.router.navigate(['/properties'], {
      queryParams: {
        location: this.searchLocation,
        type: this.searchType
      }
    });
  }
}