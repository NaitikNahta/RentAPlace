using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.Data;
using RentAPlace.DTOs;
using RentAPlace.Models;

namespace RentAPlace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReviewController(AppDbContext context)
        {
            _context = context;
        }

        // Add Review
        [HttpPost]
        public IActionResult AddReview(AddReviewDto reviewDto)
        {
            var review = new Review
            {
                PropertyId = reviewDto.PropertyId,
                UserId = reviewDto.UserId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();

            return Ok("Review added successfully");
        }

        // Get Reviews by Property
        [HttpGet("property/{propertyId}")]
        public async Task<IActionResult> GetReviewsByProperty(int propertyId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.PropertyId == propertyId)
                .Select(r => new
                {
                    r.ReviewId,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    UserName = r.User.Name
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // Get Average Rating
        [HttpGet("average-rating/{propertyId}")]
        public async Task<IActionResult> GetAverageRating(int propertyId)
        {
            var averageRating = await _context.Reviews
                .Where(r => r.PropertyId == propertyId)
                .AverageAsync(r => (double?)r.Rating);

            return Ok(averageRating ?? 0);
        }
    }
}