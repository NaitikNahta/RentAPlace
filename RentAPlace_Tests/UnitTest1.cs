using NUnit.Framework;
using RentAPlace.Models;
using RentAPlace.DTOs;

namespace RentAPlace_Tests
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void User_Model_ShouldHaveCorrectProperties()
        {
            var user = new User
            {
                Id = 1,
                Name = "Naitik",
                Email = "naitik@gmail.com",
                Password = "hashedpassword",
                RoleId = 2
            };

            Assert.That(user.Id, Is.EqualTo(1));
            Assert.That(user.Name, Is.EqualTo("Naitik"));
            Assert.That(user.Email, Is.EqualTo("naitik@gmail.com"));
            Assert.That(user.RoleId, Is.EqualTo(2));
        }

        [Test]
        public void Property_Model_ShouldHaveCorrectProperties()
        {
            var property = new Property
            {
                Id = 1,
                Title = "Beach Villa",
                Location = "Goa",
                PropertyType = "villa",
                PricePerNight = 5000,
                OwnerId = 2
            };

            Assert.That(property.Id, Is.EqualTo(1));
            Assert.That(property.Title, Is.EqualTo("Beach Villa"));
            Assert.That(property.Location, Is.EqualTo("Goa"));
            Assert.That(property.PricePerNight, Is.EqualTo(5000));
        }

        [Test]
        public void Reservation_DefaultStatus_ShouldBePending()
        {
            var reservation = new Reservation();
            Assert.That(reservation.Status, Is.EqualTo("Pending"));
        }

        [Test]
        public void LoginDto_ShouldHoldEmailAndPassword()
        {
            var dto = new LoginDto
            {
                Email = "test@gmail.com",
                Password = "Test@123"
            };

            Assert.That(dto.Email, Is.EqualTo("test@gmail.com"));
            Assert.That(dto.Password, Is.EqualTo("Test@123"));
        }

        [Test]
        public void Review_Rating_ShouldBeInValidRange()
        {
            var review = new Review
            {
                Rating = 4
            };

            Assert.That(review.Rating, Is.InRange(1, 5));
        }

        [Test]
        public void Property_PricePerNight_ShouldBePositive()
        {
            var property = new Property
            {
                PricePerNight = 1500
            };

            Assert.That(property.PricePerNight, Is.GreaterThan(0));
        }

        [Test]
        public void Message_Content_ShouldNotBeEmpty()
        {
            var message = new Message
            {
                Content = "Hello, is this property available?"
            };

            Assert.That(message.Content, Is.Not.Empty);
        }
    }
}