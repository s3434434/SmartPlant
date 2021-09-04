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

            // Look for plants.
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
                    OwnerID = "owner1",
                    PlantID = "plantIdTwo"
                },
                new Plant
                {
                    OwnerID = "owner1",
                    PlantID = "plantIdThree"
                },
                new Plant
                {
                    OwnerID = "156785",
                    PlantID = "p209"
                },
                new Plant
                {
                    OwnerID = "156785",
                    PlantID = "p315"
                },
                new Plant
                {
                    OwnerID = "79824",
                    PlantID = "p9813"
                });

            const string format = "dd/MM/yyyy hh:mm:ss tt";

            //sensor data
            context.SensorData.AddRange(
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 22,
                    Humidity = 22,
                    LightIntensity = 22,
                    Moisture = 22,
                    TimeStampUTC = DateTime.UtcNow
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 11,
                    Humidity = 11,
                    LightIntensity = 11,
                    Moisture = 11,
                    TimeStampUTC = DateTime.ParseExact("01/01/2021 01:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdTwo",
                    Temp = -5,
                    Humidity = 2,
                    LightIntensity = 0,
                    Moisture = 3,
                    TimeStampUTC = DateTime.ParseExact("22/02/2021 02:00:00 AM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdTwo",
                    Temp = 3,
                    Humidity = 5,
                    LightIntensity = 1,
                    Moisture = 6,
                    TimeStampUTC = DateTime.ParseExact("22/02/2021 03:00:00 AM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdTwo",
                    Temp = 4,
                    Humidity = 4,
                    LightIntensity = 2,
                    Moisture = 6,
                    TimeStampUTC = DateTime.ParseExact("22/02/2021 03:00:00 AM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdTwo",
                    Temp = 7,
                    Humidity = 5,
                    LightIntensity = 5,
                    Moisture = 7,
                    TimeStampUTC = DateTime.ParseExact("22/02/2021 04:00:00 AM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdThree",
                    Temp = 22,
                    Humidity = 8,
                    LightIntensity = 30,
                    Moisture = 12,
                    TimeStampUTC = DateTime.ParseExact("30/03/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdThree",
                    Temp = 20,
                    Humidity = 9,
                    LightIntensity = 28,
                    Moisture = 11,
                    TimeStampUTC = DateTime.ParseExact("30/03/2021 06:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdThree",
                    Temp = 17,
                    Humidity = 11,
                    LightIntensity = 23,
                    Moisture = 14,
                    TimeStampUTC = DateTime.ParseExact("30/03/2021 07:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdThree",
                    Temp = 14,
                    Humidity = 14,
                    LightIntensity = 7,
                    Moisture = 18,
                    TimeStampUTC = DateTime.ParseExact("30/03/2021 08:00:00 PM", format, null)
                }


                );

            context.SaveChanges();
        }
    }

}