using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using SmartPlant.Models;
using System;
using System.Linq;

namespace SmartPlant.Data
{
    public class SeedData
    {
        /*
         * This is the seed data for setting up the database if it's new and has no data.
         *
         * This creates and adds 2 users -  [user user] and [admin admin]   --   [username password]
         *
         * This adds creates 2 roles - User and Admin
         *
         * It also populates 'user' with some plants and sensor data.
         *
         *
         */
        public static void Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<DatabaseContext>();

            // Look for plants.
            if (context.Plants.Any())
                return; // DB has already been seeded.

            //create the users here
           
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
                user, admin
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
                    UserId = "admin",
                    RoleId = "admin role id"
                }
                );

            //use this to add plants to default User user for testing purposes.
            context.Plants.AddRange(
                new Plant
                {

                    UserID = "user",
                    PlantID = "plantIdOne",
                    Name = "plant one",
                    PlantType = "Default"
                },
                new Plant
                {
                    UserID = "user",
                    PlantID = "plantIdTwo",
                    Name = "plant two",
                    PlantType = "Default"
                },
                new Plant
                {
                    UserID = "user",
                    PlantID = "plantIdThree",
                    Name = "plant three",
                    PlantType = "Default"
                });
            context.PlantTokens.AddRange(

                new PlantToken
                {
                    PlantID = "plantIdOne",
                    Token = "token1"
                },
                new PlantToken
                {
                    PlantID = "plantIdTwo",
                    Token = "token2"
                },
                new PlantToken
                {
                    PlantID = "plantIdThree",
                    Token = "token3"
                }
            );

            const string format = "dd/MM/yyyy hh:mm:ss tt";

            //sensor data plants for testing
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