using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using JewelleryApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers with JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// CORS configuration for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Register Domain & Cloud Services
builder.Services.AddSingleton<IMongoDbService, MongoDbService>();
builder.Services.AddSingleton<IJewelleryDataStore, JewelleryDataStore>();
builder.Services.AddSingleton<IDynamicPricingService, DynamicPricingService>();

// JWT Authentication configuration
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SwarnaMahalJewellersSecretSuperKeyDiwali2026SpecialAuthSecure999";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "JewelleryApi",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "JewelleryStorefront",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// .NET 9 OpenAPI Documentation
builder.Services.AddOpenApi();

var app = builder.Build();

// Ensure wwwroot/uploads directory exists
var webRoot = app.Environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
var uploadsDir = Path.Combine(webRoot, "uploads", "samples");
Directory.CreateDirectory(uploadsDir);

// Configure HTTP request pipeline
app.MapOpenApi();

app.UseCors("AllowFrontend");
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed initial data during startup
using (var scope = app.Services.CreateScope())
{
    var dataStore = scope.ServiceProvider.GetRequiredService<IJewelleryDataStore>();
    await dataStore.SeedInitialDataAsync();
}

app.Run();
