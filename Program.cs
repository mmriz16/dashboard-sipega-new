var builder = WebApplication.CreateBuilder(args);

// Razor Pages
builder.Services.AddRazorPages();

// CORS buat development (kalo butuh API dari frontend terpisah)
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("DevCors");
}

// Static files (CSS, JS, images dari wwwroot/)
app.UseStaticFiles();

app.UseRouting();

app.MapRazorPages();

// Contoh API endpoint
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", timestamp = DateTime.Now }));

app.Run();
