import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-reservations',
  standalone: false,
  templateUrl: './my-reservations.html',
  styleUrls: ['./my-reservations.css']
})
export class MyReservations implements OnInit {
  reservations: any[] = [];
  successMsg = '';
  errorMsg = '';

  constructor(
    private reservationService: ReservationService,
    public authService: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadReservations();
  }

  loadReservations() {
    const userId = Number(this.authService.getUserId());
    this.reservationService.getReservationsByUser(userId).subscribe({
      next: (res) => {
        this.reservations = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cancelReservation(id: number) {
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.successMsg = 'Reservation cancelled successfully';
        this.loadReservations();
      },
      error: () => this.errorMsg = 'Failed to cancel reservation'
    });
  }
}