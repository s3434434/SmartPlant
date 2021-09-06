using Microsoft.AspNetCore.Identity;
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

            //create the users here
            var guid = Guid.NewGuid().ToString();
            var pwHasher = new PasswordHasher<ApplicationUser>();
            var user = new ApplicationUser
            {
                Id = "user",
                FirstName = "Default User",
                LastName = "Default",
                UserName = "user",
                Email = "user",
                NormalizedEmail = "USER",
                EmailConfirmed = true,
                LockoutEnabled = false

            };
            user.PasswordHash = pwHasher.HashPassword(user, "user");

            var testUser = new ApplicationUser
            {
                Id = guid,
                FirstName = "Default Two",
                LastName = "Default",
                UserName = "email@email.com",
                Email = "email@email.com",
                NormalizedEmail = "EMAIL@EMAIL.COM",
                EmailConfirmed = true,
                LockoutEnabled = false
            };
            testUser.PasswordHash = pwHasher.HashPassword(testUser, "user");

            var admin = new ApplicationUser
            {
                Id = "admin",
                FirstName = "Admin",
                LastName = "Admin",
                UserName = "Admin",
                Email = "Admin",
                NormalizedEmail = "ADMIN",
                EmailConfirmed = true,
                LockoutEnabled = false
            };
            admin.PasswordHash = pwHasher.HashPassword(admin, "admin");

            //add the users here
            context.Users.AddRange(
                user, testUser, admin
                );

            //add in the roles
            context.Roles.AddRange(
                new IdentityRole
                {
                    Id = "user role id",
                    Name = UserRoles.User,
                    ConcurrencyStamp = "1",
                    NormalizedName = "USER"
                },

                new IdentityRole
                {
                    Id = "admin role id",
                    Name = UserRoles.Admin,
                    ConcurrencyStamp = "2",
                    NormalizedName = "ADMIN"
                }
                 );
            //add those roles to the users
            context.UserRoles.AddRange(
                new IdentityUserRole<string>
                {
                    UserId = "user",
                    RoleId = "user role id"
                },
                new IdentityUserRole<string>
                {
                    UserId = guid,
                    RoleId = "user role id"
                },
                new IdentityUserRole<string>
                {
                    UserId = "admin",
                    RoleId = "admin role id"
                }
                );

            context.Plants.AddRange(
                new Plant
                {

                    UserID = "user",
                    PlantID = "plantIdOne"
                },
                new Plant
                {
                    UserID = "user",
                    PlantID = "plantIdTwo"
                },
                new Plant
                {
                    UserID = "user",
                    PlantID = "plantIdThree"
                },
                new Plant
                {
                    UserID = guid,
                    PlantID = "p209"
                },
                new Plant
                {
                    UserID = guid,
                    PlantID = "p315"
                },
                new Plant
                {
                    UserID = guid,
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
                    PlantID = "plantIdOne",
                    Temp = 15,
                    Humidity = 30,
                    LightIntensity = 22,
                    Moisture = 35,
                    TimeStampUTC = DateTime.ParseExact("28/08/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 18,
                    Humidity = 16,
                    LightIntensity = 7,
                    Moisture = 18,
                    TimeStampUTC = DateTime.ParseExact("29/08/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 19,
                    Humidity = 20,
                    LightIntensity = 10,
                    Moisture = 15,
                    TimeStampUTC = DateTime.ParseExact("01/09/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 15,
                    Humidity = 30,
                    LightIntensity = 22,
                    Moisture = 35,
                    TimeStampUTC = DateTime.ParseExact("02/09/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 33,
                    Humidity = 12,
                    LightIntensity = 36,
                    Moisture = 9,
                    TimeStampUTC = DateTime.ParseExact("04/09/2021 05:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 9,
                    Humidity = 25,
                    LightIntensity = 18,
                    Moisture = 22,
                    TimeStampUTC = DateTime.ParseExact("04/09/2021 06:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 8,
                    Humidity = 25,
                    LightIntensity = 11,
                    Moisture = 18,
                    TimeStampUTC = DateTime.ParseExact("04/09/2021 07:00:00 PM", format, null)
                },
                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 9,
                    Humidity = 25,
                    LightIntensity = 8,
                    Moisture = 22,
                    TimeStampUTC = DateTime.ParseExact("05/09/2021 06:00:00 AM", format, null)
                },

                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 11,
                    Humidity = 22,
                    LightIntensity = 10,
                    Moisture = 18,
                    TimeStampUTC = DateTime.ParseExact("05/09/2021 07:00:00 AM", format, null)
                },

                new SensorData
                {
                    PlantID = "plantIdOne",
                    Temp = 14,
                    Humidity = 17,
                    LightIntensity = 26,
                    Moisture = 16,
                    TimeStampUTC = DateTime.ParseExact("05/09/2021 08:00:00 AM", format, null)
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