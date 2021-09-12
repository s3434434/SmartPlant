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
    public class AccountControllerTests
    {
        private Mock<IAccountManager> mock_AccountManager;
        private Mock<IMapper> mock_Mapper;
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<JwtHandler> mock_JWTHandler;
        private Mock<IEmailSender> mock_EmailSender;

        [SetUp]
        public void Setup()
        {
            // Mocking PlantManager, Mapper and UserManager for the PlantController
            mock_AccountManager = new Mock<IAccountManager>();
            mock_Mapper = new Mock<IMapper>();
            mock_UserManager = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(),
                null, null, null, null, null, null, null, null
                );

            mock_JWTHandler = new Mock<JwtHandler>(Mock.Of<IConfiguration>(), mock_UserManager.Object);
            mock_EmailSender = new Mock<IEmailSender>();
        }

        #region Register
        [Test]
        public async Task Register_WhenUserRegistrationDtoIsNull_ReturnsBadRequest()
        {
            // Arrange
            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.Register(null);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task Register_WhenModelStateIsInvalid_ReturnsBadRequest()
        {
            // Arrange
            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ModelState.AddModelError("Adding error", "Model state now invalid");

            // Act
            var result = await accountController.Register(Mock.Of<UserRegistrationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task Register_WhenRepoRegistrationFails_ReturnsBadRequest()
        {
            // Arrange
            var mock_registrationResponseDto = new RegistrationResponseDto();
            mock_registrationResponseDto.isSuccessfulRegistration = false;

            mock_AccountManager.Setup(_repo => _repo.Register(It.IsAny<ApplicationUser>(), It.IsAny<UserRegistrationDto>()))
                .ReturnsAsync(mock_registrationResponseDto);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.Register(Mock.Of<UserRegistrationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task Register_WhenRegistrationIsSuccessful_ReturnsOK()
        {
            // Arrange
            var mock_registrationResponseDto = new RegistrationResponseDto();
            mock_registrationResponseDto.isSuccessfulRegistration = true;

            mock_AccountManager.Setup(_repo => _repo.Register(It.IsAny<ApplicationUser>(), It.IsAny<UserRegistrationDto>()))
                .ReturnsAsync(mock_registrationResponseDto);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.Register(Mock.Of<UserRegistrationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region ComfirmEmail
        [Test]
        public async Task ComfirmEmail_WhenUserNotFound_ReturnsBadRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ComfirmEmail(It.IsAny<string>(), It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ComfirmEmail_WhenUserEmailTokenInvalid_ReturnsBadRequest()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_AccountManager.Setup(_repo => _repo.ConfirmEmail(mock_ApplicationUser, It.IsAny<string>()))
                .ReturnsAsync(false);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ComfirmEmail(It.IsAny<string>(), It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ComfirmEmail_WhenUserEmailConfirmedSuccessfully_ReturnsOkRequest()
        {
            // Arrange
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_AccountManager.Setup(_repo => _repo.ConfirmEmail(mock_ApplicationUser, It.IsAny<string>()))
                .ReturnsAsync(true);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ComfirmEmail(It.IsAny<string>(), It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region Login
        [Test]
        public async Task Login_WhenUserLoginFails_ReturnsUnauthorisedRequest()
        {
            // Arrange
            var mock_AuthResponseDto = new AuthResponseDto();
            mock_AuthResponseDto.IsAuthSuccessful = false;

            mock_AccountManager.Setup(_repo => _repo.Login(It.IsAny<UserForAuthenticationDto>()))
                .ReturnsAsync(mock_AuthResponseDto);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.Login(It.IsAny<UserForAuthenticationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<UnauthorizedObjectResult>());
        }

        [Test]
        public async Task Login_WhenUserLoginIsSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_AuthResponseDto = new AuthResponseDto();
            mock_AuthResponseDto.IsAuthSuccessful = true;

            mock_AccountManager.Setup(_repo => _repo.Login(It.IsAny<UserForAuthenticationDto>()))
                .ReturnsAsync(mock_AuthResponseDto);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.Login(It.IsAny<UserForAuthenticationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion  
    }
}
