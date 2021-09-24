using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class AddedPlantName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Plants",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Plants");
        }
    }
}
