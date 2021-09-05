using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartPlant.Models;

namespace SmartPlant.Data
{
    public class DatabaseContext : IdentityDbContext<ApplicationUser>
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        { }

        //database table stuff
        public DbSet<Plant> Plants { get; set; }
        public DbSet<SensorData> SensorData { get; set; }


        //fluent api
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //set CHECK constraint -> humidity cannot be negative. Needed? light level, moisture %
            //builder.Entity<SensorData>().HasCheckConstraint("CH_SensorData_Humidity", "(Humidity >= 0)");

            builder.Entity<SensorData>()
                .Property(s => s.Test)
                .HasPrecision(5, 2);

            builder.Entity<ApplicationUser>()
                .HasMany(x => x.Plants)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserID);
        }

        }
}
