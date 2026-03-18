using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApp1.Models
{
    public class ClientBookingDetail
    {
        [Key]
        public int BookingID { get; set; }
        public string NationalID { get; set; }
        public string NationalIdImagePath { get; set; }
        public string SecondaryPhone { get; set; }
        public string Address { get; set; }
        public int ReservationAmount { get; set; }
        public string PaymentMethod { get; set; }
        public int InstallmentYears { get; set; }
        public string CheckImagePath { get; set; }
        [ForeignKey("ClientID")]
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public string ProjectName { get; set; }
        public string Unit { get; set; }


    }
}
