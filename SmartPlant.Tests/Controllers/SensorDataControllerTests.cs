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

        #region GetDaily
        [Test]
        public async Task GetDaily_WhenUserDoesNotExist_ReturnsBadRequest()
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
            var result = await sensorDataController.GetDaily(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task GetDaily_WhenUserHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetDaily(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetDaily(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetDaily_WhenUserHasPlants_ReturnsOkResult()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new List<SensorData>();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetDaily(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(mock_SensorData);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetDaily(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region GetMonthly
        [Test]
        public async Task GetMonthly_WhenUserDoesNotExist_ReturnsBadRequest()
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
            var result = await sensorDataController.GetMonthly(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task GetMonthly_WhenUserHasNoPlants_ReturnsNotFound()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetMonthly(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetMonthly(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetMonthly_WhenUserHasPlants_ReturnsOkResult()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new List<SensorData>();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_SensorDataManager.Setup(_repo => _repo.GetMonthly(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(mock_SensorData);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await sensorDataController.GetMonthly(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region Post
        [Test]
        public async Task Post_WhenModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange
            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ModelState.AddModelError("Adding error", "Model state now invalid");
            // Act
            var result = await sensorDataController.Post(It.IsAny<SensorDataModel>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task Post_WhenUserDoesNotExist_ReturnsBadRequest()
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
            var result = await sensorDataController.Post(It.IsAny<SensorDataModel>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Post_WhenPlantIDDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new SensorData();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_Mapper.Setup(_mapper => _mapper.Map<SensorData>(It.IsAny<SensorDataModel>()))
                .Returns(mock_SensorData);

            mock_SensorDataManager.Setup(_repo => _repo.Add(It.IsAny<string>(), It.IsAny<SensorData>()))
                .ReturnsAsync(() => null);
                
            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            ObjectResult result = (ObjectResult) await sensorDataController.Post(It.IsAny<SensorDataModel>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Plant ID does not exist", result.Value);
        }

        [Test]
        public async Task Post_WhenSensorDataManagerIsNotReadyForUpdate_ReturnsStatusCodeRequest()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new SensorData();
            var mock_AddResult = "";

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_Mapper.Setup(_mapper => _mapper.Map<SensorData>(It.IsAny<SensorDataModel>()))
                .Returns(mock_SensorData);

            mock_SensorDataManager.Setup(_repo => _repo.Add(It.IsAny<string>(), It.IsAny<SensorData>()))
                .ReturnsAsync(mock_AddResult);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            ObjectResult result = (ObjectResult) await sensorDataController.Post(It.IsAny<SensorDataModel>());

            // Assert
            Assert.That(result, Is.TypeOf<ObjectResult>());
            Assert.AreEqual(429, result.StatusCode);
            Assert.AreEqual("Please wait 5 minutes between updates", result.Value);
        }

        [Test]
        public async Task Post_WhenUpdateIsSuccessful_ReturnsCreatedResult()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();
            var mock_SensorData = new SensorData();
            var mock_AddResult = "success";

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_Mapper.Setup(_mapper => _mapper.Map<SensorData>(It.IsAny<SensorDataModel>()))
                .Returns(mock_SensorData);

            mock_SensorDataManager.Setup(_repo => _repo.Add(It.IsAny<string>(), It.IsAny<SensorData>()))
                .ReturnsAsync(mock_AddResult);

            var sensorDataController = new SensorDataController(mock_SensorDataManager.Object, mock_Mapper.Object, mock_UserManager.Object);
            sensorDataController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            ObjectResult result = (ObjectResult)await sensorDataController.Post(It.IsAny<SensorDataModel>());

            // Assert
            Assert.That(result, Is.TypeOf<CreatedResult>());
            Assert.AreEqual(201, result.StatusCode);
        }
        #endregion
    }
}
