using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class connectForeginKeyUserID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "userID",
                table: "Plants",
                newName: "UserID");

            migrationBuilder.AlterColumn<string>(
                name: "UserID",
                table: "Plants",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_UserID",
                table: "Plants",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Plants_AspNetUsers_UserID",
                table: "Plants",
                column: "UserID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Plants_AspNetUsers_UserID",
                table: "Plants");

            migrationBuilder.DropIndex(
                name: "IX_Plants_UserID",
                table: "Plants");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Plants",
                newName: "userID");

            migrationBuilder.AlterColumn<string>(
                name: "userID",
                table: "Plants",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
