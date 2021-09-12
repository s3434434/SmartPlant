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
        private Mock<ClaimsPrincipal> mock_Principal;

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

            // Mocking a ClaimsPrincipal which is passed via HTTPContext to the Controller
            // First an Identity
            var identity = new Mock<IIdentity>();
            identity.SetupGet(i => i.IsAuthenticated).Returns(true);
            identity.SetupGet(i => i.Name).Returns("FakeUserName");

            // Which is used by the ClaimsPrincipal
            mock_Principal = new Mock<ClaimsPrincipal>();
            mock_Principal.Setup(x => x.Identity).Returns(identity.Object);
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

        #region ConfirmEmail
        [Test]
        public async Task ConfirmEmail_WhenUserNotFound_ReturnsBadRequest()
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
            var result = await accountController.ConfirmEmail(It.IsAny<string>(), It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ConfirmEmail_WhenUserEmailTokenInvalid_ReturnsBadRequest()
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
            var result = await accountController.ConfirmEmail(It.IsAny<string>(), It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ConfirmEmail_WhenUserEmailConfirmedSuccessfully_ReturnsOkRequest()
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
            var result = await accountController.ConfirmEmail(It.IsAny<string>(), It.IsAny<string>());

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

        #region ForgotPassword
        [Test]
        public async Task ForgotPassword_WhenModelStateIsInvalid_ReturnsBadRequest()
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
            var result = await accountController.ForgotPassword(It.IsAny<ForgotPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task ForgotPassword_WhenEmailNotFound_ReturnsBadRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.ForgotPassword(It.IsAny<ForgotPasswordDto>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ForgotPassword(It.IsAny<ForgotPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ForgotPassword_WhenUserLoginIsSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new List<string>();

            mock_AccountManager.Setup(_repo => _repo.ForgotPassword(It.IsAny<ForgotPasswordDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ForgotPassword(It.IsAny<ForgotPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        #endregion

        #region ResetPassword
        [Test]
        public async Task ResetPassword_WhenModelStateIsInvalid_ReturnsBadRequest()
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
            var result = await accountController.ForgotPassword(It.IsAny<ForgotPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task ResetPassword_WhenEmailNotFound_ReturnsBadRequest()
        {
            // Arrange
            var error = new IdentityError()
            {
                Description = "Test error",
                Code = "1"
            };

            mock_AccountManager.Setup(_repo => _repo.ResetPassword(It.IsAny<ResetPasswordDto>()))
                .ReturnsAsync(IdentityResult.Failed(error));

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ResetPassword(It.IsAny<ResetPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ResetPassword_WhenUserLoginIsSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new List<string>();

            mock_AccountManager.Setup(_repo => _repo.ResetPassword(It.IsAny<ResetPasswordDto>()))
                .ReturnsAsync(IdentityResult.Success);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            // Act
            var result = await accountController.ResetPassword(It.IsAny<ResetPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkResult>());
        }
        #endregion

        #region GetDetails
        [Test]
        public async Task GetDetails_WhenUserDoesNotExist_ReturnsNotFoundRequest()
        {
            // Arrange
            var mock_Result = new UserDetailsDto();

            mock_AccountManager.Setup(_repo => _repo.GetDetails(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.GetDetails();

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetDetails_WhenUserDoesExist_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new UserDetailsDto();

            mock_AccountManager.Setup(_repo => _repo.GetDetails(It.IsAny<string>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.GetDetails();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region UpdateDetails
        [Test]
        public async Task UpdateDetails_WhenModelStateInvalid_ReturnsBadRequest()
        {
            // Arrange
            var mock_Result = "success";

            mock_AccountManager.Setup(_repo => _repo.UpdateDetails(It.IsAny<string>(), It.IsAny<UpdateUserDetailsDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            accountController.ModelState.AddModelError("Adding error", "Model state now invalid");

            // Act
            var result = await accountController.UpdateDetails(It.IsAny<UpdateUserDetailsDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task UpdateDetails_WhenDetailUpdateSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = "success";

            mock_AccountManager.Setup(_repo => _repo.UpdateDetails(It.IsAny<string>(), It.IsAny<UpdateUserDetailsDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdateDetails(It.IsAny<UpdateUserDetailsDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region UpdateEmail
        [Test]
        public async Task UpdateEmail_WhenModelStateInvalid_ReturnsBadRequest()
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
            var result = await accountController.UpdateEmail(It.IsAny<UpdateEmailDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task UpdateEmail_WhenUserDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            var mock_Result = -2;

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdateEmail(It.IsAny<UpdateEmailDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateEmail_WhenUserEmailAlreadyTaken_ReturnsBadRequest()
        {
            // Arrange
            var mock_Result = -1;

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdateEmail(It.IsAny<UpdateEmailDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task UpdateEmail_WhenNewEmailSameAsOldEmail_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = 0;

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdateEmail(It.IsAny<UpdateEmailDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        [Test]
        public async Task UpdateEmail_WhenDetailUpdateSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = 1;

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdateEmail(It.IsAny<UpdateEmailDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region UpdatePassword
        [Test]
        public async Task UpdatePassword_WhenModelStateInvalid_ReturnsBadRequest()
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
            var result = await accountController.UpdatePassword(It.IsAny<UpdatePasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestResult>());
        }

        [Test]
        public async Task UpdatePassword_WhenOldPasswordIncorrect_ReturnsUnauthorizedRequest()
        {
            // Arrange
            var mock_Result = 0;

            mock_AccountManager.Setup(_repo => _repo.UpdatePassword(It.IsAny<string>(), It.IsAny<UpdatePasswordDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdatePassword(It.IsAny<UpdatePasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<UnauthorizedObjectResult>());
        }

        [Test]
        public async Task UpdatePassword_WhenDetailUpdateSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = 1;

            mock_AccountManager.Setup(_repo => _repo.UpdatePassword(It.IsAny<string>(), It.IsAny<UpdatePasswordDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object,
                mock_JWTHandler.Object,
                mock_EmailSender.Object
                );

            accountController.ControllerContext.HttpContext = new DefaultHttpContext()
            {
                User = mock_Principal.Object
            };

            // Act
            var result = await accountController.UpdatePassword(It.IsAny<UpdatePasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());

        }

        #endregion
    }
}
