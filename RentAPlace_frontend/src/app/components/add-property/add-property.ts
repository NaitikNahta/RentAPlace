import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.html',
  standalone: false,
  styleUrls: ['./add-property.css']
})
export class AddProperty implements OnInit {

  title = '';
  location = '';
  price: number = 0;
  type = '';
  description = '';

  isEditMode = false;
  propertyId: number | null = null;
  images: any[] = [];

  baseUrl = 'https://localhost:7040'; // ✅ IMPORTANT FIX

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.propertyId = Number(id);

      console.log("EDIT MODE ID:", this.propertyId); // DEBUG

      this.loadProperty();
      this.loadImages();
    }
  }

  loadProperty() {
    this.propertyService.getPropertyById(this.propertyId!).subscribe({
      next: (res: any) => {
        console.log("PROPERTY DATA:", res); // DEBUG

        if (!res) return;

        this.title = res.title;
        this.location = res.location;
        this.price = res.pricePerNight;
        this.type = res.propertyType;
        this.description = res.description;

        this.cdr.detectChanges(); // ✅ FORCE UPDATE
      },
      error: (err) => {
        console.error("ERROR loading property:", err);
      }
    });
  }

  loadImages() {
    this.propertyService.getPropertyImages(this.propertyId!).subscribe({
      next: (res: any) => {
        console.log("IMAGES DATA:", res); // DEBUG

        this.images = res || [];

        this.cdr.detectChanges(); // ✅ FORCE UPDATE
      },
      error: (err) => {
        console.error("ERROR loading images:", err);
      }
    });
  }

  deleteImage(imageId: number) {
    this.propertyService.deleteImage(imageId).subscribe(() => {
      this.loadImages();
    });
  }

  onFileSelect(event: any) {
    const files = event.target.files;

    if (this.images.length + files.length > 3) {
      alert("Max 3 images allowed");
      return;
    }

    Array.from(files).forEach((file: any) => {
      const formData = new FormData();
      formData.append('file', file);

      this.propertyService.uploadImage(this.propertyId!, formData)
        .subscribe(() => this.loadImages());
    });
  }

  onSubmit() {
    const data = {
      title: this.title,
      location: this.location,
      pricePerNight: this.price,
      propertyType: this.type,
      description: this.description
    };

    if (this.isEditMode) {
      this.propertyService.updateProperty(this.propertyId!, data)
        .subscribe(() => {
          alert("Updated Successfully");
          this.router.navigate(['/owner-dashboard']);
        });
    } else {
      this.propertyService.addProperty(data)
        .subscribe(() => {
          alert("Property Added");
          this.router.navigate(['/owner-dashboard']);
        });
    }
  }
}