using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class Added_Database_Check_Constraints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Humidity",
                table: "SensorData",
                sql: "(Humidity >= 0 and Humidity <= 100)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Moisture_%",
                table: "SensorData",
                sql: "([Moisture %] >= 0 and [Moisture %] <= 100)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_LightIntensity",
                table: "SensorData",
                sql: "(LightIntensity >= 0 and LightIntensity <= 100)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Temperature",
                table: "SensorData",
                sql: "(Temperature >= -30 and Temperature <= 50)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CH_SensorData_Humidity",
                table: "SensorData");

            migrationBuilder.DropCheckConstraint(
                name: "CH_SensorData_Moisture_%",
                table: "SensorData");

            migrationBuilder.DropCheckConstraint(
                name: "CH_SensorData_LightIntensity",
                table: "SensorData");

            migrationBuilder.DropCheckConstraint(
                name: "CH_SensorData_Temperature",
                table: "SensorData");

            migrationBuilder.AlterColumn<string>(
                name: "LastName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);
        }
    }
}
