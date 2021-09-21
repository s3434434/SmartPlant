using NUnit.Framework;
using Moq;
using AutoMapper;
using EmailService;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using SmartPlant.Models;
using SmartPlant.JwtFeatures;
using SmartPlant.Data;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.DataManager;
using SmartPlant.Models.API_Model.Account;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using SmartPlant.Models.API_Model.Admin;
using System.Threading;

namespace SmartPlant.Tests.Models.DataManager
{
    public class AccountManagerTests
    {
               
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<IMapper> mock_Mapper;
        private DatabaseContext mock_DatabaseContext;
        private Mock<IEmailSender> mock_EmailSender;
        private Mock<JwtHandler> mock_JWTHandler;
        private Mock<IPasswordHasher<ApplicationUser>> mock_PasswordHasher;

        [SetUp]
        public void Setup()
        {
            mock_PasswordHasher = new Mock<IPasswordHasher<ApplicationUser>>();
            
            mock_UserManager = new Mock<UserManager<ApplicationUser>>(
                Mock.Of<IUserStore<ApplicationUser>>(),
                null, null, null, null, null, null, null, null
                );

            mock_Mapper = new Mock<IMapper>();

            var options = new DbContextOptionsBuilder<DatabaseContext>()
                .UseInMemoryDatabase(databaseName: "Plants Test")
                .Options;

            mock_DatabaseContext = new DatabaseContext(options);
            mock_DatabaseContext.Plants.Add(new Plant { PlantID = "existing", UserID = "existing" });
            mock_DatabaseContext.SaveChanges();

            mock_EmailSender = new Mock<IEmailSender>();
            mock_JWTHandler = new Mock<JwtHandler>(Mock.Of<IConfiguration>(), mock_UserManager.Object);

            
        }

        [TearDown]
        public void TearDown()
        {
            mock_DatabaseContext.Database.EnsureDeleted();
        }

