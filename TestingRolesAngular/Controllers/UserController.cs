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
        public IActionResult Login(LoginModel loginModel)
        {
            var role = GetUserRole(loginModel.Username, loginModel.Password);

            if (role != null)
            {
                var token = GenerateJwtToken(loginModel.Username, role);
                SetTokenCookie(token);

                return Ok(new { message = "Login successful" });
            }

            return BadRequest(new { message = "Invalid credentials" });
        }


        [HttpGet("admin")]
        [Authorize(Roles = "admin")]
        public IActionResult Admin()
        {
            return Ok("Welcome, Admin!");
        }

        [HttpGet("worker")]
        [Authorize(Roles = "admin,worker")]
        public IActionResult Worker()
        {
            return Ok("Welcome, Worker!");
        }

        [HttpGet("user")]
        [Authorize]
        public IActionResult User()
        {
            return Ok("Welcome, User!");
        }

        private string GetUserRole(string username, string password)
        {
            switch (username)
            {
                case "user":
                    if (password == "123")
                        return "user";
                    break;
                case "worker":
                    if (password == "123")
                        return "worker";
                    break;
                case "admin":
                    if (password == "123")
                        return "admin";
                    break;
                default:
                    return null;
            }
            return null;
        }


        private string GenerateJwtToken(string username, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(1),
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append("AuthToken", token, cookieOptions);
        }
    }
}
