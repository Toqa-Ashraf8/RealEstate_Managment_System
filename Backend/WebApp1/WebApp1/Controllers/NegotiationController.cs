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
            string sqlg = "select * from Negotiations_2 where checkedByAdmin=0";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);
        }
        //***************************************************************************
        [Route("saveNegotiations_ByAdmin")]
        [HttpPost]
        public JsonResult saveNegotiations_ByAdmin([FromBody] Rejected_negotiations_phase ph)
        {
            bool saved = false;
            bool cond = Convert.ToBoolean(ph.NegotiationCondition);
            string approvedstatement = "مقبول";
            string rejectstatement = "مرفوض";
            if (ph.ClientID!=0)
            {

            try
            {
                string sqlin = @"insert into Rejected_negotiations_phases (ClientID,ProjectName,Unit,NegotiationCondition,
                                SuggestedPrice,ReasonOfReject,CheckedDate) 
                                values(@ClientID,@ProjectName,@Unit,@NegotiationCondition,@SuggestedPrice,@ReasonOfReject,@CheckedDate)";
                using (SqlCommand cmd = new SqlCommand(sqlin, conn))
                {
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                    cmd.Parameters.AddWithValue("@ProjectName", ph.ProjectName);
                    cmd.Parameters.AddWithValue("@Unit", ph.Unit);
                    cmd.Parameters.AddWithValue("@NegotiationCondition", ph.NegotiationCondition);
                    cmd.Parameters.AddWithValue("@SuggestedPrice", ph.SuggestedPrice);
                    cmd.Parameters.AddWithValue("@ReasonOfReject", string.IsNullOrEmpty(ph.ReasonOfReject) ? DBNull.Value : ph.ReasonOfReject);
                    cmd.Parameters.AddWithValue("@CheckedDate",ph.CheckedDate);
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
                    string sqlup = @"update Negotiations set NegotiationStatus='" + approvedstatement + "' , checkedByAdmin=1 where ClientID=@ClientID AND ProjectName=@ProjectName AND Unit=@Unit";
                    using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                    {
                            if (conn.State == ConnectionState.Closed) conn.Open();
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                            cmd.Parameters.AddWithValue("@ProjectName", ph.ProjectName);
                            cmd.Parameters.AddWithValue("@Unit", ph.Unit);
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
                    string sqlup = @"update Negotiations set NegotiationStatus='" + rejectstatement + "' , checkedByAdmin=1 where ClientID=@ClientID AND ProjectName=@ProjectName AND Unit=@Unit";
                    using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                    { 
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.Parameters.Clear();
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@ClientID", ph.ClientID);
                            cmd.Parameters.AddWithValue("@ProjectName", ph.ProjectName);
                            cmd.Parameters.AddWithValue("@Unit", ph.Unit);
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

        [Route("Approved_Rejected")]
        [HttpPost]
        public JsonResult Approved_Rejected([FromBody] Rejected_negotiations_phase ph2)
        {
            bool cond = Convert.ToBoolean(ph2.NegotiationCondition);
            string rejectstatement = "مرفوض";
            string approvedstatement = "مقبول";
            bool updated = true;
            try
            {
                string sqlMerge = @" MERGE INTO Rejected_negotiations_phases AS Target
                                 USING (SELECT @ClientID AS CID, @ProjectName AS PN, @Unit AS U) AS Source
                                ON (Target.ClientID = Source.CID AND Target.ProjectName = Source.PN AND Target.Unit = Source.U)
                            WHEN MATCHED THEN
                                UPDATE SET 
                                NegotiationCondition = @NegotiationCondition,
                                SuggestedPrice = @SuggestedPrice,
                                ReasonOfReject = @ReasonOfReject,
                                CheckedDate = @CheckedDate
                           WHEN NOT MATCHED THEN
                    INSERT (ClientID, ProjectName, Unit, NegotiationCondition, SuggestedPrice, ReasonOfReject, CheckedDate)
                    VALUES (@ClientID, @ProjectName, @Unit, @NegotiationCondition, @SuggestedPrice, @ReasonOfReject, @CheckedDate);";

                using (SqlCommand cmd = new SqlCommand(sqlMerge, conn))
                {
                    cmd.Parameters.AddWithValue("@ClientID", ph2.ClientID);
                    cmd.Parameters.AddWithValue("@ProjectName", ph2.ProjectName);
                    cmd.Parameters.AddWithValue("@Unit", ph2.Unit);
                    cmd.Parameters.AddWithValue("@NegotiationCondition", ph2.NegotiationCondition);
                    cmd.Parameters.AddWithValue("@SuggestedPrice", ph2.SuggestedPrice);
                    cmd.Parameters.AddWithValue("@ReasonOfReject", (object)ph2.ReasonOfReject ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@CheckedDate", ph2.CheckedDate);

                    if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.ExecuteNonQuery();
                    if (conn.State == ConnectionState.Open) conn.Close();
                }
                if (cond == false)
                {

                    try
                    {
                        string sqlup = @"update Negotiations set NegotiationStatus='" + rejectstatement + "' where ClientID=@ClientID AND ProjectName=@ProjectName AND Unit=@Unit";
                        using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                        {
                            if (conn.State == ConnectionState.Closed) conn.Open();
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@ClientID", ph2.ClientID);
                            cmd.Parameters.AddWithValue("@ProjectName", ph2.ProjectName);
                            cmd.Parameters.AddWithValue("@Unit", ph2.Unit);
                            cmd.ExecuteNonQuery();
                            if (conn.State == ConnectionState.Open) conn.Close();

                        }
                    }


                    catch (Exception ex)
                    {
                        return new JsonResult(new { error = ex.Message });
                    }
                }
                if (cond == true)
                {

                    try
                    {
                        string sqlup = @"update Negotiations set NegotiationStatus='" + approvedstatement + "' where ClientID=@ClientID AND ProjectName=@ProjectName AND Unit=@Unit";
                        using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                        {
                            if (conn.State == ConnectionState.Closed) conn.Open();
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@ClientID", ph2.ClientID);
                            cmd.Parameters.AddWithValue("@ProjectName", ph2.ProjectName);
                            cmd.Parameters.AddWithValue("@Unit", ph2.Unit);
                            cmd.ExecuteNonQuery();
                            if (conn.State == ConnectionState.Open) conn.Close();

                        }
                    }


                    catch (Exception ex)
                    {
                        return new JsonResult(new { error = ex.Message });
                    }
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(new { error = ex.Message });
            }

            return new JsonResult(updated);
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
