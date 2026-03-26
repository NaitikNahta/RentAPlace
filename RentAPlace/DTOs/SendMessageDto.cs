namespace RentAPlace.DTOs
{
    public class SendMessageDto
    {
        public int SenderId { get; set; }

        public int ReceiverId { get; set; }

        public int PropertyId { get; set; }

        public string Content { get; set; }
    }
}