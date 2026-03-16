using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.Metrics;
using WebApp1.EF;
using WebApp1.Models;
namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NegotiationController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;
        SqlConnection conn;
        public NegotiationController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
            conn = new SqlConnection(_context.Database.GetConnectionString());
        }
        [Route("GetNegotationsCount")]
        [HttpGet]
        public JsonResult GetNegotationsCount()
        {
            string query = "SELECT COUNT(*) FROM Negotiations where checkedByAdmin=0";


            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                int count = (int)cmd.ExecuteScalar();
                if (conn.State == ConnectionState.Open) conn.Close();
                return new JsonResult(count);
            }

        }
        //***************************************************************************
        [Route("GetNegotiations")]
        [HttpGet]
        public JsonResult GetNegotiations()
        {
          
            DataTable dt = new DataTable();
            string sqlg = "select * from Negotiations where checkedByAdmin=0";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);
        }
        //***************************************************************************
        [Route("saveNegotiations_ByAdmin")]
        [HttpPost]
        public JsonResult saveNegotiations_ByAdmin([FromBody] Rejected_negotiations_phases ph)
        {
            bool saved = false;
            bool cond = Convert.ToBoolean(ph.NegotiationCondition);
            string approvedstatement = "مقبول";
            string rejectstatement = "مرفوض";
            if (ph.ClientID!=0)
            {

            try
            {
                string sqlin = @"insert into Rejected_negotiations_phases (ClientID,NegotiationCondition,
                                SuggestedPrice,ReasonOfReject,CheckedDate) 
                                values(@ClientID,@NegotiationCondition,@SuggestedPrice,@ReasonOfReject,@CheckedDate)";
                using (SqlCommand cmd = new SqlCommand(sqlin, conn))
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                    cmd.Parameters.AddWithValue("@NegotiationCondition", ph.NegotiationCondition);
                    cmd.Parameters.AddWithValue("@SuggestedPrice", ph.SuggestedPrice);
                    cmd.Parameters.AddWithValue("@ReasonOfReject", string.IsNullOrEmpty(ph.ReasonOfReject) ? DBNull.Value : ph.ReasonOfReject);
                    cmd.Parameters.AddWithValue("@CheckedDate",ph.CheckedDate);
                     if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.ExecuteNonQuery();
                    if (conn.State == ConnectionState.Open) conn.Close();
                    saved = true;
                }

            }
            catch
            {

                saved = false;
            }
                    
            if (cond==true)
            {
                    
                try
                {
                    string sqlup = @"update Negotiations set NegotiationStatus='" + approvedstatement + "' , checkedByAdmin=1 where ClientID=" + ph.ClientID;
                    using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();
                        saved = true;
                    }
                }
                catch 
                {

                    saved = false;
                }
               
            }
            else
            {
                try
                {
                    string sqlup = @"update Negotiations set NegotiationStatus='" + rejectstatement + "' , checkedByAdmin=1 where ClientID=" + ph.ClientID;
                    using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();
                        saved = true;
                    }
                }
                catch
                {

                    saved = false;
                }

            }
            }
            var data = new { saved = saved };
            return new JsonResult(data);
        }
        //***************************************************************************
        [Route("rejected_Requests")]
        [HttpGet]
        public JsonResult rejected_Requests()
        {
            int count = 0;
            DataTable dt = new DataTable();
            string sqld = "select * from Negotiations_2 where NegotiationCondition=0";
            SqlDataAdapter da = new SqlDataAdapter(sqld, conn);
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                count= dt.Rows.Count;
            }
            var data = new { count = count, dt = dt };
            return new JsonResult(data);
        }
         
        //***************************************************************************
        [Route("accepted_Requests")]
        [HttpGet]
        public JsonResult accepted_Requests()
        {
            int count_a = 0;
            DataTable dt = new DataTable();
            string sqld = "select * from Negotiations_2 where NegotiationCondition=1";
            SqlDataAdapter da = new SqlDataAdapter(sqld, conn);
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                count_a = dt.Rows.Count;
               
            }
            var data = new { count_a = count_a, dt = dt };
            return new JsonResult(data);

        }
        //***************************************************************************
       

    }
}