        #region Register
        [Test]
        public async Task Register_WhenUserRegistrationWithUserManagerFails_ReturnsRegistrationResponseDtoWithSuccessfullRegistrationFalse()
        {
            // Arrange
            var test_User = new Mock<ApplicationUser>();
            var test_UserRegistrationDto = new Mock<UserRegistrationDto>();
            var test_IdentityResult = IdentityResult.Failed();

            mock_UserManager.Setup(_userManager => _userManager.CreateAsync(test_User.Object, It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            RegistrationResponseDto result = await accountManager.Register(test_User.Object, test_UserRegistrationDto.Object);

            // Assert
            Assert.IsFalse(result.isSuccessfulRegistration);
        }

        [Test]
        public async Task Register_WhenUserRegistrationIsSuccessful_ReturnsRegistrationResponseDtoWithSuccessfullRegistrationTrue()
        {
            // Arrange
            var test_User = new Mock<ApplicationUser>();
            test_User.SetupProperty(m => m.Email, "test@email.com");

            var test_UserRegistrationDto = new UserRegistrationDto() { ClientURI = "testingURI" };

            var test_IdentityResult = IdentityResult.Success;
            var test_Token = "token";

            mock_UserManager.Setup(_userManager => _userManager.CreateAsync(test_User.Object, It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            mock_UserManager.Setup(_userManager => _userManager.GenerateEmailConfirmationTokenAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(test_Token);

            mock_EmailSender.Setup(_emailSender => _emailSender.SendEmailAsync(It.IsAny<Message>()));

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            RegistrationResponseDto result = await accountManager.Register(test_User.Object, test_UserRegistrationDto);

            // Assert
            Assert.IsTrue(result.isSuccessfulRegistration);
        }
        #endregion

        #region ConfirmEmail
        [Test]
        public async Task ConfirmEmail_WhenEmailConfirmationFails_ReturnsFalse()
        {
            // Arrange
            var test_Errors = new IdentityError[] { new IdentityError() { Code= "5", Description= "Email confirmation failed."} };

            var test_User = new Mock<ApplicationUser>();
            var test_Token = "token";

            var test_IdentityResult = IdentityResult.Failed(new IdentityError() { Code = "5", Description = "Email confirmation failed." });

            mock_UserManager.Setup(_userManager => _userManager.ConfirmEmailAsync(test_User.Object, It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.ConfirmEmail(test_User.Object, test_Token);

            // Assert
            Assert.IsFalse(result.Succeeded);
        }

        [Test]
        public async Task ConfirmEmail_WhenEmailConfirmationIsSuccessful_ReturnsTrue()
        {
            // Arrange
            var test_User = new Mock<ApplicationUser>();
            var test_Token = "token";

            var test_IdentityResult = IdentityResult.Success;

            mock_UserManager.Setup(_userManager => _userManager.ConfirmEmailAsync(test_User.Object, It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.ConfirmEmail(test_User.Object, test_Token);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
        #endregion

        #region Login
        [Test]
        public async Task Login_WhenUserDoesNotExist_ReturnsAuthResponseDtoWithFalse()
        {
            // Arrange
            var test_UserAuth = new UserForAuthenticationDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            AuthResponseDto result = await accountManager.Login(test_UserAuth);

            // Assert
            Assert.IsFalse(result.IsAuthSuccessful);
            Assert.AreEqual("Incorrect Login Details", result.ErrorMessage);
        }

        [Test]
        public async Task Login_WhenPasswordIncorrect_ReturnsAuthResponseDtoWithFalse()
        {
            // Arrange
            var test_User = new ApplicationUser();
            var test_UserAuth = new UserForAuthenticationDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.CheckPasswordAsync(test_User, It.IsAny<string>()))
                .ReturnsAsync(false);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            AuthResponseDto result = await accountManager.Login(test_UserAuth);

            // Assert
            Assert.IsFalse(result.IsAuthSuccessful);
            Assert.AreEqual("Incorrect Login Details", result.ErrorMessage);
        }

        [Test]
        public async Task Login_WhenUserHasNotConfirmedEmail_ReturnsAuthResponseDtoWithFalse()
        {
            // Arrange
            var test_User = new ApplicationUser();
            var test_UserAuth = new UserForAuthenticationDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.CheckPasswordAsync(test_User, It.IsAny<string>()))
                .ReturnsAsync(true);

            mock_UserManager.Setup(_userManager => _userManager.IsEmailConfirmedAsync(test_User))
                .ReturnsAsync(false);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            AuthResponseDto result = await accountManager.Login(test_UserAuth);

            // Assert
            Assert.IsFalse(result.IsAuthSuccessful);
            Assert.AreEqual("Email is not confirmed", result.ErrorMessage);
        }

        [Test]
        public async Task Login_WhenUserSuccessfullyLoggedIn_ReturnsAuthResponseDtoWithTrue()
        {
            // Arrange
            var test_User = new ApplicationUser();
            var test_UserAuth = new UserForAuthenticationDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.CheckPasswordAsync(test_User, It.IsAny<string>()))
                .ReturnsAsync(true);

            mock_UserManager.Setup(_userManager => _userManager.IsEmailConfirmedAsync(test_User))
                .ReturnsAsync(true);

            mock_JWTHandler.Setup(_jwtHandler => _jwtHandler.GetSigningCredentials())
                .Returns(new Mock<SigningCredentials>(Mock.Of<SecurityKey>(), SecurityAlgorithms.HmacSha256).Object);
            mock_JWTHandler.Setup(_jwtHandler => _jwtHandler.GetClaims(test_User))
                .ReturnsAsync(new List<Claim>());
            mock_JWTHandler.Setup(_jwtHandler => _jwtHandler.GenerateTokenOptions(It.IsAny<SigningCredentials>(), It.IsAny<List<Claim>>()))
                .Returns(new Mock<JwtSecurityToken>(null, null, null, null, null, null).Object);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            AuthResponseDto result = await accountManager.Login(test_UserAuth);

            // Assert
            Assert.IsTrue(result.IsAuthSuccessful);
        }
        #endregion

        #region ForgotPassword
        [Test]
        public async Task ForgotPassword_WhenUserNotFound_ReturnsNull()
        {
            // Arrange
            var test_ForgotPasswordDto = new ForgotPasswordDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.ForgotPassword(test_ForgotPasswordDto);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task ForgotPassword_WhenUserFound_CallsGeneratePasswordResetToken()
        {
            // Arrange
            var test_ForgotPasswordDto = new ForgotPasswordDto();
            test_ForgotPasswordDto.ClientURI = "mockURI";
            test_ForgotPasswordDto.Email = "test@email.com";

            var test_User = new ApplicationUser();
            test_User.Email = "test@email.com";

            var test_Token = "token";

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.GeneratePasswordResetTokenAsync(test_User))
                .ReturnsAsync(test_Token);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.ForgotPassword(test_ForgotPasswordDto);

            // Assert
            mock_UserManager.Verify(_userManager => _userManager.GeneratePasswordResetTokenAsync(test_User), Times.Once());
        }

        [Test]
        public async Task ForgotPassword_WhenUserFound_CallsSendEmailAsync()
        {
            // Arrange
            var test_ForgotPasswordDto = new ForgotPasswordDto();
            test_ForgotPasswordDto.ClientURI = "mockURI";
            test_ForgotPasswordDto.Email = "test@email.com";

            var test_User = new ApplicationUser();
            test_User.Email = "test@email.com";

            var test_Token = "token";

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.GeneratePasswordResetTokenAsync(test_User))
                .ReturnsAsync(test_Token);

            mock_EmailSender.Setup(_emailSender => _emailSender.SendEmailAsync(It.IsAny<Message>()));

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.ForgotPassword(test_ForgotPasswordDto);

            // Assert
            mock_EmailSender.Verify(_emailSender => _emailSender.SendEmailAsync(It.IsAny<Message>()), Times.Once());
        }

        [Test]
        public async Task ForgotPassword_WhenUserFound_ReturnsArrayOfTokens()
        {
            // Arrange
            var test_ForgotPasswordDto = new ForgotPasswordDto();
            test_ForgotPasswordDto.ClientURI = "mockURI";
            test_ForgotPasswordDto.Email = "test@email.com";

            var test_User = new ApplicationUser();
            test_User.Email = "test@email.com";

            var test_Token = "token";

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.GeneratePasswordResetTokenAsync(test_User))
                .ReturnsAsync(test_Token);

            mock_EmailSender.Setup(_emailSender => _emailSender.SendEmailAsync(It.IsAny<Message>()));

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.ForgotPassword(test_ForgotPasswordDto);

            // Assert
            Assert.NotNull(result);
        }
        #endregion

        #region ResetPassword
        [Test]
        public async Task ResetPassword_WhenUserNotFound_ReturnsNull()
        {
            // Arrange
            var test_ResetPasswordDto = new ResetPasswordDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.ResetPassword(test_ResetPasswordDto);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task ResetPassword_WhenUserFound_CallsUserManagerResetPasswordAsync()
        {
            // Arrange
            var test_ResetPasswordDto = new ResetPasswordDto();
            var test_User = new ApplicationUser();
            var test_IdentityResult = IdentityResult.Success;

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.ResetPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.ResetPassword(test_ResetPasswordDto);

            // Assert
            mock_UserManager.Verify(_userManager => _userManager.ResetPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once());
        }

        [Test]
        public async Task ResetPassword_WhenPasswordReset_ReturnsIdentityResultSuccessfulTrue()
        {
            // Arrange
            var test_ResetPasswordDto = new ResetPasswordDto();
            var test_User = new ApplicationUser();
            var test_IdentityResult = IdentityResult.Success;

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.ResetPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.ResetPassword(test_ResetPasswordDto);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
        #endregion

        #region GetDetails
        [Test]
        public async Task GetDetails_WhenUserNotFound_ReturnsNull()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.GetDetails(It.IsAny<string>());

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task GetDetails_WhenUserFound_ReturnsUserDetailsDto()
        {
            // Arrange
            var test_User = new ApplicationUser();
            test_User.FirstName = "Test";
            test_User.LastName = "Testington";
            test_User.Email = "test@email.com";
            test_User.PhoneNumber = "7355608";

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            UserDetailsDto result = await accountManager.GetDetails(It.IsAny<string>());

            // Assert
            Assert.AreEqual(result.Email, test_User.Email);
        }
        #endregion

        #region UpdateDetails
        [Test]
        public async Task UpdateDetails_WhenUserNotFound_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdateUserDetailsDto = new UpdateUserDetailsDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.UpdateDetails(It.IsAny<string>(), test_UpdateUserDetailsDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            var errorCodes = result.Errors.Select(x => x.Code).ToList();
            CollectionAssert.Contains(errorCodes, "0");
            
        }

        [Test]
        public async Task UpdateDetails_WhenUserFound_CallsUserManagerUpdateAsync()
        {
            // Arrange
            var test_UserID = "123456";

            var test_UpdateUserDetailsDto = new UpdateUserDetailsDto();

            var test_User = new ApplicationUser();
            test_User.FirstName = "Test";
            test_User.LastName = "Testington";
            test_User.Email = "test@email.com";
            test_User.PhoneNumber = "7355608";

            test_UpdateUserDetailsDto.FirstName = "Testy";
            test_UpdateUserDetailsDto.LastName = "Testington";
            test_UpdateUserDetailsDto.PhoneNumber = "7355608";

            var test_IdentityResult = IdentityResult.Success;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.UpdateAsync(test_User))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdateDetails(test_UserID, test_UpdateUserDetailsDto);

            // Assert
            mock_UserManager.Verify(_userManager => _userManager.UpdateAsync(test_User), Times.Once());
        }

        [Test]
        public async Task UpdateDetails_WhenUserFoundAndUpdateCalled_ReturnsIdentityResultSuccess()
        {
            // Arrange
            var test_UserID = "123456";

            var test_UpdateUserDetailsDto = new UpdateUserDetailsDto();

            var test_User = new ApplicationUser();
            test_User.FirstName = "Test";
            test_User.LastName = "Testington";
            test_User.Email = "test@email.com";
            test_User.PhoneNumber = "7355608";

            test_UpdateUserDetailsDto.FirstName = "Testy";
            test_UpdateUserDetailsDto.LastName = "Testington";
            test_UpdateUserDetailsDto.PhoneNumber = "7355608";

            var test_IdentityResult = IdentityResult.Success;

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.UpdateAsync(test_User))
                .ReturnsAsync(test_IdentityResult);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            IdentityResult result = await accountManager.UpdateDetails(test_UserID, test_UpdateUserDetailsDto);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
        #endregion

        #region UpdateEmail
        [Test]
        public async Task UpdateEmail_WhenUserNotFound_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdateEmailDto = new UpdateEmailDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdateEmail(It.IsAny<string>(), test_UpdateEmailDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            Assert.IsTrue(result.Errors.Any(e => e.Code == "0"));
        }

        [Test]
        public async Task UpdateEmail_WhenEmailAlreadyInUse_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdateEmailDto = new UpdateEmailDto();

            var test_User = new ApplicationUser() { 
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
                };

            var test_OtherUser = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "2"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_OtherUser);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdateEmail(It.IsAny<string>(), test_UpdateEmailDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            Assert.IsTrue(result.Errors.Any(e => e.Code == "1"));
        }

        [Test]
        public async Task UpdateEmail_WhenNewEmailMatchesExistingEmail_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdateEmailDto = new UpdateEmailDto();

            var test_User = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdateEmail(It.IsAny<string>(), test_UpdateEmailDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            Assert.IsTrue(result.Errors.Any(e => e.Code == "2"));
        }

        [Test]
        public async Task UpdateEmail_WhenEmailUpdatedSuccessful_ReturnsIdentityResultSuccess()
        {
            // Arrange
            var test_UpdateEmailDto = new UpdateEmailDto();

            var test_User = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_UserManager.Setup(_userManager => _userManager.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdateEmail(It.IsAny<string>(), test_UpdateEmailDto);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
        #endregion

        #region UpdatePassword
        [Test]
        public async Task UpdatePassword_WhenUserNotFound_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdatePasswordDto = new UpdatePasswordDto();

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdatePassword(It.IsAny<string>(), test_UpdatePasswordDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            Assert.IsTrue(result.Errors.Any(e => e.Code == "0"));
        }

        [Test]
        public async Task UpdatePassword_WhenOldPasswordDoesNotMatch_ReturnsIdentityResultFailed()
        {
            // Arrange
            var test_UpdatePasswordDto = new UpdatePasswordDto();
            var test_HashResult = PasswordVerificationResult.Failed;

            var test_User = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);
            
            mock_PasswordHasher.Setup(ph => ph.VerifyHashedPassword(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(test_HashResult);

            mock_UserManager.Object.PasswordHasher = mock_PasswordHasher.Object;

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdatePassword(It.IsAny<string>(), test_UpdatePasswordDto);

            // Assert
            Assert.IsFalse(result.Succeeded);
            Assert.IsTrue(result.Errors.Any(e => e.Code == "4"));
        }

        [Test]
        public async Task UpdatePassword_WhenOldPasswordDoesMatch_ReturnsIdentityResultSuccess()
        {
            // Arrange
            var test_UpdatePasswordDto = new UpdatePasswordDto();
            var test_HashResult = PasswordVerificationResult.Success;

            var test_User = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_PasswordHasher.Setup(ph => ph.VerifyHashedPassword(It.IsAny<ApplicationUser>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(test_HashResult);

            mock_UserManager.Object.PasswordHasher = mock_PasswordHasher.Object;

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.UpdatePassword(It.IsAny<string>(), test_UpdatePasswordDto);

            // Assert
            Assert.IsTrue(result.Succeeded);
        }
        #endregion

        #region AdminGetAllUsers
        /*
         * Returning to this later, mocking this is a bit of nightmare!
         * 
        [Test]
        public async Task AdminGetAllUsers_WhenCalled_ReturnsList()
        {
            // Arrange
            var test_UserList = new List<ApplicationUser>();
            var test_Result = new List<AdminGetAllUsersDto>();

            mock_UserManager.Setup(_userManager => _userManager.Users.ToListAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(test_UserList);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.AdminGetAllUsers();

            // Assert
            Assert.IsNotNull(result);
        }
        */
        #endregion

        #region AdminGetUserDetails
        [Test]
        public async Task AdminGetUserDetails_WhenUserDoesNotExist_ReturnsNull()
        {
            // Arrange
            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(() => null);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            var result = await accountManager.AdminGetUserDetails(It.IsAny<string>());

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task AdminGetUserDetails_WhenUserDoesExist_ReturnsUserDetailsDto()
        {
            // Arrange
            var test_User = new ApplicationUser()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608",
                Id = "1"
            };

            var test_UserDetailsDto = new UserDetailsDto()
            {
                FirstName = "Test",
                LastName = "Testington",
                Email = "test@email.com",
                PhoneNumber = "7355608"
            };

            mock_UserManager.Setup(_userManager => _userManager.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(test_User);

            mock_Mapper.Setup(_mapper => _mapper.Map<UserDetailsDto>(test_User))
                .Returns(test_UserDetailsDto);

            var accountManager = new AccountManager(
                mock_UserManager.Object,
                mock_Mapper.Object,
                mock_DatabaseContext,
                mock_EmailSender.Object,
                mock_JWTHandler.Object
                );

            // Act
            UserDetailsDto result = await accountManager.AdminGetUserDetails(It.IsAny<string>());

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("test@email.com", result.Email);
        }
        #endregion
    }
}
