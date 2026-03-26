namespace RentAPlace.DTOs
{
    public class AddReviewDto
    {
        public int PropertyId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}