using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.Data;
using RentAPlace.Models;

namespace RentAPlace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropertyController(AppDbContext context)
        {
            _context = context;
        }

        // Add property
        [HttpPost]
        public IActionResult AddProperty(Property property)
        {
            _context.Properties.Add(property);
            _context.SaveChanges();

            return Ok(property);
        }

        // Get all properties
        [HttpGet]
        public IActionResult GetProperties()
        {
            var properties = _context.Properties.ToList();
            return Ok(properties);
        }

        // Get properties by ownerid
        [HttpGet("owner/{ownerId}")]
        public IActionResult GetPropertiesByOwner(int ownerId)
        {
            var properties = _context.Properties
                .Where(p => p.OwnerId == ownerId)
                .ToList();

            return Ok(properties);
        }
        // Get property by id
        [HttpGet("{id}")]
        public IActionResult GetPropertyById(int id)
        {
            var property = _context.Properties.FirstOrDefault(p => p.Id == id);

            if (property == null)
                return NotFound("Property not found");

            return Ok(property);
        }
        // Delete property by ownerid
        [HttpDelete("{id}")]
        public IActionResult DeleteProperty(int id)
        {
            var property = _context.Properties.Find(id);

            if (property == null)
            {
                return NotFound("Property not found");
            }

            _context.Properties.Remove(property);
            _context.SaveChanges();

            return Ok("Property deleted successfully");
        }
        // Update property
        [HttpPut("{id}")]
        public IActionResult UpdateProperty(int id, Property updatedProperty)
        {
            var property = _context.Properties.FirstOrDefault(p => p.Id == id);

            if (property == null)
            {
                return NotFound("Property not found");
            }

            property.Title = updatedProperty.Title;
            property.Description = updatedProperty.Description;
            property.Location = updatedProperty.Location;
            property.PropertyType = updatedProperty.PropertyType;
            property.PricePerNight = updatedProperty.PricePerNight;

            _context.SaveChanges();

            return Ok(property);
        }
        // Upload property image
        [HttpPost("upload-image")]
        public IActionResult UploadImage(int propertyId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            var image = new PropertyImage
            {
                PropertyId = propertyId,
                ImageUrl = "/uploads/" + fileName
            };

            _context.PropertyImages.Add(image);
            _context.SaveChanges();

            return Ok(image);
        }
        // Get Property Images
        [HttpGet("images/{propertyId}")]
        public IActionResult GetPropertyImages(int propertyId)
        {
            var images = _context.PropertyImages
                .Where(i => i.PropertyId == propertyId)
                .ToList();

            return Ok(images);
        }
        //Property search
        [HttpGet("search")]
        public IActionResult SearchProperties(string? location, string? type, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Properties.AsQueryable();

            if (!string.IsNullOrEmpty(location))
                query = query.Where(p => p.Location.ToLower().Contains(location.ToLower()));

            if (!string.IsNullOrEmpty(type))
                query = query.Where(p => p.PropertyType.ToLower().Contains(type.ToLower()));

            if (minPrice.HasValue)
                query = query.Where(p => p.PricePerNight >= minPrice);

            if (maxPrice.HasValue)
                query = query.Where(p => p.PricePerNight <= maxPrice);

            return Ok(query.ToList());
        }
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedProperties()
        {
            var topRated = await _context.Properties
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Location,
                    p.PricePerNight,

                    AverageRating = _context.Reviews
                        .Where(r => r.PropertyId == p.Id)
                        .Average(r => (double?)r.Rating) ?? 0
                })
                .OrderByDescending(p => p.AverageRating)
                .Take(10)
                .ToListAsync();

            return Ok(topRated);
        }
        [HttpDelete("delete-image/{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var image = await _context.PropertyImages.FindAsync(imageId);

            if (image == null)
                return NotFound("Image not found");

            // Delete file from folder
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.ImageUrl.TrimStart('/'));

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.PropertyImages.Remove(image);
            await _context.SaveChangesAsync();

            return Ok("Image deleted successfully");
        }
    }
}