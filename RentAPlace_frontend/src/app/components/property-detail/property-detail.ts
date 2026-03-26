import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property';
import { ReservationService } from '../../services/reservation';
import { ReviewService } from '../../services/review';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-property-detail',
  standalone: false,
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetail implements OnInit {
  property: any = null;
  images: any[] = [];
  reviews: any[] = [];
  averageRating: number = 0;
  checkInDate = '';
  checkOutDate = '';
  rating = 5;
  comment = '';
  successMsg = '';
  errorMsg = '';
  isLoading = true;

  // 🔥 NEW (Gallery)
  selectedImageIndex = 0;
  showGallery = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private propertyService: PropertyService,
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.propertyService.getPropertyById(id).subscribe({
      next: (res) => {
        this.property = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

    this.propertyService.getPropertyImages(id).subscribe({
      next: (res) => {
        this.images = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.reviewService.getReviewsByProperty(id).subscribe({
      next: (res) => {
        this.reviews = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.reviewService.getAverageRating(id).subscribe({
      next: (res) => {
        this.averageRating = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 GALLERY FUNCTIONS
  openGallery(index: number) {
    this.selectedImageIndex = index;
    this.showGallery = true;
  }

  closeGallery() {
    this.showGallery = false;
  }

  nextImage() {
    if (this.selectedImageIndex < this.images.length - 1) {
      this.selectedImageIndex++;
    }
  }

  prevImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }

  onReserve() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const data = {
      userId: Number(this.authService.getUserId()),
      propertyId: this.property.id,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };

    this.reservationService.createReservation(data).subscribe({
      next: () => this.successMsg = 'Reservation created successfully!',
      error: () => this.errorMsg = 'Failed to create reservation.'
    });
  }

  onAddReview() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const data = {
      propertyId: this.property.id,
      userId: Number(this.authService.getUserId()),
      rating: this.rating,
      comment: this.comment
    };

    this.reviewService.addReview(data).subscribe({
      next: () => {
        this.successMsg = 'Review added!';
        this.comment = '';

        this.reviewService.getReviewsByProperty(this.property.id).subscribe({
          next: (res) => {
            this.reviews = res;
            this.cdr.detectChanges();
          }
        });
      },
      error: () => this.errorMsg = 'Failed to add review.'
    });
  }

  onMessageOwner() {
    this.router.navigate(['/messages'], {
      queryParams: {
        receiverId: this.property.ownerId,
        propertyId: this.property.id
      }
    });
  }
}