using Microsoft.EntityFrameworkCore;
using WebApp1.Models;

namespace WebApp1.EF
{
    public class DataContext :DbContext
    {
     public DataContext(DbContextOptions<DataContext> options) : base(options){}
        public DbSet<project> Projects { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Negotiation> Negotiations { get; set; }    
        public DbSet<Rejected_negotiations_phases> Negotiation_phases { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Negotiation>()
                .Property(p => p.NegotiationDate)
                .HasColumnType("date");
                 modelBuilder.Entity<Negotiation>()
                .Property(n => n.DiscountAmount)
                .HasColumnType("decimal(5,2)");
        }

    }
}
