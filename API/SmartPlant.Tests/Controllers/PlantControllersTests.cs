using NUnit.Framework;
using Moq;
using AutoMapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;

using SmartPlant.Models.Repository;
using SmartPlant.Models;
using SmartPlant.Controllers;
using SmartPlant.Models.API_Model.Plant;
using SmartPlant.Models.API_Model;

namespace SmartPlant.Tests.Controllers
{
    public class PlantControllersTests
    {
        private Mock<IPlantManager> mock_PlantManager;
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<ClaimsPrincipal> mock_Principal;

        [SetUp]
        public void Setup()
        {
            // Mocking PlantManager, Mapper and UserManager for the PlantController
            mock_PlantManager = new Mock<IPlantManager>();
            mock_UserManager = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(),
                null, null, null, null, null, null, null, null
                );

            // Mocking a ClaimsPrincipal which is passed via HTTPContext to the Controller
            // First an Identity
            var identity = new Mock<IIdentity>();
            identity.SetupGet(i => i.IsAuthenticated).Returns(true);
            identity.SetupGet(i => i.Name).Returns("FakeUserName");

            // Which is used by the ClaimsPrincipal
            mock_Principal = new Mock<ClaimsPrincipal>();
            mock_Principal.Setup(x => x.Identity).Returns(identity.Object);
        }

        #region User

        #region Get

