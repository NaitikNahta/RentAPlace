using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentAPlace.Data;
using RentAPlace.DTOs;
using RentAPlace.Models;

namespace RentAPlace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessageController(AppDbContext context)
        {
            _context = context;
        }

        // Send message
        [HttpPost]
        public IActionResult SendMessage(SendMessageDto dto)
        {
            var message = new Message
            {
                SenderId = dto.SenderId,
                ReceiverId = dto.ReceiverId,
                PropertyId = dto.PropertyId,
                Content = dto.Content
            };

            _context.Messages.Add(message);
            _context.SaveChanges();

            return Ok("Message sent successfully");
        }

        // Get conversation between two users for a property
        [HttpGet("conversation")]
        public IActionResult GetConversation(int senderId, int receiverId, int propertyId)
        {
            var messages = _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m =>
                    ((m.SenderId == senderId && m.ReceiverId == receiverId) ||
                     (m.SenderId == receiverId && m.ReceiverId == senderId))
                     && m.PropertyId == propertyId)
                .OrderBy(m => m.SentAt)
                .Select(m => new
                {
                    m.Id,
                    Sender = m.Sender.Name,
                    Receiver = m.Receiver.Name,
                    m.Content,
                    m.SentAt
                })
                .ToList();

            return Ok(messages);
        }
    }
}