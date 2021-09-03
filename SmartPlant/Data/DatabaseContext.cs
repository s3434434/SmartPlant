using Microsoft.EntityFrameworkCore;
using SmartPlant.Models;

namespace SmartPlant.Data
{
    public class DatabaseContext : DbContext
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
        }

        }
}
