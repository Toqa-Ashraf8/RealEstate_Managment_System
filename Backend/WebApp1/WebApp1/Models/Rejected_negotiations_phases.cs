using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace WebApp1.Models
{
    public class Rejected_negotiations_phases
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ClientID { get; set; }
        public Boolean NegotiationCondition { get; set; }
        public int SuggestedPrice { get; set; }
        public string ReasonOfReject { get; set; }
        public DateTime CheckedDate { get; set; }


    }
}
