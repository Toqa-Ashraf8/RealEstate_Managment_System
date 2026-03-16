using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json.Serialization;
using System.Reflection.Emit;
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

//***********************************************

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//-----------------------------------------------
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
//----------------------------------------------
app.UseHttpsRedirection();
app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseAuthorization();

app.MapControllers();

app.Run();
