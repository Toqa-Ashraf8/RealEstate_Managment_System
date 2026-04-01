using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using WebApp1.EF;
using WebApp1.Models;
namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsProfileController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _environment;
        SqlConnection conn;
        
        public ClientsProfileController(DataContext context,IWebHostEnvironment env)
        {
            _context=context;
            _environment=env;
            conn = new SqlConnection(_context.Database.GetConnectionString());
        }
        [Route("GetAllClients")]
        [HttpGet]
        public JsonResult GetAllClients()
        {
            DataTable dt = new DataTable();
            string sql = "select * from Clients";
            SqlDataAdapter da=new SqlDataAdapter(sql, conn);
            if (conn.State == ConnectionState.Closed) conn.Open();
            da.Fill(dt);
            if (conn.State == ConnectionState.Open) conn.Close();
            return new JsonResult(dt);
        }
        [Route("GetClientDetails")]
        [HttpPost]
        public JsonResult GetClientDetails(int clientid)
        {
            DataTable bookingdt = new DataTable();
            DataTable unitdt = new DataTable();
            //var cd = new List<ClientBookingDetail>();
            string sqlg = @"select * from reserved_clients_details where ClientID=@ClientID";
            if (conn.State== ConnectionState.Closed) conn.Open();
            using (SqlCommand cmd = new SqlCommand(sqlg, conn))
            {
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@ClientID", clientid);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(bookingdt);
              
            }
            
            if (conn.State == ConnectionState.Open) conn.Close();
            var data = new { bookingdt = bookingdt, unitdt = unitdt };
            return new JsonResult(data);




        }


    }
}
