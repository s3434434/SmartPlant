using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class UserTableCheckConstraints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CH_User_PhoneNumber",
                table: "AspNetUsers",
                sql: "len(PhoneNumber) = 10");

            migrationBuilder.AddCheckConstraint(
                name: "CH_User_FirstName",
                table: "AspNetUsers",
                sql: "len(FirstName) <= 50");

            migrationBuilder.AddCheckConstraint(
                name: "CH_User_LastName",
                table: "AspNetUsers",
                sql: "len(LastName) <= 50");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CH_User_PhoneNumber",
                table: "AspNetUsers");

            migrationBuilder.DropCheckConstraint(
                name: "CH_User_FirstName",
                table: "AspNetUsers");

            migrationBuilder.DropCheckConstraint(
                name: "CH_User_LastName",
                table: "AspNetUsers");
        }
    }
}
