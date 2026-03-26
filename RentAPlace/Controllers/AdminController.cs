using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.Data;
using RentAPlace.DTOs;
namespace RentAPlace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("login")]
        public IActionResult AdminLogin(LoginDto loginUser)
        {
            var admin = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == loginUser.Email && u.Role.RoleName == "Admin");

            if (admin == null)
            {
                return Unauthorized("Admin not found");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginUser.Password, admin.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid password");
            }

            return Ok(admin);
        }
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users
                .Include(u => u.Role)
                .ToList();

            return Ok(users);
        }
        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound("User not found");

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok("User deleted successfully");
        }
        [HttpGet("properties")]
        public IActionResult GetAllProperties()
        {
            var properties = _context.Properties.ToList();

            return Ok(properties);
        }
        [HttpDelete("properties/{id}")]
        public IActionResult DeleteProperty(int id)
        {
            var property = _context.Properties.Find(id);

            if (property == null)
                return NotFound("Property not found");

            _context.Properties.Remove(property);
            _context.SaveChanges();

            return Ok("Property deleted successfully");
        }
    }
}
