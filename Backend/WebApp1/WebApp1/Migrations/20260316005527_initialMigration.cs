using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class initialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClientStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientID);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectCode = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalUnits = table.Column<int>(type: "int", nullable: true),
                    ProjectStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectImage = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectCode);
                });

            migrationBuilder.CreateTable(
                name: "Rejected_negotiations_phases",
                columns: table => new
                {
                    ClientID = table.Column<int>(type: "int", nullable: false),
                    NegotiationCondition = table.Column<bool>(type: "bit", nullable: false),
                    SuggestedPrice = table.Column<int>(type: "int", nullable: false),
                    ReasonOfReject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rejected_negotiations_phases", x => x.ClientID);
                });

            migrationBuilder.CreateTable(
                name: "Negotiations",
                columns: table => new
                {
                    serialCode = table.Column<int>(type: "int", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OriginalPrice = table.Column<int>(type: "int", nullable: false),
                    NegotiationPrice = table.Column<int>(type: "int", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ClientID = table.Column<int>(type: "int", nullable: false),
                    ClientName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NegotiationStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NegotiationDate = table.Column<DateTime>(type: "date", nullable: false),
                    checkedByAdmin = table.Column<bool>(type: "bit", nullable: false)
                },
               constraints: table =>
               {
                   table.PrimaryKey("PK_Negotiations", x => x.ClientID);
               });


            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    serial = table.Column<int>(type: "int", nullable: false),
                    unitName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Floor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalArea = table.Column<float>(type: "real", nullable: true),
                    MeterPrice = table.Column<int>(type: "int", nullable: true),
                    TotalPrice = table.Column<float>(type: "real", nullable: true),
                    unitStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    unitImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProjectCode = table.Column<int>(type: "int", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                   
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectCode);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Negotiations_ClientID",
                table: "Negotiations",
                column: "ClientID");

            migrationBuilder.CreateIndex(
                name: "IX_Units_ProjectCode1",
                table: "Units",
                column: "ProjectCode1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Negotiations");

            migrationBuilder.DropTable(
                name: "Rejected_negotiations_phases");

            migrationBuilder.DropTable(
                name: "Units");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
