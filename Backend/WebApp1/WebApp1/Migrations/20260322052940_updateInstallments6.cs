using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class updateInstallments6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientBookingDetailBookingID",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Installments_ClientBookingDetailBookingID",
                table: "Installments",
                column: "ClientBookingDetailBookingID");

            migrationBuilder.AddForeignKey(
                name: "FK_Installments_ClientBookingDetails_ClientBookingDetailBookingID",
                table: "Installments",
                column: "ClientBookingDetailBookingID",
                principalTable: "ClientBookingDetails",
                principalColumn: "BookingID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Installments_ClientBookingDetails_ClientBookingDetailBookingID",
                table: "Installments");

            migrationBuilder.DropIndex(
                name: "IX_Installments_ClientBookingDetailBookingID",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ClientBookingDetailBookingID",
                table: "Installments");
        }
    }
}
