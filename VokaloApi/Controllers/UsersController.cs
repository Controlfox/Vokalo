using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VokaloApi.Data;
using VokaloApi.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Identity.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace VokaloApi.Controllers
{
    [ApiController]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public UsersController(AppDbContext db) { _db = db; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll() =>
            await _db.Users.ToListAsync();

        [HttpGet("byname")]
        public async Task<ActionResult<User>> GetByUsername(string username) =>
            await _db.Users.FirstOrDefaultAsync(u => u.Username == username) is User u ? Ok(new[] { u }) : NotFound();



        [HttpPost]
        public async Task<ActionResult<User>> Create(RegisterRequest req)
        {
            if (await _db.Users.AnyAsync(u => u.Username == req.Username))
                return Conflict("Användarnamn upptaget!");

            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                PasswordHash = hash,
                Role = req.Role,
                Parent = req.Parent,
                Children = req.Children
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }



        [HttpPatch("{id}")]
        public async Task<ActionResult<User>> Patch(int id, [FromBody] Newtonsoft.Json.Linq.JObject patch)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            // Tillämpa ändringar, t.ex. parent/children
            if (patch["children"] != null)
                user.Children = patch["children"].ToObject<List<string>>();
            await _db.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
            if (user == null) return Unauthorized("Fel användarnamn eller lösenord");

            if(!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized("Fel användarnamn eller lösenord");

            //JWT-Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("ensuperhemlignyckelbarajagkan123456789");
            var tokenDescriptior = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };
            var token = tokenHandler.CreateToken(tokenDescriptior);
            var tokenString = tokenHandler.WriteToken(token);

            //Returnera user
            return Ok(new
            {
                token = tokenString,
                user = new {
                    user.Id,
                    user.Username,
                    user.Role,
                    user.Parent,
                    user.Children
                }
            });
        }

        [HttpGet("children/{parentUsername}")]
        public async Task<ActionResult<List<User>>> GetChildren(string parentUsername)
        {
            //Hämta alla users där parent = parentusername och role = child
            var children = await _db.Users
                .Where(u => u.Parent == parentUsername && u.Role == "child")
                .ToListAsync();
            return Ok(children);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        public class LoginRequest
        {
            public string Username {get; set;}
            public string Password {get; set;}
        }

        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Password { get; set; } // plaintext
            public string Role { get; set; }
            public string? Parent { get; set; }
            public List<string>? Children { get; set; }
        }

        
    }
}