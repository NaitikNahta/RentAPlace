import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property';

@Component({
  selector: 'app-property-list',
  standalone: false,
  templateUrl: './property-list.html',
  styleUrls: ['./property-list.css']
})
export class PropertyList implements OnInit {
  properties: any[] = [];
  location = '';
  type = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  viewMode = 'card';

  baseUrl = 'https://localhost:7040';

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.location = params['location'] || '';
      this.type = params['type'] || '';
      this.loadProperties();
    });
  }

  loadProperties() {
    const params: any = {};
    if (this.location) params.location = this.location;
    if (this.type) params.type = this.type;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;

    this.propertyService.searchProperties(params).subscribe({
      next: (res) => {
        this.properties = res;

        // 🔥 FETCH IMAGES FOR EACH PROPERTY
        this.properties.forEach((property: any) => {
          this.propertyService.getPropertyImages(property.id).subscribe({
            next: (imgs) => {
              property.images = imgs;
              this.cdr.detectChanges();
            },
            error: () => {
              property.images = [];
            }
          });
        });
      },
      error: (err) => console.error(err)
    });
  }

  onSearch() {
    this.loadProperties();
  }
}