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

        // GET /users
        // Returnerar alla användare i databasen
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll() =>
            await _db.Users.ToListAsync();

        // GET /users/byname?username=namn
        // Hämtar användare utifrån användarnamn, returnerar en array med en användare eller 404
        [HttpGet("byname")]
        public async Task<ActionResult<User>> GetByUsername(string username) =>
            await _db.Users.FirstOrDefaultAsync(u => u.Username == username) is User u ? Ok(new[] { u }) : NotFound();

        // POST /users
        // Skapar en ny användare (parent eller child).
        [HttpPost]
        public async Task<ActionResult<User>> Create(RegisterRequest req)
        {
            // Kolla om användarnamnet redan finns
            if (await _db.Users.AnyAsync(u => u.Username == req.Username))
                return Conflict("Användarnamn upptaget!");

            // Hasha lösenordet för säkerhet
            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                PasswordHash = hash,
                Role = req.Role,
                Parent = req.Parent,
                Children = req.Children
            };

            // Lägg till i databasen
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            // Returnera 201 Created och användaren
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }

        // PATCH /users/{id}
        // Uppdaterar delar av en användare (t.ex. children-listan)
        [HttpPatch("{id}")]
        public async Task<ActionResult<User>> Patch(int id, [FromBody] Newtonsoft.Json.Linq.JObject patch)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Tillämpa ändringar från JSON (här endast children)
            if (patch["children"] != null)
                user.Children = patch["children"].ToObject<List<string>>();
            await _db.SaveChangesAsync();
            return Ok(user);
        }

        // POST /users/login
        // Loggar in användare och returnerar JWT-token samt grundläggande användarinfo.
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest req)
        {
            //Hämta användare från DB
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
            if (user == null) return Unauthorized("Fel användarnamn eller lösenord");

            //Kontrollera lösenord med hash
            if(!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
                return Unauthorized("Fel användarnamn eller lösenord");

            // Skapa JWT-token med claims för namn och roll
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

        // GET /users/children/{parentUsername}
        // Returnerar alla barn som är kopplade till en förälder
        [HttpGet("children/{parentUsername}")]
        public async Task<ActionResult<List<User>>> GetChildren(string parentUsername)
        {
            var children = await _db.Users
                .Where(u => u.Parent == parentUsername && u.Role == "child")
                .ToListAsync();
            return Ok(children);
        }

        // GET /users/{id}
        // Hämtar en användare utifrån dess id
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetById(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // Request-modell för inloggning
        public class LoginRequest
        {
            public string Username {get; set;}
            public string Password {get; set;}
        }

        // Request-modell för registrering av ny användare
        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
            public string? Parent { get; set; }
            public List<string>? Children { get; set; }
        }

        
    }
}