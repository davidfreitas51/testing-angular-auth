using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace TestingRolesAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string _key = "stringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegalstringLegal"; // Replace with a strong key in production

        [HttpPost("login")]
        public IActionResult Login(string username, string password)
        {
            // Simple role-based user authentication
            if (username == "user" && password == "123")
            {
                var token = GenerateJwtToken(username, "user");
                return Ok(new { token });
            }
            if (username == "worker" && password == "123")
            {
                var token = GenerateJwtToken(username, "worker");
                return Ok(new { token });
            }
            if (username == "admin" && password == "123")
            {
                var token = GenerateJwtToken(username, "admin");
                return Ok(new { token });
            }

            return BadRequest("Invalid credentials");
        }

        // Endpoint restricted to 'admin' role
        [HttpGet("admin")]
        [Authorize(Roles = "admin")]
        public IActionResult Admin()
        {
            return Ok("Welcome, Admin!");
        }

        // Endpoint restricted to 'admin' or 'worker' roles
        [HttpGet("worker")]
        [Authorize(Roles = "admin,worker")]
        public IActionResult Worker()
        {
            return Ok("Welcome, Worker!");
        }

        // Endpoint accessible to any authenticated user
        [HttpGet("user")]
        [Authorize]
        public IActionResult User()
        {
            return Ok("Welcome, User!");
        }

        // Method to generate JWT token with role claims
        private string GenerateJwtToken(string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role) // Add role claim
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Token expiry time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
