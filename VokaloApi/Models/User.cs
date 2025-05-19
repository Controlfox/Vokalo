namespace VokaloApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string Role { get; set; } = "child"; // eller "parent"
        public string? Parent { get; set; } // null för parent, annars username/id på parent
        public List<string>? Children { get; set; } // för parent
    }
}