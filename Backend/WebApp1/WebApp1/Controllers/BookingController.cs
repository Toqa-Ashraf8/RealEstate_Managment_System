using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlClient;
using System.Diagnostics.Contracts;
using WebApp1.EF;
using WebApp1.Models;

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
        //***************************** Save Client Checks Images ******************************
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
        //***************************** Save Installment Checks Images ****************************
        [Route("SaveInstallmentChecks_Images")]
        [HttpPost]
        public JsonResult SaveInstallmentChecks_Images([FromForm] upload_Installment_Checks check)
        {
            var postedFile = check.checkfile;
            string fileName=postedFile.FileName;
            var physicalPath = _env.ContentRootPath + "/InstallmentChecks_Images/" + fileName;
            using(var stream=new FileStream(physicalPath, FileMode.Create))
            {
                postedFile.CopyTo(stream);
            }
            return new JsonResult(fileName);

        }
        //*************************** Save Booking Client Data ********************************
        [Route("SaveBookingClient")]
        [HttpPost]
        public JsonResult SaveBookingClient([FromBody] ClientBookingDetail client)
        {
            int booking_id = Convert.ToInt32(client.BookingID);
            bool saved_m = false;
            bool saved_d = false;
            bool updated = false;

            if (booking_id == 0)
            {
                try
                {
                    string sqlinsert = @"insert into ClientBookingDetails (NationalID,NationalIdImagePath,SecondaryPhone,Address,Job,ReservationAmount,PaymentMethod,
                                    CheckImagePath,DownPayment,FirstInstallmentDate,InstallmentYears,ClientID,
                                    ClientName,ProjectName,Unit) 
                                    values (@NationalID,@NationalIdImagePath,@SecondaryPhone,@Address,@Job,@ReservationAmount,@PaymentMethod,
                                           @CheckImagePath,@DownPayment,@FirstInstallmentDate,@InstallmentYears,
                                           @ClientID,@ClientName,@ProjectName,@Unit)SELECT SCOPE_IDENTITY()";
                    using (SqlCommand cmd = new SqlCommand(sqlinsert, conn))
                    {
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@NationalID", client.NationalID);
                        cmd.Parameters.AddWithValue("@NationalIdImagePath", client.NationalIdImagePath);
                        cmd.Parameters.AddWithValue("@SecondaryPhone", client.SecondaryPhone);
                        cmd.Parameters.AddWithValue("@Address", client.Address);
                        cmd.Parameters.AddWithValue("@Job", client.Job);
                        cmd.Parameters.AddWithValue("@ReservationAmount", client.ReservationAmount);
                        cmd.Parameters.AddWithValue("@PaymentMethod", client.PaymentMethod);
                        cmd.Parameters.AddWithValue("@CheckImagePath", string.IsNullOrEmpty(client.CheckImagePath) ? DBNull.Value : client.CheckImagePath);
                        cmd.Parameters.AddWithValue("@DownPayment", client.DownPayment);
                        cmd.Parameters.AddWithValue("@FirstInstallmentDate", client.FirstInstallmentDate);
                        cmd.Parameters.AddWithValue("@InstallmentYears", client.InstallmentYears);
                        cmd.Parameters.AddWithValue("@ClientID", client.ClientID);
                        cmd.Parameters.AddWithValue("@ClientName", client.ClientName);
                        cmd.Parameters.AddWithValue("@ProjectName", client.ProjectName);
                        cmd.Parameters.AddWithValue("@Unit", client.Unit);
                        booking_id = Convert.ToInt32(cmd.ExecuteScalar());
                        if (conn.State == ConnectionState.Open) conn.Close();
                        saved_m = true;

                    }

                }
                catch{ saved_m = false; }     
            }
            else
            {
                try
                {
                    string updatedata = @"update ClientBookingDetails set NationalID=@NationalID,NationalIdImagePath=@NationalIdImagePath,
                                     SecondaryPhone=@SecondaryPhone,Address=@Address,Job=@Job,ReservationAmount=@ReservationAmount,
                                     PaymentMethod=@PaymentMethod,CheckImagePath=@CheckImagePath,DownPayment=@DownPayment,
                                     FirstInstallmentDate=@FirstInstallmentDate,InstallmentYears=@InstallmentYears,
                                     ClientID=@ClientID,ClientName=@ClientName,ProjectName=@ProjectName,Unit=@Unit 
                                     where BookingID=@BookingID";
                    using (SqlCommand cmd = new SqlCommand(updatedata, conn))
                    {
                        if (conn.State == ConnectionState.Closed) conn.Open();
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@NationalID", client.NationalID);
                        cmd.Parameters.AddWithValue("@NationalIdImagePath", client.NationalIdImagePath);
                        cmd.Parameters.AddWithValue("@SecondaryPhone", client.SecondaryPhone);
                        cmd.Parameters.AddWithValue("@Address", client.Address);
                        cmd.Parameters.AddWithValue("@Job", client.Job);
                        cmd.Parameters.AddWithValue("@ReservationAmount", client.ReservationAmount);
                        cmd.Parameters.AddWithValue("@PaymentMethod", client.PaymentMethod);
                        cmd.Parameters.AddWithValue("@CheckImagePath", string.IsNullOrEmpty(client.CheckImagePath) ? DBNull.Value : client.CheckImagePath);
                        cmd.Parameters.AddWithValue("@DownPayment", client.DownPayment);
                        cmd.Parameters.AddWithValue("@FirstInstallmentDate", client.FirstInstallmentDate);
                        cmd.Parameters.AddWithValue("@InstallmentYears", client.InstallmentYears);
                        cmd.Parameters.AddWithValue("@ClientID", client.ClientID);
                        cmd.Parameters.AddWithValue("@ClientName", client.ClientName);
                        cmd.Parameters.AddWithValue("@ProjectName", client.ProjectName);
                        cmd.Parameters.AddWithValue("@Unit", client.Unit);
                        cmd.Parameters.AddWithValue("@BookingID", booking_id);
                        cmd.ExecuteNonQuery();
                        if (conn.State == ConnectionState.Open) conn.Close();
                        updated = true;

                    }

                }
                catch { updated = false;  }
               
            }
            if (client.installments.Count > 0)
            { 
                string delete_old_installments = @"delete Installments where BookingID=@BookingID";
                 using(SqlCommand cmd=new SqlCommand(delete_old_installments, conn))
                 {    if (conn.State == ConnectionState.Closed) conn.Open();
                       cmd.Parameters.Clear();
                       cmd.Parameters.AddWithValue("@BookingID", booking_id);
                       cmd.ExecuteNonQuery();
                       if (conn.State == ConnectionState.Open) conn.Close();
                       saved_d = true;
                 }
                foreach (var item in client.installments)
                {              
                    try
                    {
                       
                        string insert_installments = @"insert into Installments (InstallmentNumber,DueDate,Months,MonthlyAmount,
                                                      Paid,PaymentType,CheckImage,BookingID) values 
                                                      (@InstallmentNumber,@DueDate,@Months,@MonthlyAmount,@Paid,@PaymentType,@CheckImage,
                                                       @BookingID)"; 
                       
                        using(SqlCommand cmd=new SqlCommand(insert_installments, conn))
                        {
                            if (conn.State == ConnectionState.Closed) conn.Open();
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@InstallmentNumber", item.InstallmentNumber);
                            cmd.Parameters.AddWithValue("@DueDate", item.DueDate);
                            cmd.Parameters.AddWithValue("@Months", item.Months);
                            cmd.Parameters.AddWithValue("@MonthlyAmount", item.MonthlyAmount);
                            cmd.Parameters.AddWithValue("@Paid", item.Paid);
                            cmd.Parameters.AddWithValue("@PaymentType", string.IsNullOrEmpty(item.PaymentType) ? DBNull.Value : item.PaymentType);
                            cmd.Parameters.AddWithValue("@CheckImage", string.IsNullOrEmpty(item.CheckImage) ? DBNull.Value : item.CheckImage);
                            cmd.Parameters.AddWithValue("@BookingID", booking_id);
                            cmd.ExecuteNonQuery();
                            saved_d = true;

                        }  
                        if (conn.State == ConnectionState.Open) conn.Close();
                    }
                    catch{ saved_d = false;}
                } 
            }
            var data = new { saved_m = saved_m, booking_id = booking_id, updated=updated,saved_d=saved_d};
            return new JsonResult(data);

        }
        //*************************** Generate installment Table *******************************
        [Route("GenerateInstallments")]
        [HttpPost]
        public JsonResult GenerateInstallments([FromBody]InstallmentDetails request)
        {
            int initial_payment_status = 0;
            if (request == null || request.InstallmentYears <= 0)
                return new JsonResult("بيانات غير صالحة");
            var installments = new List<InstallmentViewModel>();
            //الحساب المتبقي من غير المقدم
            int remainingAmount = request.TotalAmount - request.DownPayment;
            //حساب عدد الشهور من عدد السنين
            int TotalMonths = request.InstallmentYears * 12;
            //قيمة القسط الشهري 
            decimal monthlyPrice = remainingAmount / TotalMonths;

            for (int i = 1; i <= TotalMonths; i++)
            {
                installments.Add(new InstallmentViewModel
                {
                    InstallmentNumber = i,
                    // إضافة شهر في كل لفة بناءً على تاريخ أول قسط
                    DueDate = request.FirstInstallmentDate.AddMonths(i - 1),
                    Months = TotalMonths,
                    MonthlyAmount = monthlyPrice,
                    Paid = initial_payment_status

                });

            }
            return new JsonResult(installments);

        }
        //*************************** Updated Negotiation Requests to Reserved ******************
        [Route("ChangeToReserved")]
        [HttpPost]
        public JsonResult ChangeToReserved([FromBody] NegotiationViewModel neg)
        {
            bool saved = false;
            string sqlup = @"Update Negotiations set Reserved=1 where ClientID=@ClientID AND ProjectName=@ProjectName
                            And Unit=@Unit";
            using(SqlCommand cmd=new SqlCommand(sqlup, conn))
            {
                if (conn.State == ConnectionState.Closed) conn.Open();
                cmd.Parameters.Clear();
                cmd.Parameters.AddWithValue("@ClientID", neg.ClientID);
                cmd.Parameters.AddWithValue("@ProjectName",neg.ProjectName);
                cmd.Parameters.AddWithValue("@Unit", neg.Unit);
                cmd.ExecuteNonQuery();
                if (conn.State == ConnectionState.Open) conn.Close();
                saved = true;
            }
            return new JsonResult(saved);
        }
    }
}
