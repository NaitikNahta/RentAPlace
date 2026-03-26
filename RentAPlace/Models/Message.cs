using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RentAPlace.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        public int PropertyId { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime SentAt { get; set; } = DateTime.Now;

        [ForeignKey("SenderId")]
        public User Sender { get; set; }

        [ForeignKey("ReceiverId")]
        public User Receiver { get; set; }

        [ForeignKey("PropertyId")]
        public Property Property { get; set; }
    }
}