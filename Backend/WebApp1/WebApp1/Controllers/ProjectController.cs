using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using WebApp1.EF;
using WebApp1.Models;
namespace WebApp1.Controllers
  
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;
        SqlConnection conn;
        public ProjectController(DataContext context, IWebHostEnvironment env)
        {
            _context=context;
            _env=env;
             conn=new SqlConnection(_context.Database.GetConnectionString());

        }
        //***************************** Save Images Of Projects **************************
        [Route("SaveImages")]
        [HttpPost]
        public JsonResult SaveImages ([FromForm] uploadImg uploadimg)

        {
            var postedFile = uploadimg.file;
            string fileName = postedFile.FileName;
            var physicalPath = _env.ContentRootPath + "/Photos_projects/" + fileName;
            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                postedFile.CopyTo(stream);
            }
            return new JsonResult(fileName);
        }
        //***************************** Save Images Of Units *****************************
        [Route("SaveImagesUnits")]
        [HttpPost]
        public JsonResult SaveImagesUnits([FromForm] UploadImgu imgu)
        {
            var postedFile = imgu.fileu;
            string fileName = postedFile.FileName;
            var physicalPath = _env.ContentRootPath + "/Photos_Units/" + fileName;
            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                postedFile.CopyTo(stream);
            }
            return new JsonResult(fileName);
        }

        //********************** Save Projects (Master) With Units (Details) **************
        [Route("SaveAll")]
        [HttpPost]
        public JsonResult SaveAll([FromBody]project prj)
        {
           
            bool allFieldsAreEmpty = true;
            bool errorOccured=false;
            int id=Convert.ToInt32(prj.ProjectCode);
            if (!string.IsNullOrEmpty(prj.ProjectName)) allFieldsAreEmpty = false;
          
            if (allFieldsAreEmpty)
            {
                errorOccured = true;
                var errorData = new { id = 0, errorOccured = true };
               
                return new JsonResult(errorData); 
            }

            if (id == 0) 
            {
                
                try
                {
                    string sqlin = @"insert into Projects (ProjectName,ProjectType,Location,TotalUnits,ProjectStatus,ProjectImage)
                                     values(@ProjectName,@ProjectType,@Location,@TotalUnits,@ProjectStatus,@ProjectImage)
                                       SELECT SCOPE_IDENTITY()";

                    using (SqlCommand cmd = new SqlCommand(sqlin, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProjectName", prj.ProjectName );
                        cmd.Parameters.AddWithValue("@ProjectType", prj.ProjectType );
                        cmd.Parameters.AddWithValue("@Location", prj.Location );
                        cmd.Parameters.AddWithValue("@TotalUnits", prj.TotalUnits );
                        cmd.Parameters.AddWithValue("@ProjectStatus", prj.ProjectStatus);
                        cmd.Parameters.AddWithValue("@ProjectImage", prj.ProjectImage );
                        if(conn.State != ConnectionState.Open) conn.Open();
                        id =Convert.ToInt32(cmd.ExecuteScalar());
                        if(conn.State != ConnectionState.Closed)conn.Close();
                       
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
                    string sqlup = @"update Projects set ProjectName=@ProjectName,ProjectType=@ProjectType,Location=@Location
                                    ,TotalUnits=@TotalUnits,ProjectStatus=@ProjectStatus,
                                     ProjectImage=@ProjectImage
                                    where ProjectCode=@ProjectCode";

                    using (SqlCommand cmd = new SqlCommand(sqlup, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ProjectName", prj.ProjectName );
                        cmd.Parameters.AddWithValue("@ProjectType", prj.ProjectType);
                        cmd.Parameters.AddWithValue("@Location", prj.Location );
                        cmd.Parameters.AddWithValue("@TotalUnits", prj.TotalUnits);
                        cmd.Parameters.AddWithValue("@ProjectStatus", prj.ProjectStatus);
                        cmd.Parameters.AddWithValue("@ProjectImage", prj.ProjectImage);
                        cmd.Parameters.AddWithValue("@ProjectCode", id)
                            ;
                        if (conn.State != ConnectionState.Open) conn.Open();
                        cmd.ExecuteNonQuery();
                        if (conn.State != ConnectionState.Closed) conn.Close();
                    }

                }
                catch (Exception ex)
                {
                    return new JsonResult(new { error = ex.Message });
                }
            }


            try
            {
                string sqldel_u = @"delete Units where ProjectCode =@ProjectCode";
                using (SqlCommand cmd = new SqlCommand(sqldel_u, conn))
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ProjectCode", id);
                    if (conn.State != ConnectionState.Open) conn.Open();
                    cmd.ExecuteNonQuery();
                    if (conn.State != ConnectionState.Closed) conn.Close();
                }

                if(prj.Units !=null && prj.Units.Count > 0) { 
                string sqlin_u = @"insert into Units (serial,unitName,Floor,TotalArea,MeterPrice,TotalPrice,unitStatus,unitImage,ProjectCode,ProjectName)
                                 values(@serial,@unitName,@Floor,@TotalArea,@MeterPrice,@TotalPrice,@unitStatus,@unitImage,@ProjectCode,@ProjectName)";
                    if (conn.State != ConnectionState.Open) conn.Open();
                    using (SqlCommand cmd = new SqlCommand(sqlin_u, conn))
                    {
                        foreach (var unit in prj.Units)
                        {
                            cmd.Parameters.Clear();
                            cmd.Parameters.Add("@serial", SqlDbType.Int).Value = unit.serial;
                            cmd.Parameters.Add("@unitName", SqlDbType.NVarChar).Value = unit.unitName ;
                            cmd.Parameters.Add("@Floor", SqlDbType.NVarChar).Value = unit.Floor;
                            cmd.Parameters.Add("@TotalArea", SqlDbType.Decimal).Value =  Convert.ToDecimal(unit.TotalArea) ;                         
                            cmd.Parameters.Add("@MeterPrice", SqlDbType.Int).Value =  Convert.ToInt32(unit.MeterPrice) ;                        
                            cmd.Parameters.Add("@TotalPrice", SqlDbType.Float).Value =  Convert.ToDouble(unit.TotalPrice);
                            cmd.Parameters.Add("@unitStatus", SqlDbType.NVarChar).Value = unit.unitStatus;
                            cmd.Parameters.AddWithValue("@unitImage", string.IsNullOrEmpty(unit.unitImage) ? DBNull.Value : unit.unitImage);
                            cmd.Parameters.Add("@ProjectCode", SqlDbType.Int).Value = id;                          
                            cmd.Parameters.Add("@ProjectName", SqlDbType.NVarChar).Value =prj.ProjectName ;
                            cmd.ExecuteNonQuery();
                        }
                    }
                    if (conn.State != ConnectionState.Closed) conn.Close();
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { error = ex.Message });
            }
                var data = new { id = id , errorOccured = errorOccured};
                return new JsonResult(data);
        }
        //********************** Delete Projects (Master) With Units (Details) **************

        [Route("DeleteAll")]
        [HttpPost]
        public JsonResult DeleteAll(int id)
        {
            
            bool delOk = false;
            if (id > 0) 
            { 
            try
            {
                
                string sqldel_u = @"delete Units where ProjectCode=@projectCode";
                using (SqlCommand cmd = new SqlCommand(sqldel_u, conn))
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@projectCode", id);
                    if (conn.State != ConnectionState.Open) conn.Open();
                    cmd.ExecuteNonQuery();
                    if (conn.State != ConnectionState.Closed) conn.Close();

                }

                string sqldel = @"delete Projects where ProjectCode=@projectCode";
                using (SqlCommand cmd = new SqlCommand(sqldel, conn))
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@projectCode", id);
                    if (conn.State != ConnectionState.Open) conn.Open();
                    cmd.ExecuteNonQuery();
                    if (conn.State != ConnectionState.Closed) conn.Close();
                   
                }
               
                delOk = true;
            }
            catch 
            {
                delOk = false;
            }
            }
            return new JsonResult(delOk);
        }
        //************************ Get Projects (Master) To Search ***************************
        [Route("SearchMaster")]
        [HttpGet]
        public JsonResult SearchMaster()
        {
            DataTable dt = new DataTable();
            string sqls = @"select * from Projects";
            SqlDataAdapter da = new SqlDataAdapter(sqls, conn);
            da.Fill(dt);
            return new JsonResult(dt);

        }
        //************************ Get Units (Details) ****************************************
        [Route("GetDtls")]
        [HttpPost]
        public JsonResult GetDtls(int projectId)
         {
            DataTable dt = new DataTable();
            string sqlg_dtls = @"select * from Units where ProjectCode=@ProjectCode";
            SqlCommand cmd = new SqlCommand(sqlg_dtls, conn);
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@ProjectCode", projectId);
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(dt);
            return new JsonResult(dt);

        }
        //---------------------------------------------- END -----------------------------------------------------
    }
}
