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
    }
}
