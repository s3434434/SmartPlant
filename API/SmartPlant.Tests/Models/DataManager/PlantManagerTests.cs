using NUnit.Framework;

using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using SmartPlant.Models.DataManager;
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
            mock_DatabaseContext.Plants.Add(new Plant { PlantID = "existing", UserID = "existing" });
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
            var existing_Plants = new List<Plant>();
            var existing_UserID = "existing";

            for (int i = 0; i < 4; i++)
                existing_Plants.Add(new Plant() { PlantID = i.ToString(), UserID = existing_UserID });

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
            foreach (Plant plant in existing_Plants)
            {
                await plantManager.Add(plant, test_PlantToken);
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
                PlantID = "existing",
                Token = "token",
                Plant = test_Plant
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
        public async Task AdminUpdate_WhenPlantIDIsDeletedSuccessfully_ReturnsOne()
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
    }
}
