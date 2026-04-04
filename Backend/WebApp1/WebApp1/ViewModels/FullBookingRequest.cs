using WebApp1.Models;

namespace WebApp1.ViewModels
{
    public class FullBookingRequest
    {
        public BookingDetail ClientDetails { get; set; }
        public ClientBooking BookingDetails { get; set; }
    }
}
