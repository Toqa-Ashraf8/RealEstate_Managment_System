using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Text;
using WebApp1.EF;
using WebApp1.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly DataContext _context;
        private readonly JwtSettings _jwt;
        SqlConnection conn;
        public AuthController(IOptions<JwtSettings> jwt, IWebHostEnvironment env, DataContext context)
        {
            _jwt = jwt.Value;
            _env = env;
            _context = context;
            conn = new SqlConnection(_context.Database.GetConnectionString());
        }
       
        




    

    } 
}
