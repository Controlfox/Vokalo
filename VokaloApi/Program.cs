using Microsoft.EntityFrameworkCore;
using VokaloApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseInMemoryDatabase("VokaloDb")); // Byt till UseSqlServer för riktig databas

builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", p =>
        p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowReactDev");
app.MapControllers();
app.Run();
