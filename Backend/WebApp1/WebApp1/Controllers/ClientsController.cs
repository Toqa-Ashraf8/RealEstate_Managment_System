using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using System.Xml.Linq;
using WebApp1.EF;
using WebApp1.Models;
namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;
        SqlConnection conn;
        public ClientsController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
             _env=env;
            conn = new SqlConnection(_context.Database.GetConnectionString());
        }
        //*********************** Get Projects to put in a Select ******************
        [Route("GetProjects")]
        [HttpGet]
        public JsonResult GetProjects()
        {
            DataTable dt = new DataTable();
            string sqlg = "select ProjectCode,ProjectName from Projects";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);

        }
        //**************************** Get Units By Project Name ******************
        [Route("getUnits")]
        [HttpPost]
        public JsonResult getUnits(string projectname)
        {
            DataTable dt = new DataTable();
            string sqlg = "select UnitName from Units where ProjectName ='" + projectname + "'";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);

        }

        //********************************** Get Price Of Unit ********************
        [Route("getPriceOfUnit")]
        [HttpPost]
        public JsonResult getPriceOfUnit(string unitname)
        {
            DataTable dt = new DataTable();
            string sqlg = "select TotalPrice from Units where unitName ='" + unitname + "'";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);

        }
        //******************* Save Clients with their negotiation requests ********
        [Route("SaveClients")]
        [HttpPost]
        public JsonResult SaveClients([FromBody] Client cl)
        {
           
            int id = Convert.ToInt32(cl.ClientID);
           
            if (id == 0 )
            {
                try
                {
                    string sqlin = @"insert into Clients (ClientName,PhoneNumber,
                            ClientStatus,Notes) values(@ClientName,@PhoneNumber,@ClientStatus,@Notes)select SCOPE_IDENTITY()";
                    using (SqlCommand cmd = new SqlCommand(sqlin, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ClientName", cl.ClientName);
                        cmd.Parameters.AddWithValue("@PhoneNumber", cl.PhoneNumber);
                        cmd.Parameters.AddWithValue("@ClientStatus", cl.ClientStatus);
                        cmd.Parameters.AddWithValue("@Notes", cl.Notes);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        id = Convert.ToInt32(cmd.ExecuteScalar());
                        if (conn.State == ConnectionState.Open) conn.Close();
                    }

                }
                catch (Exception ex)
                {

                    return new JsonResult(new { error = ex.Message });
                }
            }
            else
            {
                try
                {
                    string sqlupdate = @"update Clients set ClientName=@ClientName,PhoneNumber=@PhoneNumber,
                                     ClientStatus=@ClientStatus,Notes=@Notes where ClientID=@ClientID";
                    using (SqlCommand cmd = new SqlCommand(sqlupdate, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ClientName", cl.ClientName);
                        cmd.Parameters.AddWithValue("@PhoneNumber", cl.PhoneNumber);
                        cmd.Parameters.AddWithValue("@ClientStatus", cl.ClientStatus);
                        cmd.Parameters.AddWithValue("@Notes", cl.Notes);
                        cmd.Parameters.AddWithValue("@ClientID", id);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();

                    }

                }
                catch (Exception ex)
                {
                    return new JsonResult(new { error = ex.Message });
                }


            }
            if (cl.negotiations.Count > 0)
            { 
                        try
                        {

                            string sqld = @"delete Negotiations where ClientID=@ClientID";
                            using (SqlCommand cmd = new SqlCommand(sqld, conn))
                            {
                                cmd.Parameters.Clear();
                                cmd.Parameters.AddWithValue("@ClientID", id);
                                if (conn.State == ConnectionState.Closed) conn.Open();
                                cmd.ExecuteNonQuery();
                                if (conn.State == ConnectionState.Open) conn.Close();

                            }

                         string sqlin_dtls = @"insert into Negotiations (serialCode,ProjectName,Unit,OriginalPrice,NegotiationPrice,
                                                        DiscountAmount,ClientID,ClientName,NegotiationStatus,
                                                          NegotiationDate,checkedByAdmin) values(@serialCode,@ProjectName,@Unit,@OriginalPrice,@NegotiationPrice,
                                                           @DiscountAmount,@ClientID,@ClientName,@NegotiationStatus,@NegotiationDate,
                                                           @checkedByAdmin)";
                            using (SqlCommand cmd = new SqlCommand(sqlin_dtls, conn))
                            {
                                if (conn.State == ConnectionState.Closed) conn.Open();
                                foreach (var neg in cl.negotiations)
                                {
                                    cmd.Parameters.Clear();
                                    cmd.Parameters.AddWithValue("@serialCode", neg.serialCode);
                                    cmd.Parameters.AddWithValue("@projectName", neg.ProjectName);
                                    cmd.Parameters.AddWithValue("@Unit", neg.Unit);
                                    cmd.Parameters.AddWithValue("@OriginalPrice", neg.OriginalPrice);
                                    cmd.Parameters.AddWithValue("@NegotiationPrice", neg.NegotiationPrice);
                                    cmd.Parameters.AddWithValue("@DiscountAmount", neg.DiscountAmount);
                                    cmd.Parameters.AddWithValue("@ClientID", id);
                                    cmd.Parameters.AddWithValue("@ClientName", cl.ClientName);
                                    cmd.Parameters.AddWithValue("@NegotiationStatus", neg.NegotiationStatus);
                                    cmd.Parameters.AddWithValue("@NegotiationDate", neg.NegotiationDate);
                                    cmd.Parameters.AddWithValue("@checkedByAdmin", neg.checkedByAdmin);
                                    cmd.ExecuteNonQuery();
                                }
                                   
                              if (conn.State == ConnectionState.Open) conn.Close();
                        } 
                               
                        }
                        catch (Exception) { throw; }

            }
            var data = new { id = id };
            return new JsonResult(data);
        }
        //******************* Delete Clients and their negotiations***************
        [Route("DeleteClient")]
        [HttpDelete]
        public JsonResult DeleteClient(int id)
        {
            bool deleted = false;
            if (id > 0)
            {
                try
                {
                    string sqld_dtls = "delete Negotiations where ClientID=" + id;
                    using (SqlCommand cmd = new SqlCommand(sqld_dtls, conn))
                    {
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();
                    }

                    string sqld = "delete Clients where ClientID=" + id;
                    using (SqlCommand cmd = new SqlCommand(sqld, conn))
                    {
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();
                    }
                    deleted = true;

                }
                catch { deleted = false; }

            }
            var data = new { deleted = deleted };
            return new JsonResult(data);
        }
        //******************** Search Clients ************************************
        [Route("SearchClients")]
        [HttpGet]
        public JsonResult SearchClients()
        {
            DataTable dt = new DataTable();
            string sqlg = "select * from Clients";
            SqlDataAdapter da = new SqlDataAdapter(sqlg, conn);
            da.Fill(dt);
            return new JsonResult(dt);
        }
        //************************** Get negotiation of client *******************
        [Route("GetNegotiationsByClient")]
        [HttpPost]
        public JsonResult GetNegotiationsByClient(int clientid)
        {
            DataTable dt = new DataTable();
            string sqlg = "select * from Negotiations where ClientID=@ClientID";
            SqlCommand cmd = new SqlCommand(sqlg, conn);
            
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@ClientID", clientid);
            if (conn.State == ConnectionState.Closed) conn.Open();
            cmd.ExecuteNonQuery();
            if (conn.State == ConnectionState.Open) conn.Close();
          
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            return new JsonResult(dt);
        }
        //*************************** Get first client ***************************
        [Route("GetFirstClient")]
        [HttpGet]
        public JsonResult GetFirstClient()
        {
            DataTable dt = new DataTable();
            int first_clientId = 0;
            bool isnull = false;
            string sqlgetFirst = "select top(1)* from Clients order by ClientID ASC";
            SqlDataAdapter da = new SqlDataAdapter(sqlgetFirst, conn);
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                first_clientId = Convert.ToInt32(dt.Rows[0]["ClientID"]);
                isnull = false;
                
            }
            else
            {
                isnull = true;

            }
            var negotiations_f = _context.Negotiations.Where(n => n.ClientID == first_clientId).ToList();
            var data = new { dt = dt, negotiations_f = negotiations_f , isnull = isnull };
            return new JsonResult(data);
            
            
        }
        //************************** Get last Client *****************************
        [Route("GetLastClient")]
        [HttpGet]
        public JsonResult GetLastClient()
        {
            DataTable dt = new DataTable();
            int last_clientid = 0;
            bool isnull = false;
            string sqlgetLast = "select top(1)* from Clients order by ClientID DESC";
            SqlDataAdapter da = new SqlDataAdapter(sqlgetLast, conn);
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                last_clientid = Convert.ToInt32(dt.Rows[0]["ClientID"]);
                 isnull = false;

            }
            else
            {
                isnull = true;
            }
                var negotiations_l = _context.Negotiations.Where(n => n.ClientID == last_clientid).ToList();
            var data = new { dt = dt, negotiations_l = negotiations_l, isnull= isnull };
            return new JsonResult(data);
        }
        //************************ Get Next Client *******************************
        [Route("GetNextClient")]
        [HttpPost]
        public JsonResult GetNextClient(int id)
        {
            bool empty_db = false;
            DataTable dt_all = new DataTable();
            DataTable dt = new DataTable();
            int next_clientid = 0;
            bool islast = false;
            string sqlall = "select * from Clients";
            using (SqlCommand cmdd = new SqlCommand(sqlall, conn))
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                SqlDataAdapter sqla = new SqlDataAdapter(cmdd);
                sqla.Fill(dt_all);
                if (conn.State == ConnectionState.Open) conn.Close();
                if (dt_all.Rows.Count > 0)
                {
                    empty_db = false;
                }
                else
                {
                    empty_db = true;
                }

            }
            //************************************************************************
            if (empty_db == false)
            {
                try
                {

                    string sqlnext = "select top(1)* from Clients where ClientID > @ClientID order by ClientID ASC";
                    SqlCommand cmd = new SqlCommand(sqlnext, conn);
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ClientID", id);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                    if (conn.State == ConnectionState.Open) conn.Close();
                    if (dt.Rows.Count > 0)
                    {
                        next_clientid = Convert.ToInt32(dt.Rows[0]["ClientID"]);
                        islast = false;
                    }
                    else
                    {
                        string sqllast = "select * from Clients where ClientID = @ClientID";
                        SqlCommand cmdl = new SqlCommand(sqllast, conn);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmdl.Parameters.Clear();
                        cmdl.Parameters.AddWithValue("@ClientID", id);
                        SqlDataAdapter da_l = new SqlDataAdapter(cmdl);
                        da_l.Fill(dt);
                        if (conn.State == ConnectionState.Open) conn.Close();
                        if (dt.Rows.Count > 0)
                        {
                            islast = true;
                            next_clientid = Convert.ToInt32(dt.Rows[0]["ClientID"]);

                        }
                    }

                }
                catch (Exception ex)
                {

                    return new JsonResult(new { error = ex.Message });
                }

            }
       
            var negotiations_n = _context.Negotiations.Where(n => n.ClientID == next_clientid).ToList();
            var data = new { dt = dt, negotiations_n = negotiations_n,islast=islast , empty_db = empty_db };
            return new JsonResult(data);
        }
        //******************************* Get Previous Client ********************
        [Route("GetpreviousClient")]
        [HttpPost]
        public JsonResult GetpreviousClient(int id)
        {
            DataTable dt = new DataTable();
            DataTable dt_all = new DataTable();
            int previous_clientid = 0;
            bool isfirst = false;
            bool empty_db = false;
            string sqlall = "select * from Clients";
            using (SqlCommand cmdd = new SqlCommand(sqlall, conn))
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                SqlDataAdapter sqla = new SqlDataAdapter(cmdd);
                sqla.Fill(dt_all);
                if (conn.State == ConnectionState.Open) conn.Close();
                if (dt_all.Rows.Count > 0)
                {
                    empty_db = false;
                }
                else
                {
                    empty_db = true;
                }

            }
            if (empty_db == false)
            {

                try
                {
                    string sqlnext = @"select top(1)* from Clients where ClientID < @ClientID order by ClientID DESC";
                    SqlCommand cmd = new SqlCommand(sqlnext, conn);
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ClientID", id);
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);
                    if (conn.State == ConnectionState.Open) conn.Close();
                    if (dt.Rows.Count > 0)
                    {
                        previous_clientid = Convert.ToInt32(dt.Rows[0]["ClientID"]);
                        isfirst = false;

                    }
                    else
                    {
                        string sqlfirst = @"select * from Clients where ClientID=@ClientID";
                        SqlCommand cmdf = new SqlCommand(sqlfirst, conn);
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmdf.Parameters.Clear();
                        cmdf.Parameters.AddWithValue("@ClientID", id);
                        SqlDataAdapter daa = new SqlDataAdapter(cmdf);
                        daa.Fill(dt);
                        if (conn.State == ConnectionState.Open) conn.Close();
                        if (dt.Rows.Count > 0)
                        {
                            isfirst = true;
                            previous_clientid = Convert.ToInt32(dt.Rows[0]["ClientID"]);
                        }


                    }

                }
                catch (Exception ex)
                {

                    return new JsonResult(new { error = ex.Message });
                }

            }

            var negotiations_p = _context.Negotiations.Where(n => n.ClientID == previous_clientid).ToList();
            var data = new { dt = dt, negotiations_p = negotiations_p,isfirst=isfirst , empty_db = empty_db };
            return new JsonResult(data);
        }


    }
}
