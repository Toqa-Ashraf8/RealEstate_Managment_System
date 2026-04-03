using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using System.IO;
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
            DataTable dt = new DataTable();
            var units_installments = new List<UnitInstallments>();

            string sqld = @"select * from ClientFullDetails where ClientID=@ClientID";
            if (conn.State == ConnectionState.Closed) conn.Open();
            using (SqlCommand cmd = new SqlCommand(sqld, conn))
            {
                cmd.Parameters.AddWithValue("@ClientID", clientid);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(bookingdt);
            }
                string sqlg = @"SELECT 
                                b.BookingID, 
                                b.UnitID, 
                                b.unitName, 
                                b.ProjectName,
                                b.BookingDate,
                                (SELECT i.DueDate, i.MonthlyAmount, i.Paid 
                                 FROM ClientUnitsBookings i 
                                 WHERE i.BookingID = b.BookingID 
                                 FOR JSON PATH) AS InstallmentsJson
                                 FROM ClientFullDetails b
                                 WHERE b.ClientID = @ClientID";

            using (SqlCommand cmd2 = new SqlCommand(sqlg, conn))
            {
                cmd2.Parameters.AddWithValue("@ClientID", clientid);
                SqlDataAdapter da2 = new SqlDataAdapter(cmd2);
                da2.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {  
                   string json = row["InstallmentsJson"].ToString();
                    var installmentsList = string.IsNullOrEmpty(json)? new List<Installment>()
                        : Newtonsoft.Json.JsonConvert.DeserializeObject<List<Installment>>(json);
                    units_installments.Add(new UnitInstallments
                    {
                        BookingID = Convert.ToInt32(row["BookingID"]),
                        UnitID = Convert.ToInt32(row["UnitID"]),
                        unitName = row["unitName"].ToString(),
                        ProjectName = row["ProjectName"].ToString(),
                        Installments = installmentsList 
                    });
                }
            }
            if (conn.State == ConnectionState.Open) conn.Close();
            var data = new
            {
                clientData=bookingdt,
                bookedUnitsData = units_installments 
            };
            return new JsonResult(data);
        }
    

    }
}
