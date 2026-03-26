using System.Data;
using System.Text.Json.Serialization;

namespace RentAPlace.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int RoleId { get; set; }

        [JsonIgnore]
        public Role? Role { get; set; }
        // Renter or Owner
    }
}
