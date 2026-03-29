using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using WebApp1.EF;
using System.Globalization;

namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DataContext _context;
        SqlConnection conn;
        public DashboardController(DataContext context)
        {
            _context = context;
            conn=new SqlConnection(_context.Database.GetConnectionString());
        }
        [Route("GetProjectsUnitsStats")]
        [HttpGet]
        public JsonResult GetProjectsUnitsStats()
        {

            DataTable dt = new DataTable();
            string sql= @"SELECT p.ProjectName, COUNT(u.UnitID) as TotalUnitsCount
                         FROM Projects p
                         LEFT JOIN Units u ON p.ProjectCode = u.ProjectCode
                         GROUP BY p.ProjectName";
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlDataAdapter da = new SqlDataAdapter(sql, conn);
            da.Fill(dt);
            if (conn.State == ConnectionState.Open) conn.Close();
            return new JsonResult(dt);

        }
        [Route("GetDailyStats")]
        [HttpGet]
        public JsonResult GetDailyStats()
        {
          
            DataTable dt = new DataTable();
            string sqls = @"SELECT 
                    MONTH(NegotiationDate) AS MonthNumber, 
                    COUNT(*) AS BookingCount
                    FROM Negotiations
                    WHERE YEAR(NegotiationDate) = YEAR(GETDATE())
                    GROUP BY MONTH(NegotiationDate)";

     
            if (conn.State == ConnectionState.Closed) conn.Open();
            SqlDataAdapter da = new SqlDataAdapter(sqls, conn);
            da.Fill(dt);
            if (conn.State == ConnectionState.Open) conn.Close();
            var finalResult = Enumerable.Range(1, 12).Select(i => {
                var row = dt.AsEnumerable().FirstOrDefault(r => Convert.ToInt32(r["MonthNumber"]) == i);

                return new
                {
                    MonthName = CultureInfo.GetCultureInfo("ar-EG").DateTimeFormat.GetMonthName(i),
                    
                    BookingCount = row != null ? Convert.ToInt32(row["BookingCount"]) : 0,
                    MonthNumber = i
                };
            }).ToList();
            return new JsonResult(finalResult);
        
    }

    }
}
