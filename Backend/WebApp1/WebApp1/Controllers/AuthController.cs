using Azure.Core;
using BCrypt.Net;
using BCrypt.Net;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
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
        [Route("Register")]
        [HttpPost]
        public JsonResult Register([FromBody] User user)
        {
            bool isExisted = false;
            DataTable dt = new DataTable();
            string hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password);

            string sqls = @"select Email from Users Where Email=@Email";
            SqlCommand cmd = new SqlCommand(sqls, conn);
            
                if (conn.State == ConnectionState.Closed) conn.Open();
                cmd.Parameters.Clear();              
                cmd.Parameters.AddWithValue("@Email", user.Email);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);
                if (dt.Rows.Count > 0)
                {
                   isExisted = true;
                   var message = new { isExisted = isExisted };
                   return new JsonResult(message);
                }
                if (conn.State == ConnectionState.Open) conn.Close();
            
            string sqlin = @"insert into Users (UserName,Email,Password,Role) 
                          values(@UserName,@Email,@Password,@Role) SELECT SCOPE_IDENTITY()";

            using(SqlCommand cmdin=new SqlCommand(sqlin, conn))
            {
                isExisted = false;
                if (conn.State == ConnectionState.Closed) conn.Open();
                cmdin.Parameters.Clear();
                cmdin.Parameters.AddWithValue("@UserName", user.UserName);
                cmdin.Parameters.AddWithValue("@Email", user.Email);
                cmdin.Parameters.AddWithValue("@Password", hashedPassword);
                cmdin.Parameters.AddWithValue("@Role", user.Role);
                cmdin.ExecuteScalar();
               
            }
            var claims = new []
            {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role), 
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "MyRealEstateApi",
                audience: "MyRealEstateReactApp",
                claims: claims,
                expires: DateTime.Now.AddHours(7),
                signingCredentials: creds
            );
            if (conn.State == ConnectionState.Open) conn.Close();
            var data = new { token = new JwtSecurityTokenHandler().WriteToken(token) , role=user.Role};
            return new JsonResult(data);

        }

        [Route("Login")]
        [HttpPost]
        public JsonResult Login([FromBody]Login userData)
        {
            bool islogged = false;
            bool isNull = false;
            string savedPassword = "";
            string user_role = "";
            if (userData == null) 
            {
                isNull = true;
                var message = new { isNull = isNull };
                return new JsonResult(message);
            }
            string sqls = @"select * from Users where Email=@Email";
            SqlCommand cmd = new SqlCommand(sqls, conn);
            if (conn.State == ConnectionState.Closed) conn.Open();
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@Email", userData.Email);
            DataTable dt = new DataTable();
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                savedPassword = dt.Rows[0]["Password"].ToString();
                user_role = dt.Rows[0]["Role"].ToString();

            }
            
            bool isPasswordValid = BCrypt.Net.BCrypt.EnhancedVerify(userData.Password, savedPassword);
            if (isPasswordValid)
            {
                islogged = true;
            }
            else
            {
                Response.StatusCode = 401;
                return new JsonResult(new { message = "Unauthorized Access" });
            }
                var claims = new[]
                    {
                    new Claim(ClaimTypes.Name, dt.Rows[0]["UserName"].ToString()),
                    new Claim(ClaimTypes.Role, dt.Rows[0]["Role"].ToString()),
                 };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "MyRealEstateApi",
                audience: "MyRealEstateReactApp",
                claims: claims,
                expires: DateTime.Now.AddHours(7),
                signingCredentials: creds
            );
            if (conn.State == ConnectionState.Open) conn.Close();
            var data = new { token = new JwtSecurityTokenHandler().WriteToken(token),role= user_role };
            return new JsonResult(data);

        }
    } 
}
