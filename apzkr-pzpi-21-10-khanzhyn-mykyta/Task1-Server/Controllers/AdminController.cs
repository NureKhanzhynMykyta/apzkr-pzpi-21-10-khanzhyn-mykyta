using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StudCheck_back.Authorization;
using StudCheck_back.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudCheck_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminCredentials _adminCredentials;

        public AdminController(IOptions<AdminCredentials> adminCredentials)
        {
            _adminCredentials = adminCredentials.Value;
        }

        // Авторизація аміністратора та генерація JWT-токена
        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminCredentials loginCredentials)
        {
            try
            {
                if (loginCredentials.Username == _adminCredentials.Username && loginCredentials.Password == _adminCredentials.Password)
                {
                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, _adminCredentials.Username),
                        new Claim(ClaimTypes.Role, "admin")
                    };

                    var jwt = new JwtSecurityToken(
                            issuer: AuthOptions.ISSUER,
                            audience: AuthOptions.AUDIENCE,
                            claims: claims,
                            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(2)),
                            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
                    );

                    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                    var response = new
                    {
                        access_token = encodedJwt,
                    };

                    Console.WriteLine("Admin Authorized");
                    return Ok(response);
                }

                return Unauthorized(new { error = "Invalid credentials." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Login: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
