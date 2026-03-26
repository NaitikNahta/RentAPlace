using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentAPlace.Data;
using RentAPlace.DTOs;
using RentAPlace.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using RentAPlace.Services;
namespace RentAPlace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public UserController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            if (user == null || string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("Email and Password are required");
            }

            user.Email = user.Email.ToLower();
            // normalize email
            user.Email = user.Email.ToLower();
            // check if email already exists
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email already registered");
            }

            //for special character, number, uppercase and lowercase
            var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$";

            if (!Regex.IsMatch(user.Password, passwordPattern))
            {
                return BadRequest("Password must contain uppercase, lowercase, number and special character.");
            }

            if (user.RoleId == 1)
            {
                return BadRequest("Admin accounts cannot be registered.");
            }
            // hash password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(user);
        }
        [HttpPost("login")]
        public IActionResult Login(LoginDto loginUser)
        {
            if (string.IsNullOrEmpty(loginUser.Email) || string.IsNullOrEmpty(loginUser.Password))
            {
                return BadRequest("Email and Password are required");
            }

            var email = loginUser.Email?.ToLower();

            var user = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.Email == email);

            if (user == null)
            {
                return Unauthorized("Invalid email");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid password");
            }

            var token = _jwtService.GenerateToken(
                user.Id,
                user.Email!,
                user.Role?.RoleName ??""
            );

            return Ok(new
            {
                token = token,
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role?.RoleName
            });
        }
    }
}