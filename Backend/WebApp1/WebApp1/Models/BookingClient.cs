namespace WebApp1.Models
{
    public class BookingClient
    {
        public int ClientID { get; set; }
        public string ClientName { get; set; }
        public string ProjectName { get; set; }
        public string Unit { get; set; }
    }
    public class InstallmentData
    {
        public int DownPayment { get; set; }
        public DateTime FirstInstallmentDate { get; set; }
        public int InstallmentYears { get; set; }
    }
}
