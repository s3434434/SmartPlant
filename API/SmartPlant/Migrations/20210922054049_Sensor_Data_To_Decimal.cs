using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartPlant.Migrations
{
    public partial class Sensor_Data_To_Decimal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<decimal>(
                name: "Temperature",
                table: "SensorData",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Moisture %",
                table: "SensorData",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "LightIntensity",
                table: "SensorData",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<decimal>(
                name: "Humidity",
                table: "SensorData",
                type: "decimal(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Humidity",
                table: "SensorData",
                sql: "(Humidity >= 0 and Humidity <= 100.00)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Moisture_%",
                table: "SensorData",
                sql: "([Moisture %] >= 0 and [Moisture %] <= 100.00)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_LightIntensity",
                table: "SensorData",
                sql: "(LightIntensity >= 0 and LightIntensity <= 100.00)");

            migrationBuilder.AddCheckConstraint(
                name: "CH_SensorData_Temperature",
                table: "SensorData",
                sql: "(Temperature >= -30 and Temperature <= 50.00)");
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

            migrationBuilder.AlterColumn<int>(
                name: "Temperature",
                table: "SensorData",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<int>(
                name: "Moisture %",
                table: "SensorData",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<int>(
                name: "LightIntensity",
                table: "SensorData",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<int>(
                name: "Humidity",
                table: "SensorData",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)",
                oldPrecision: 5,
                oldScale: 2);

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
    }
}
