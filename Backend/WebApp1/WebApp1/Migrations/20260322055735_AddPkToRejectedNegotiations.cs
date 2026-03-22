using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp1.Migrations
{
    /// <inheritdoc />
    public partial class AddPkToRejectedNegotiations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.AddColumn<int>(
                name: "PhaseID",
                table: "Rejected_negotiations_phases",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Rejected_negotiations_phases",
                table: "Rejected_negotiations_phases",
                column: "PhaseID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Rejected_negotiations_phases",
                table: "Rejected_negotiations_phases");

            migrationBuilder.DropColumn(
                name: "PhaseID",
                table: "Rejected_negotiations_phases");

           
        }
    }
}
