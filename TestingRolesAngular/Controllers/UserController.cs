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
            var (role, additionalRoles) = GetUserRoles(loginModel.Username, loginModel.Password);

            if (role != null)
            {
                var token = GenerateJwtToken(loginModel.Username, role, additionalRoles);
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

        private (string role, string[] additionalRoles) GetUserRoles(string username, string password)
        {
            switch (username)
            {
                case "user":
                    if (password == "123")
                        return ("user", new string[0]);
                    break;
                case "worker":
                    if (password == "123")
                        return ("worker", new[] { "user" });
                    break;
                case "admin":
                    if (password == "123")
                        return ("admin", new[] { "worker", "user" });
                    break;
                default:
                    return (null, new string[0]);
            }
            return (null, new string[0]);
        }

        private string GenerateJwtToken(string username, string role, string[] additionalRoles)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_key);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            // Add additional roles as claims
            claims.AddRange(additionalRoles.Select(r => new Claim(ClaimTypes.Role, r)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
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
                HttpOnly = false,
                Secure = true,
                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("AuthToken", token, cookieOptions);
        }
    }
}
