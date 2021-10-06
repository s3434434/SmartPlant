using NUnit.Framework;

using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using SmartPlant.Models.DataManager;
using SmartPlant.Data;
using SmartPlant.Models;
using System;

namespace SmartPlant.Tests.Models.DataManager
{
    public class PlantManagerTests
    {
        private DatabaseContext mock_DatabaseContext;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .EnableSensitiveDataLogging()
                .Options;

            mock_DatabaseContext = new DatabaseContext(options);
            Plant plant = new() { PlantID = "existing", UserID = "existing" };
            PlantToken plantToken = new() { PlantID = plant.PlantID, Token = "token" };
            mock_DatabaseContext.Plants.Add(plant);
            mock_DatabaseContext.PlantTokens.Add(plantToken);

            //mock_DatabaseContext.Entry<Plant>(plant).State = EntityState.Detached;
            //mock_DatabaseContext.Entry<PlantToken>(plantToken).State = EntityState.Detached;

            mock_DatabaseContext.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            mock_DatabaseContext.Database.EnsureDeleted();
        }

        #region GetAllForUser
        [Test]
        public async Task GetAllForUser_WhenUserIDDoesNotExist_ReturnsNull()
        {
            // Arrange
            string test_UserID = "doesNotExist";

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
            string test_UserID = "existing";

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            IEnumerable<Plant> result = await plantManager.GetAllForUser(test_UserID);

            // Assert
            Assert.IsNotNull(result);
            foreach (Plant plant in result)
            {
                Assert.AreEqual(plant.PlantID, "existing");
            }
        }
        #endregion

        #region Add
        [Test]
        public async Task Add_WhenPlantIDAlreadyExists_Returns0()
        {
            // Arrange
            Plant test_Plant = new ()
            {
                PlantID = "existing",
                UserID = "existing"
            };

            PlantToken test_PlantToken = new ()
            {
                PlantID = "existing",
                Token = "token",
                Plant = test_Plant
            };

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = 0;

            // Act
            var result = await plantManager.Add(test_Plant, test_PlantToken);

            // Assert
            Assert.AreEqual(expected, result);
        }

        [Test]
        public async Task Add_WhenMaxPlantCountIsExceeded_ReturnsNegative1()
        {
            // Arrange
            var existing_PlantTokens = new List<PlantToken>();
            var existing_UserID = "existing";

            for (int i = 0; i < 5; i++)
            {
                Plant plant = new() { PlantID = i.ToString(), UserID = existing_UserID };
                existing_PlantTokens.Add(new() { PlantID = i.ToString(), Token = i.ToString(), Plant = plant });
            }

            Plant test_Plant = new ()
            {
                PlantID = "tooManyPlants",
                UserID = existing_UserID
            };

            PlantToken test_PlantToken = new ()
            {
                PlantID = "existing",
                Token = "token",
                Plant = test_Plant
            };

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = -1;

            // Add existing plants
            foreach (PlantToken plantToken in existing_PlantTokens)
            {
                await plantManager.Add(plantToken.Plant, plantToken);
            }

            // Act
            var result = await plantManager.Add(test_Plant, test_PlantToken);

            // Assert
            Assert.AreEqual(expected, result);
        }

        [Test]
        public async Task Add_WhenPlantSuccessfullyAdded_Returns1()
        {
            // Arrange
            Plant test_Plant = new ()
            {
                PlantID = "newID",
                UserID = "newID"
            };

            PlantToken test_PlantToken = new ()
            {
                PlantID = "newID",
                Token = "token"
            };

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = 1;

            // Act
            var result = await plantManager.Add(test_Plant, test_PlantToken);

            // Assert
            Assert.AreEqual(expected, result);
        }
        #endregion

        #region Delete
        [Test]
        public async Task Delete_WhenPlantIDDoesNotExist_Returns0()
        {
            // Arrange
            var plantID = "doesNotExist";
            var userID = "doesNotMatter";

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = 0;

            // Act
            var result = await plantManager.Delete(plantID, userID);

            // Assert
            Assert.AreEqual(expected, result);
        }

        [Test]
        public async Task Delete_WhenPlantIDDoesNotBelongToUserID_ReturnsNegative1()
        {
            // Arrange
            var plantID = "existing";
            var userID = "NotThisPersonsPlant";

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = -1;

            // Act
            var result = await plantManager.Delete(plantID, userID);

            // Assert
            Assert.AreEqual(expected, result);
        }

        [Test]
        public async Task Delete_WhenPlantSuccessfullyDeleted_Returns1()
        {
            // Arrange
            var plantID = "existing";
            var userID = "existing";

            var plantManager = new PlantManager(mock_DatabaseContext);

            var expected = 1;

            // Act
            var result = await plantManager.Delete(plantID, userID);

            // Assert
            Assert.AreEqual(expected, result);
        }
        #endregion

        #region AdminGetAll
        [Test]
        public async Task AdminGetAll_WhenCalled_ReturnsIEnumarablePlants()
        {
            // Arrange
            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminGetAll();

            // Assert
            Assert.IsNotNull(result);        
        }
        #endregion

        #region AdminUpdate
        [Test]
        public async Task AdminUpdate_WhenPlantIDDoesNotExist_ReturnsNegOne()
        {
            // Arrange
            var test_Plant = new Plant() { PlantID= "doesNotExist" };

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminUpdate(test_Plant);

            // Assert
            Assert.AreEqual(-1, result);
        }

        [Test]
        public async Task AdminUpdate_WhenPlantIDIsUpdatededSuccessfully_ReturnsOne()
        {
            // Arrange
            var test_Plant = new Plant() { PlantID = "existing" };

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminUpdate(test_Plant);

            // Assert
            Assert.AreEqual(1, result);
        }
        #endregion

        #region AdminDelete
        [Test]
        public async Task AdminDelete_WhenPlantIDDoesNotExist_ReturnsFalse()
        {
            // Arrange
            var plantID = "doesNotExist";

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminDelete(plantID);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public async Task AdminDelete_WhenPlantIDIsDeletedSuccessfully_ReturnsTrue()
        {
            // Arrange
            var plantID = "existing";

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminDelete(plantID);

            // Assert
            Assert.IsTrue(result);
        }
        #endregion

        #region GeneratePlantToken

        #endregion

        #region AdminGenerateNewPlantToken
        [Test]
        public async Task AdminGenerateNewPlantToken_WhenPlantIDDoesNotExist_ReturnsFalse()
        {
            // Arrange
            var userID = "doesNotExistUser";
            PlantToken test_PlantToken = new()
            {
                PlantID = "doesNotExist",
                Token = "token"
            };

            var plantManager = new PlantManager(mock_DatabaseContext);

            // Act
            var result = await plantManager.AdminGenerateNewPlantToken(userID, test_PlantToken);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public async Task AdminGenerateNewPlantToken_WhenPlantTokenSuccessfullyCreated_ReturnsTrue()
        {
            // Arrange
            var userID = "existing";
            PlantToken test_PlantToken = new()
            {
                PlantID = "existing",
                Token = "newtoken"
            };

            var plantManager = new PlantManager(mock_DatabaseContext);
            mock_DatabaseContext.ChangeTracker.Clear();

            // Act
            var result = await plantManager.AdminGenerateNewPlantToken(userID, test_PlantToken);

            // Assert
            Assert.IsTrue(result);
        }
        #endregion
    }
}
