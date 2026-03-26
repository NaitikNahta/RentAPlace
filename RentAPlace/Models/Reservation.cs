using System.Text.Json.Serialization;
namespace RentAPlace.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int PropertyId { get; set; }

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public string Status { get; set; } = "Pending";

        [JsonIgnore]
        public User? User { get; set; }

        [JsonIgnore]
        public Property? Property { get; set; }
    }
}