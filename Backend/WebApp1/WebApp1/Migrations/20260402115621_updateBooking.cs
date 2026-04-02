using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class updateBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectName",
                table: "ClientBookingDetails");

            migrationBuilder.DropColumn(
                name: "Unit",
                table: "ClientBookingDetails");

            migrationBuilder.RenameColumn(
                name: "Unit",
                table: "Installments",
                newName: "unitName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "unitName",
                table: "Installments",
                newName: "Unit");

            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "ClientBookingDetails",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "ClientBookingDetails",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
