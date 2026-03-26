import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-owner-dashboard',
  standalone: false,
  templateUrl: './owner-dashboard.html',
  styleUrls: ['./owner-dashboard.css']
})
export class OwnerDashboard implements OnInit {
  properties: any[] = [];
  reservations: any[] = [];
  activeTab = 'properties';
  editingProperty: any = null;
  successMsg = '';
  errorMsg = '';

  constructor(
    private propertyService: PropertyService,
    private reservationService: ReservationService,
    public authService: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn() || this.authService.getUserRole() !== 'Owner') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProperties();
  }

  loadProperties() {
    const ownerId = Number(this.authService.getUserId());
    this.propertyService.getPropertiesByOwner(ownerId).subscribe({
      next: (res) => {
        this.properties = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadReservations(propertyId: number) {
    this.reservationService.getReservationsByProperty(propertyId).subscribe({
      next: (res) => {
        this.reservations = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  deleteProperty(id: number) {
    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        this.successMsg = 'Property deleted successfully';
        this.loadProperties();
      },
      error: () => this.errorMsg = 'Failed to delete property'
    });
  }

  startEdit(property: any) {
    this.editingProperty = { ...property };
  }

  saveEdit() {
    this.propertyService.updateProperty(this.editingProperty.id, this.editingProperty).subscribe({
      next: () => {
        this.successMsg = 'Property updated successfully';
        this.editingProperty = null;
        this.loadProperties();
      },
      error: () => this.errorMsg = 'Failed to update property'
    });
  }

  updateStatus(reservationId: number, status: string) {
    this.reservationService.updateStatus(reservationId, status).subscribe({
      next: () => {
        this.successMsg = 'Status updated';
        if (this.reservations.length > 0) {
          this.loadReservations(this.reservations[0].propertyId);
        }
      },
      error: () => this.errorMsg = 'Failed to update status'
    });
  }
  onMessageRenter(renterId: number, propertyId: number) {
  this.router.navigate(['/messages'], {
    queryParams: {
      receiverId: renterId,
      propertyId: propertyId
    }
  });
}
editProperty(id: number) {
  this.router.navigate(['/edit-property', id]);
}
}