        [Test]
        public async Task Get_WhenUserHasPlants_ReturnsOKAsync()
        {
            // Arrange
            var testValue = new List<Plant>();

            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(It.IsAny<string>()))
                .ReturnsAsync(testValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Get();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        [Test]
        public async Task Get_WhenUserHasPlants_ReturnsNotFound()
        {
            // Arrange
            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Get();

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }

        #endregion

        #region Post
        [Test]
        public async Task Post_WhenUserNotFound_ReturnsBadRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var test_AddPlantDto = new AddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Post(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Post_WhenPlantIDAlreadyExists_ReturnsConflict()
        {
            // Arrange
            int returnValue = 0;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Post(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        }

        [Test]
        public async Task Post_WhenUserHasReachedPlantLimit_ReturnsConflict()
        {
            // Arrange
            int returnValue = -1;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Post(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        }

        [Test]
        public async Task Post_WhenPlantSuccessfullyAdded_ReturnsCreated()
        {
            // Arrange
            int returnValue = 1;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Post(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<CreatedResult>());
        }
        #endregion

        #region Update
        [Test]
        public async Task Update_WhenPlantNotFound_ReturnsNotFound()
        {
            // Arrange
            int returnValue = -1;

            mock_PlantManager.Setup(_repo => _repo.Update(It.IsAny<Plant>()))
                .ReturnsAsync(returnValue);

            var test_UpdatePlantDto = new UpdatePlantDto() { Name="Name", PlantID="1" };

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Update(test_UpdatePlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }

        [Test]
        public async Task Update_WhenPlantSuccessfullyUpdate_ReturnsOk()
        {
            // Arrange
            int returnValue = 1;

            mock_PlantManager.Setup(_repo => _repo.Update(It.IsAny<Plant>()))
                .ReturnsAsync(returnValue);

            var test_UpdatePlantDto = new UpdatePlantDto() { Name = "Name", PlantID = "1" };

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Update(test_UpdatePlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<OkResult>());
        }
        #endregion

        #region Delete
        [Test]
        public async Task Delete_WhenPlantNotFound_ReturnsNotFound()
        {
            // Arrange
            int returnValue = 0;

            mock_PlantManager.Setup(_repo => _repo.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(returnValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Delete(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task Delete_WhenPlantNotUsers_ReturnsForbid()
        {
            // Arrange
            int returnValue = -1;

            mock_PlantManager.Setup(_repo => _repo.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(returnValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Delete(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<ForbidResult>());
        }

        [Test]
        public async Task Delete_WhenPlantSuccessfullyDeleted_ReturnsOk()
        {
            // Arrange
            int returnValue = 1;

            mock_PlantManager.Setup(_repo => _repo.Delete(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(returnValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Delete(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #endregion

        #region Admin

        #region AdminGetAll
        [Test]
        public async Task AdminGetAll_WhenRepoHasPlants_ReturnsOKAsync()
        {
            // Arrange
            var testValue = new List<Plant>();

            mock_PlantManager.Setup(_repo => _repo.AdminGetAll())
                .ReturnsAsync(testValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminGetAll();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        [Test]
        public async Task AdminGetAll_RepoHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            mock_PlantManager.Setup(_repo => _repo.AdminGetAll())
                .ReturnsAsync(() => null);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminGetAll();

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }
        #endregion

        #region AdminGet
        [Test]
        public async Task AdminGet_WhenParameterIDUserHasPlants_ReturnsOKAsync()
        {
            // Arrange
            var testValue = new List<Plant>();

            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(It.IsAny<string>()))
                .ReturnsAsync(testValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminGet(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        [Test]
        public async Task AdminGet_WhenParameterIDUserHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminGet(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }
        #endregion

        #region AdminPost
        [Test]
        public async Task AdminPost_WhenUserNotFound_ReturnsBadRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var test_AddPlantDto = new AdminAddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminPost(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task AdminPost_WhenPlantIDAlreadyExists_ReturnsConflict()
        {
            // Arrange
            int returnValue = 0;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AdminAddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminPost(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        }

        [Test]
        public async Task AdminPost_WhenUserHasReachedPlantLimit_ReturnsConflict()
        {
            // Arrange
            int returnValue = -1;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AdminAddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminPost(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        }

        [Test]
        public async Task AdminPost_WhenPlantSuccessfullyAdded_ReturnsCreated()
        {
            // Arrange
            int returnValue = 1;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => new ApplicationUser());

            mock_PlantManager.Setup(_repo => _repo.Add(It.IsAny<Plant>(), It.IsAny<PlantToken>()))
                .ReturnsAsync(returnValue);

            var test_AddPlantDto = new AdminAddPlantDto();

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminPost(test_AddPlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<CreatedResult>());
        }
        #endregion

        #region AdminUpdate
        [Test]
        public async Task AdminUpdate_WhenPlantNotFound_ReturnsNotFound()
        {
            // Arrange
            int returnValue = -1;

            mock_PlantManager.Setup(_repo => _repo.AdminUpdate(It.IsAny<Plant>()))
                .ReturnsAsync(returnValue);

            var test_UpdatePlantDto = new UpdatePlantDto() { Name = "Name", PlantID = "1" };

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminUpdate(test_UpdatePlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }

        [Test]
        public async Task AdminUpdate_WhenPlantSuccessfullyUpdate_ReturnsOk()
        {
            // Arrange
            int returnValue = 1;

            mock_PlantManager.Setup(_repo => _repo.AdminUpdate(It.IsAny<Plant>()))
                .ReturnsAsync(returnValue);

            var test_UpdatePlantDto = new UpdatePlantDto() { Name = "Name", PlantID = "1" };

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminUpdate(test_UpdatePlantDto);

            // Assert
            Assert.That(result, Is.TypeOf<OkResult>());
        }
        #endregion

        #region AdminDelete
        [Test]
        public async Task AdminDelete_WhenPlantNotFound_ReturnsNotFound()
        {
            // Arrange
            var returnValue = false;

            mock_PlantManager.Setup(_repo => _repo.AdminDelete(It.IsAny<string>()))
                .ReturnsAsync(returnValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminDelete(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task AdminDelete_WhenPlantSuccessfullyDeleted_ReturnsOk()
        {
            // Arrange
            var returnValue = true;

            mock_PlantManager.Setup(_repo => _repo.AdminDelete(It.IsAny<string>()))
                .ReturnsAsync(returnValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.AdminDelete(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion
        #endregion
    }
}