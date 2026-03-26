using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentAPlace.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        public int PropertyId { get; set; }

        public int UserId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(500)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("PropertyId")]
        public Property Property { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}