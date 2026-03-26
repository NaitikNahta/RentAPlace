using Microsoft.AspNetCore.Mvc;
using RentAPlace.Data;
using RentAPlace.Models;

namespace RentAPlace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationController(AppDbContext context)
        {
            _context = context;
        }

        // Create reservation
        [HttpPost]
        public IActionResult CreateReservation(Reservation reservation)
        {
            var propertyExists = _context.Properties.Any(p => p.Id == reservation.PropertyId);

            if (!propertyExists)
            {
                return BadRequest("Property does not exist");
            }
            bool isConflict = _context.Reservations.Any(r =>
                r.PropertyId == reservation.PropertyId &&
                reservation.CheckInDate < r.CheckOutDate &&
                reservation.CheckOutDate > r.CheckInDate
            );

            if (isConflict)
            {
                return BadRequest("Property already booked for selected dates.");
            }
            reservation.Status = "Pending";
            _context.Reservations.Add(reservation);
            _context.SaveChanges();

            return Ok(reservation);
        }

        // Get reservations by user
        [HttpGet("user/{userId}")]
        public IActionResult GetReservationsByUser(int userId)
        {
            var reservations = _context.Reservations
                .Where(r => r.UserId == userId)
                .ToList();

            return Ok(reservations);
        }

        // Cancel reservation
        [HttpDelete("{id}")]
        public IActionResult CancelReservation(int id)
        {
            var reservation = _context.Reservations.FirstOrDefault(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound("Reservation not found");
            }

            _context.Reservations.Remove(reservation);
            _context.SaveChanges();

            return Ok("Reservation cancelled");
        }
        //Owner View Bookings
        [HttpGet("property/{propertyId}")]
        public IActionResult GetReservationsByProperty(int propertyId)
        {
            var reservations = _context.Reservations
                .Where(r => r.PropertyId == propertyId)
                .Select(r => new
                {
                    r.Id,
                    r.UserId,
                    r.PropertyId,
                    CheckInDate = r.CheckInDate.ToString("dd-MM-yyyy"),
                    CheckOutDate = r.CheckOutDate.ToString("dd-MM-yyyy"),
                    r.Status
                })
                .ToList();

            return Ok(reservations);
        }
        //Reservation Status Update(Pending,Confirmed,Cancelled)
        [HttpPut("{id}/status")]
        public IActionResult UpdateReservationStatus(int id, [FromQuery] string status)
        {
            var reservation = _context.Reservations.FirstOrDefault(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound("Reservation not found");
            }

            if (status != "Pending" && status != "Confirmed" && status != "Cancelled")
            {
                return BadRequest("Invalid status value");
            }

            reservation.Status = status;

            _context.SaveChanges();

            return Ok(reservation);
        }
        //Property Availability Check
        [HttpGet("check-availability")]
        public IActionResult CheckAvailability(int propertyId, DateTime checkIn, DateTime checkOut)
        {
            var propertyExists = _context.Properties.Any(p => p.Id == propertyId);

            if (!propertyExists)
            {
                return NotFound("Property does not exist");
            }

            bool isBooked = _context.Reservations.Any(r =>
            r.PropertyId == propertyId &&
            r.Status == "Confirmed" &&
            checkIn < r.CheckOutDate &&
            checkOut > r.CheckInDate
            );

            return Ok(new
            {
                propertyId,
                available = !isBooked
            });
        }
    }
}