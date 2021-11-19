using System;
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
        private Mock<ClaimsPrincipal> mock_Principal;

        [SetUp]
        public void Setup()
        {
            // Mocking PlantManager, Mapper and UserManager for the AccountController
            mock_AccountManager = new Mock<IAccountManager>();
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

        #region Register
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
                mock_UserManager.Object
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
                mock_UserManager.Object


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
            var mock_ConfirmEmailDto = new ConfirmEmailDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object
                );

            // Act
            var result = await accountController.ConfirmEmail(mock_ConfirmEmailDto);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ConfirmEmail_WhenUserEmailTokenInvalid_ReturnsBadRequest()
        {
            // Arrange
            var mock_ConfirmEmailDto = new ConfirmEmailDto();
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_AccountManager.Setup(_repo => _repo.ConfirmEmail(mock_ApplicationUser, It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Failed());

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.ConfirmEmail(mock_ConfirmEmailDto);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task ConfirmEmail_WhenUserEmailConfirmedSuccessfully_ReturnsOkRequest()
        {
            // Arrange
            var mock_ConfirmEmailDto = new ConfirmEmailDto();
            var mock_ApplicationUser = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_ApplicationUser);

            mock_AccountManager.Setup(_repo => _repo.ConfirmEmail(mock_ApplicationUser, It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object
                );

            // Act
            var result = await accountController.ConfirmEmail(mock_ConfirmEmailDto);

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
                mock_UserManager.Object


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
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.Login(It.IsAny<UserForAuthenticationDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region ForgotPassword
        
        [Test]
        public async Task ForgotPassword_WhenEmailNotFound_ReturnsBadRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.ForgotPassword(It.IsAny<ForgotPasswordDto>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.ForgotPassword(It.IsAny<ForgotPasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }

        #endregion

        #region ResetPassword
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
                mock_UserManager.Object


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
                mock_UserManager.Object


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
                mock_UserManager.Object


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
                mock_UserManager.Object


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
        public async Task UpdateDetails_WhenDetailUpdateSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = IdentityResult.Success;

            mock_AccountManager.Setup(_repo => _repo.UpdateDetails(It.IsAny<string>(), It.IsAny<UpdateUserDetailsDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object
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
        public async Task UpdateEmail_WhenUserDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            var mock_Result = IdentityResult.Failed(new IdentityError() { Code = "0", Description = "User not found." });

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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
            var mock_Result = IdentityResult.Failed(new IdentityError() { Code = "1", Description = "Email already in use." });

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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
        public async Task UpdateEmail_WhenNewEmailSameAsOldEmail_ReturnsBadRequest()
        {
            // Arrange
            var mock_Result = IdentityResult.Failed(new IdentityError() { Code = "2", Description = "New email is the same as existing email." });

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object
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
        public async Task UpdateEmail_WhenDetailUpdateSuccessful_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = IdentityResult.Success;

            mock_AccountManager.Setup(_repo => _repo.UpdateEmail(It.IsAny<string>(), It.IsAny<UpdateEmailDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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
        public async Task UpdatePassword_WhenOldPasswordIncorrect_ReturnsUnauthorizedRequest()
        {
            // Arrange
            var mock_Result = IdentityResult.Failed(new IdentityError() { Code = "4", Description = "Old password is not correct." });

            mock_AccountManager.Setup(_repo => _repo.UpdatePassword(It.IsAny<string>(), It.IsAny<UpdatePasswordDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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
            var mock_Result = IdentityResult.Success;

            mock_AccountManager.Setup(_repo => _repo.UpdatePassword(It.IsAny<string>(), It.IsAny<UpdatePasswordDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


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

        #region AdminGetAllUsers
        [Test]
        public async Task AdminGetAllUsers_WhenNoUsersInRepo_ReturnsNotFoundRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.AdminGetAllUsers())
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminGetAllUsers();

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task AdminGetAllUsers_WhenUserDoesExistInRepo_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new UserDetailsDto();

            mock_AccountManager.Setup(_repo => _repo.AdminGetUserDetails(It.IsAny<string>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminGetUserDetails(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminGetUserDetails
        [Test]
        public async Task AdminGetUserDetails_WhenUserDoesNotExistInRepo_ReturnsNotFoundRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.AdminGetUserDetails(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminGetUserDetails(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundResult>());
        }

        [Test]
        public async Task AdminGetUserDetails_WhenUserDoesExistInRepo_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new UserDetailsDto();

            mock_AccountManager.Setup(_repo => _repo.AdminGetUserDetails(It.IsAny<string>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminGetUserDetails(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminUpdateDetails
        
        [Test]
        public async Task AdminUpdateDetails_WhenUserDoesNotExistInRepo_ReturnsNotFoundRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.AdminUpdateUserDetails(It.IsAny<AdminUpdateUserDetailsDto>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminUpdateDetails(It.IsAny<AdminUpdateUserDetailsDto>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task AdminUpdateDetails_WhenUserDoesExistInRepo_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new AdminUpdateUserDetailsDto();

            mock_AccountManager.Setup(_repo => _repo.AdminUpdateUserDetails(It.IsAny<AdminUpdateUserDetailsDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminUpdateDetails(It.IsAny<AdminUpdateUserDetailsDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminGetRoleList
        [Test]
        public async Task AdminGetRoleList_WhenRolesExistInRepo_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new List<AdminGetRoleListDto>();

            mock_AccountManager.Setup(_repo => _repo.AdminGetRoleList())
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminGetRoleList();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminUpdateRole
       
        [Test]
        public async Task AdminUpdateRole_WhenRoleUpdatedSucessefully_ReturnsOkRequest()
        {
            // Arrange
            var mock_Result = new AdminUpdateUserRoleDto();

            mock_AccountManager.Setup(_repo => _repo.AdminUpdateRole(It.IsAny<AdminUpdateUserRoleDto>()))
                .ReturnsAsync(mock_Result);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object
                );

            // Act
            var result = await accountController.AdminUpdateRole(It.IsAny<AdminUpdateUserRoleDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminUpdatePassword
        
        [Test]
        public async Task AdminUpdatePassword_WhenUserNotInRepo_ReturnsNotFoundRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.AdminUpdatePassword(It.IsAny<AdminUpdatePasswordDto>()))
                .ReturnsAsync(IdentityResult.Failed());

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminUpdatePassword(It.IsAny<AdminUpdatePasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task AdminUpdatePassword_WhenPasswordUpdatedSucessefully_ReturnsOkRequest()
        {
            // Arrange
            mock_AccountManager.Setup(_repo => _repo.AdminUpdatePassword(It.IsAny<AdminUpdatePasswordDto>()))
                .ReturnsAsync(IdentityResult.Success);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminUpdatePassword(It.IsAny<AdminUpdatePasswordDto>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion

        #region AdminDeleteUser
        [Test]
        public async Task AdminDeleteUser_WhenUserNotInRepo_ReturnsNotFoundRequest()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminDeleteUser(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task AdminDeleteUser_WhenUserDeleteFails_ReturnsBadRequest()
        {
            // Arrange
            var mock_FindResult = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_FindResult);

            mock_AccountManager.Setup(_repo => _repo.AdminDeleteUser(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(() => null);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminDeleteUser(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task AdminDeleteUser_WhenUserDeletedSucessefully_ReturnsOkRequest()
        {
            // Arrange
            var mock_FindResult = new ApplicationUser();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(mock_FindResult);

            mock_AccountManager.Setup(_repo => _repo.AdminDeleteUser(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(IdentityResult.Success);

            var accountController = new AccountController(
                mock_AccountManager.Object,
                mock_Mapper.Object,
                mock_UserManager.Object


                );

            // Act
            var result = await accountController.AdminDeleteUser(It.IsAny<string>());

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
        }
        #endregion
    }
}
