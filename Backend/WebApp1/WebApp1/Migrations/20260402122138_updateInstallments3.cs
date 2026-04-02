using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class updateInstallments3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientID",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "UnitID",
                table: "Installments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientID",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCode",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitID",
                table: "Installments",
                type: "int",
                nullable: true);
        }
    }
}
