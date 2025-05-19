using Microsoft.EntityFrameworkCore;
using VokaloApi.Models;

namespace VokaloApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Glosa> Glosor => Set<Glosa>();
    }
}