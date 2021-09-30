using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class PlantToken : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlantTokens",
                columns: table => new
                {
                    PlantID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlantTokens", x => x.PlantID);
                    table.ForeignKey(
                        name: "FK_PlantTokens_Plants_PlantID",
                        column: x => x.PlantID,
                        principalTable: "Plants",
                        principalColumn: "PlantID",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlantTokens");
        }
    }
}
