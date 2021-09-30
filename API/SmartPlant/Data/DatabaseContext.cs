using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartPlant.Models;
using SmartPlant.Models.Repository;

namespace SmartPlant.Data
{
    public class DatabaseContext : IdentityDbContext<ApplicationUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        { }

        //database table stuff
        public DbSet<Plant> Plants { get; set; }
        public DbSet<SensorData> SensorData { get; set; }
        public DbSet<PlantToken> PlantTokens { get; set; }


        //fluent api
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //set CHECK constraint -> humidity cannot be negative. Needed? light level, moisture %
            builder.Entity<SensorData>()
                .HasCheckConstraint("CH_SensorData_Humidity", "(Humidity >= 0 and Humidity <= 100.00)")
                .HasCheckConstraint("CH_SensorData_Moisture_%", "([Moisture %] >= 0 and [Moisture %] <= 100.00)")
                .HasCheckConstraint("CH_SensorData_LightIntensity", "(LightIntensity >= 0 and LightIntensity <= 100.00)")
                .HasCheckConstraint("CH_SensorData_Temperature", "(Temperature >= -30 and Temperature <= 50.00)");

            // decimal stuff
            builder.Entity<SensorData>()
                .Property(s => s.Temp)
                .HasPrecision(5, 2);

            builder.Entity<SensorData>()
            .Property(s => s.Humidity)
            .HasPrecision(5, 2);

            builder.Entity<SensorData>()
            .Property(s => s.Moisture)
            .HasPrecision(5, 2);

            builder.Entity<SensorData>()
            .Property(s => s.LightIntensity)
            .HasPrecision(5, 2);


            //configuring the ambiguous relationship between plants and users
            //user has many plants, plants have one user.
            builder.Entity<ApplicationUser>()
                .HasMany(x => x.Plants)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserID);

        }
    }
}
