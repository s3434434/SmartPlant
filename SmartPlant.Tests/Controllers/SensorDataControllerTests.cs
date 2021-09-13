using NUnit.Framework;
using Moq;
using AutoMapper;
using EmailService;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Security.Principal;

using SmartPlant.Models.Repository;
using SmartPlant.Models;
using SmartPlant.Controllers;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.JwtFeatures;

namespace SmartPlant.Tests.Controllers
{
    public class SensorDataControllerTests
    {
        private Mock<ISensorDataManager> mock_SensorDataManager;
        private Mock<IMapper> mock_Mapper;
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<ClaimsPrincipal> mock_Principal;

        [SetUp]
        public void Setup()
        {
            // Mocking PlantManager, Mapper and UserManager for the SensorDataController
            mock_SensorDataManager = new Mock<ISensorDataManager>();
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

        #region GetAll
        [Test]
        public async Task GetAll_WhenUserDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAll();

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task GetAll_WhenUserHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetAll(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAll();

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAll_WhenUserHasPlants_ReturnsOkResult()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new List<SensorData>();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetAll(It.IsAny<string>()))
                .ReturnsAsync(mock_SensorData);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAll();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region GetAllForPlant
        [Test]
        public async Task GetAllForPlant_WhenUserDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAllForPlant(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task GetAllForPlant_WhenUserHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetAllForAPlant(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAllForPlant(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetAllForPlant_WhenUserHasPlants_ReturnsOkResult()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new List<SensorData>();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetAllForAPlant(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(mock_SensorData);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetAllForPlant(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion
    }
}
