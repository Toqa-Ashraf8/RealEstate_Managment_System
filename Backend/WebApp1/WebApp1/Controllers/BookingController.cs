using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using WebApp1.EF;
using System.Data;
using System.Data.SqlClient;
using WebApp1.Models;
using System.Diagnostics.Contracts;

namespace WebApp1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;
        SqlConnection conn;
        public BookingController(DataContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
            conn = new SqlConnection(_context.Database.GetConnectionString());
        }

    //******************* Get Client Data Automatically to Complete Booking ************
        [Route("GetBookingClientData")]
        [HttpPost]
        public JsonResult GetBookingClientData([FromBody] BookingClient cl)
        {
            int id = Convert.ToInt32(cl.ClientID);
            DataTable dt = new DataTable();
            if (id > 0){

            
            string sqlget = @"select * from Negotiations where ClientID=@ClientID AND ProjectName=@ProjectName
                              AND Unit=@Unit";
                    using(SqlCommand cmd=new SqlCommand(sqlget, conn))
                    {
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@ClientID", id);
                        cmd.Parameters.AddWithValue("@ProjectName", cl.ProjectName);
                        cmd.Parameters.AddWithValue("@Unit", cl.Unit);
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(dt);
                        if (conn.State == ConnectionState.Open) conn.Close();

                    }
            }
            return new JsonResult(dt);
        }
        //***************************** Save NationalID Cards Images *******************
        [Route("SaveNationalID_Images")]
        [HttpPost]
        public JsonResult SaveNationalID_Images([FromForm] upload_NationalID_Images cardimg)
        {
            var postedFile = cardimg.formFile;
            string fileName = postedFile.FileName;
            var physicalPath = _env.ContentRootPath + "/NationalIDCard_Images/" + fileName;
            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                postedFile.CopyTo(stream);
            }
            return new JsonResult(fileName);
        }
        //***************************** Save Checks Images ******************************
        [Route("SaveChecks_Images")]
        [HttpPost]
        public JsonResult SaveChecks_Images([FromForm] upload_Checks_Images checkimg)
        {
            var postedFile = checkimg.file_c;
            string fileName = postedFile.FileName;
            var physicalPath = _env.ContentRootPath + "/Checks_Images/" + fileName;
            using (var stream = new FileStream(physicalPath, FileMode.Create))
            {
                postedFile.CopyTo(stream);
            }
            return new JsonResult(fileName);
        }
        //*************************** Save Booking Client Data ********************************
        [Route("SaveBookingClient")]
        [HttpPost]
        public JsonResult SaveBookingClient([FromBody]ClientBookingDetail client)
        {
            int id = Convert.ToInt32(client.BookingID);
            bool saved = false;
            if (id == 0)
            {
                string sqlinsert = @"insert into ClientBookingDetails (NationalID,NationalIdImagePath,SecondaryPhone,Address,ReservationAmount,PaymentMethod,
                                    InstallmentYears,CheckImagePath,ClientID,ClientName,ProjectName,Unit) 
                                    values (@NationalID,@NationalIdImagePath,@SecondaryPhone,@Address,@ReservationAmount,@PaymentMethod,@InstallmentYears,@CheckImagePath
                                            ,@ClientID,@ClientName,@ProjectName,@Unit)SELECT SCOPE_IDENTITY()";
                using(SqlCommand cmd=new SqlCommand(sqlinsert, conn))
                {
                    if (conn.State == ConnectionState.Closed) conn.Open();
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@NationalID",client.NationalID);
                    cmd.Parameters.AddWithValue("@NationalIdImagePath", client.NationalIdImagePath);
                    cmd.Parameters.AddWithValue("@SecondaryPhone", client.SecondaryPhone);
                    cmd.Parameters.AddWithValue("@Address", client.Address);
                    cmd.Parameters.AddWithValue("@ReservationAmount", client.ReservationAmount);
                    cmd.Parameters.AddWithValue("@PaymentMethod", client.PaymentMethod);
                    cmd.Parameters.AddWithValue("@InstallmentYears", client.InstallmentYears);
                    cmd.Parameters.AddWithValue("@CheckImagePath", string.IsNullOrEmpty(client.CheckImagePath) ? DBNull.Value : client.CheckImagePath);
                    cmd.Parameters.AddWithValue("@ClientID", client.ClientID);
                    cmd.Parameters.AddWithValue("@ClientName", client.ClientName);
                    cmd.Parameters.AddWithValue("@ProjectName", client.ProjectName);
                    cmd.Parameters.AddWithValue("@Unit", client.Unit);
                    id = Convert.ToInt32(cmd.ExecuteScalar());
                    if (conn.State == ConnectionState.Open) conn.Close();
                    saved = true;

                }

            }
            
                var data = new { saved = saved, id = id };
            return new JsonResult(data);

        }

    }
}
