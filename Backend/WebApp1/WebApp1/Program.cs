using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using System.Reflection.Emit;
using System.Text;
using WebApp1.EF;
using WebApp1.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Enable cors 
builder.Services.AddCors(c=>
c.AddPolicy("AllowOrigin",options=>options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

//Enable Json Serialize 
builder.Services.AddControllersWithViews().AddNewtonsoftJson(c =>
c.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
 .AddNewtonsoftJson(c =>
c.SerializerSettings.ContractResolver = new DefaultContractResolver());

//Enable Dbcontext
builder.Services.AddDbContext<DataContext>(options =>
        options.UseSqlServer(
        builder.Configuration.GetConnectionString("connT")
    )
);

//Enable JWT 
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        var jwtsettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtsettings.SecretKey));
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtsettings.Issuer,
            ValidAudience = jwtsettings.Audience,
            IssuerSigningKey = key
        };
 });
builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider=new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos_projects")),
      RequestPath = "/Photos_projects"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Photos_Units")),
    RequestPath = "/Photos_Units"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "NationalIDCard_Images")),
    RequestPath = "/NationalIDCard_Images"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Checks_Images")),
    RequestPath = "/Checks_Images"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "InstallmentChecks_Images")),
    RequestPath = "/InstallmentChecks_Images"
});
app.UseHttpsRedirection();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
