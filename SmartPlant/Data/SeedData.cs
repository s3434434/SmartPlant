using Microsoft.Extensions.DependencyInjection;
using SmartPlant.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Data
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<DatabaseContext>();

            // Look for customers.
            if (context.Plants.Any())
                return; // DB has already been seeded.

            context.Plants.AddRange(
                new Plant
                {
                    OwnerID = "owner1",
                    PlantID = "plantIdOne"
                },
                new Plant
                {
                    OwnerID = "156785",
                    PlantID = "p209"
                },
                new Plant
                {
                    OwnerID = "79824",
                    PlantID = "p9813"
                });



            context.SaveChanges();
        }
    }

}