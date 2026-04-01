using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class setUnitID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Rejected_negotiations_phases",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCode",
                table: "Rejected_negotiations_phases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitID",
                table: "Rejected_negotiations_phases",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCode",
                table: "Negotiations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitID",
                table: "Negotiations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClientID",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientName",
                table: "Installments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCode",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "Installments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "Installments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitID",
                table: "Installments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectCode",
                table: "ClientBookingDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UnitID",
                table: "ClientBookingDetails",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Rejected_negotiations_phases");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "Rejected_negotiations_phases");

            migrationBuilder.DropColumn(
                name: "UnitID",
                table: "Rejected_negotiations_phases");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "Negotiations");

            migrationBuilder.DropColumn(
                name: "UnitID",
                table: "Negotiations");

            migrationBuilder.DropColumn(
                name: "ClientID",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ClientName",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ProjectName",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "Unit",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "UnitID",
                table: "Installments");

            migrationBuilder.DropColumn(
                name: "ProjectCode",
                table: "ClientBookingDetails");

            migrationBuilder.DropColumn(
                name: "UnitID",
                table: "ClientBookingDetails");
        }
    }
}
