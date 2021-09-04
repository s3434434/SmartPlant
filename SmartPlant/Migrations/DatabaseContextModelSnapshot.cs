﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SmartPlant.Data;

namespace SmartPlant.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.9")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SmartPlant.Models.Plant", b =>
                {
                    b.Property<string>("PlantID")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("userID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("PlantID");

                    b.ToTable("Plants");
                });

            modelBuilder.Entity("SmartPlant.Models.SensorData", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Humidity")
                        .HasColumnType("int");

                    b.Property<int>("LightIntensity")
                        .HasColumnType("int");

                    b.Property<int>("Moisture")
                        .HasColumnType("int")
                        .HasColumnName("Moisture %");

                    b.Property<string>("PlantID")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("Temp")
                        .HasColumnType("int")
                        .HasColumnName("Temperature");

                    b.Property<decimal>("Test")
                        .HasPrecision(5, 2)
                        .HasColumnType("decimal(5,2)");

                    b.Property<DateTime>("TimeStampUTC")
                        .HasColumnType("datetime2");

                    b.HasKey("id");

                    b.HasIndex("PlantID");

                    b.ToTable("SensorData");
                });

            modelBuilder.Entity("SmartPlant.Models.SensorData", b =>
                {
                    b.HasOne("SmartPlant.Models.Plant", "Plant")
                        .WithMany()
                        .HasForeignKey("PlantID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Plant");
                });
#pragma warning restore 612, 618
        }
    }
}
