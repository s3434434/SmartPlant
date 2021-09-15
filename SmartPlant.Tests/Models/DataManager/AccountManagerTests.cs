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

namespace SmartPlant.Tests.Models.DataManager
{
    public class AccountManagerTests
    {
               
        private Mock<UserManager<ApplicationUser>> mock_UserManager;
        private Mock<IMapper> mock_Mapper;
        private DatabaseContext mock_DatabaseContext;
        private Mock<IEmailSender> mock_EmailSender;
        private Mock<JwtHandler> mock_JWTHandler;

        [SetUp]
        public void Setup()
        {
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
        #endregion
    }
}
