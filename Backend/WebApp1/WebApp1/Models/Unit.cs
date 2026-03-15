

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApp1.Models;

public class Unit
 {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int? serial { get; set; }
        public string? unitName{ get; set; }
        public string? Floor { get; set; }
         public float? TotalArea { get; set; }
         public int? MeterPrice { get; set; }
         public float? TotalPrice { get; set; }
         public string? unitStatus { get; set; }
         public string? unitImage { get; set; }
         [ForeignKey("ProjectCode")]
         public int ProjectCode { get; set; }
        public string? ProjectName { get; set; }

}

