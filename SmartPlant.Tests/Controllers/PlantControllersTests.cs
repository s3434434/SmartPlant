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

namespace SmartPlant.Tests
{
    public class PlantControllersTests
    {
        private Mock<IPlantManager> mock_PlantManager;
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<IMapper> mock_Mapper;
        private Mock<ClaimsPrincipal> mock_Principal;

        [SetUp]
        public void Setup()
        {
            // Mocking PlantManager, Mapper and UserManager for the PlantController
            mock_PlantManager = new Mock<IPlantManager>();
            mock_Mapper = new Mock<IMapper>();
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

        #region Get

        [Test]
        public async Task Get_WhenUserHasPlants_ReturnsOKAsync()
        {
            // Arrange
            var testValue = new List<Plant>();
            var userID = mock_Principal.Object.Identity.Name;

            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(userID))
                .ReturnsAsync(testValue);

            var plantController = new PlantController(mock_PlantManager.Object, mock_Mapper.Object, mock_UserManager.Object);
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
            var userID = mock_Principal.Object.Identity.Name;

            mock_PlantManager.Setup(_repo => _repo.GetAllForUser(userID))
                .ReturnsAsync(() => null);

            var plantController = new PlantController(mock_PlantManager.Object, mock_Mapper.Object, mock_UserManager.Object);
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
            var userID = mock_Principal.Object.Identity.Name;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(userID))
                .ReturnsAsync(() => null);

            var plantController = new PlantController(mock_PlantManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await plantController.Post();

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Post_WhenPlantIDAlreadyExists_ReturnsConflict()
        {
            // Arrange
            var userID = mock_Principal.Object.Identity.Name;
            var mock_plant = new Plant();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(userID))
                .ReturnsAsync(() => new ApplicationUser());

            var plantController = new PlantController(mock_PlantManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            plantController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            mock_PlantManager.Setup(_repo => _repo.Add(mock_plant))
                .ReturnsAsync(() => 0);

            // Act
            var result = await plantController.Post();

            // Assert
            Assert.That(result, Is.TypeOf<ConflictObjectResult>());
        }

        [Test]
        public async Task Post_WhenUserHasReachedPlantLimit_ReturnsConflict()
        {
            // Arrange
            var userID = mock_Principal.Object.Identity.Name;

            // Act

            // Assert
        }

        [Test]
        public async Task Post_WhenPlantSuccessfullyAdded_ReturnsCreated()
        {
            // Arrange
            var userID = mock_Principal.Object.Identity.Name;

            // Act

            // Assert
        }
        #endregion
    }
}