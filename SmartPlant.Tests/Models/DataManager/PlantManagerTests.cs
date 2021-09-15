using NUnit.Framework;
using Moq;
using AutoMapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;

using SmartPlant.Models.Repository;
using SmartPlant.Models.DataManager;
using SmartPlant.Controllers;
using SmartPlant.Data;
using SmartPlant.Models;

namespace SmartPlant.Tests.Models.DataManager
{
    public class PlantManagerTests
    {
        private DatabaseContext mock_DatabaseContext;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: "Plants Test")
                .Options;

            mock_DatabaseContext = new DatabaseContext(options);
            mock_DatabaseContext.Plants.Add(new Plant { PlantID = "correct", UserID = "correct" });
            mock_DatabaseContext.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            mock_DatabaseContext.Database.EnsureDeleted();
        }

        [Test]
        public async Task GetAllForUser_WhenUserIDDoesNotExist_ReturnsNull()
        {
            // Arrange
            string test_UserID = "incorrect";

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.GetAllForUser(test_UserID);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task GetAllForUser_WhenUserIDDoesExist_ReturnsEnumarablePlants()
        {
            // Arrange
            string test_UserID = "correct";

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            IEnumerable<Plant> result = await plantManager.GetAllForUser(test_UserID);

            // Assert
            foreach (Plant plant in result)
            {
                Assert.AreEqual(plant.PlantID, "correct");
            }
        }
    }
}
