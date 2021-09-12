using AutoMapper;
using EmailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using SmartPlant.Data;
using SmartPlant.JwtFeatures;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.DataManager;
using SmartPlant.Models.Repository;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        //private readonly JwtHandler _jwtHandler;
        private readonly IAccountManager _repo;
        private readonly IEmailSender _emailSender;

        public AccountController(IAccountManager repo, IMapper mapper,
            UserManager<ApplicationUser> userManager, JwtHandler jwtHandler,
            IEmailSender emailSender)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
            //_jwtHandler = jwtHandler;
            _emailSender = emailSender;
        }

        [HttpPost("Register")]
        // [Route("api/Register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto userRegDto)
        {
            if (userRegDto == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = _mapper.Map<ApplicationUser>(userRegDto);

            var result = await _repo.Register(user, userRegDto);

            if (!result.isSuccessfulRegistration)
            {
                return BadRequest(result.Errors);
            }

            //return StatusCode(201)
            return Ok(result.Errors);
        }

        [HttpGet]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            var result = await _repo.ConfirmEmail(user, token);            

            if (!result)
            {
                return BadRequest("Invalid Email Confirmation Request - Something Went Wrong");
            }
            return Ok("Email Confirmed");
        }

        [HttpPost("Login")]
        //[Route("/api/Login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto loginUser)
        {
           //var user = await _userManager.FindByEmailAsync(loginUser.Email);

            var result = await _repo.Login(loginUser);
           /* //if user doens't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                return Unauthorized(new AuthResponseDto { IsAuthSuccessful = false,ErrorMessage = "Incorrect Login Details" });
            }
            if (! await _userManager.IsEmailConfirmedAsync(user)) // if the user hasn't confirmed their email
            {
                return Unauthorized(new AuthResponseDto { IsAuthSuccessful = false, ErrorMessage = "Email is not confirmed" });
            }            

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);*/

            //return Ok(new AuthResponseDto { IsAuthSuccessful = true, Token = token });

            if (!result.IsAuthSuccessful)
            {
                return Unauthorized(result.ErrorMessage);
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("Password/Forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.ForgotPassword(passwordDto);


           /* var user = await _userManager.FindByEmailAsync(passwordDto.Email);
            if (user == null)
            {
                return BadRequest("Email not found");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var param = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            var callback = QueryHelpers.AddQueryString(passwordDto.ClientURI, param);
            var message = new Message(new string[] { user.Email }, "SmarPlant - Reset Your Password", callback);
            await _emailSender.SendEmailAsync(message);

            return Ok();*/

            //----
            /*if (!result)
            {
                return BadRequest("Email not found");
            }

            return Ok();*/

            if (result == null)
            {
                return BadRequest("Email not found");
            }
            return Ok(result);


        }

        [HttpPost]
        [Route("Password/Reset")]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.ResetPassword(passwordDto);

            /*var user = await _userManager.FindByEmailAsync(passwordDto.Email);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            var result = await _userManager.ResetPasswordAsync(user, passwordDto.Token, passwordDto.NewPassword);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Error = errors });
            }

            return Ok();*/

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Error = errors });
            }
            return Ok();
        }
        


        /*            (user)
         *   ANY ROLE REQUIRED ENDPOINTS
         *             BELOW
         */


        [HttpGet]
        [Authorize]
        [Route("/api/User")]
        public async Task<IActionResult> GetDetails()
        {
            var userID = User.Identity.Name;

            var result = await _repo.GetDetails(userID);

            if (result == null)
            {
                return NotFound("User Not Found"); //shouldn't happen
            }

            return Ok(result);
        }

        [HttpPut]
        [Authorize]
        [Route("/api/User")]
        public async Task<IActionResult> UpdateDetails([FromBody] UpdateUserDetailsDto userDetailsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userID = User.Identity.Name;

            var results = await _repo.UpdateDetails(userID, userDetailsDto);



            return Ok(results);
        }

        [HttpPut]
        [Authorize]
        [Route("/api/User/Email")]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailDto emailDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userID = User.Identity.Name;

            var result = await _repo.UpdateEmail(userID, emailDto);

            if (result == -2)
            {
                return BadRequest("User Does Not Exist."); // this shouldn't happen...
            }
            if (result == -1)
            {
                return BadRequest("Email Already Taken"); // this shouldn't happen...
            }

            if (result == 0)
            {
                return Ok("New email is the same as current. Email not changed.");
            }

            return Ok("Success");
        }

        [HttpPut]
        [Authorize]
        [Route("/api/User/Password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var userID = User.Identity.Name;

            var result = await _repo.UpdatePassword(userID, passwordDto);

            if (result == 0)
            {
                return Unauthorized("Old Password Incorrect");
            }

            return Ok("Password Changed");
        }



        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        //GET FOR ADMIN GETTING LIST OF USER IDS
        //admin
        //get all users list + name / email
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Users")]
        public async Task<IActionResult> AdminGetAllUsers()
        {
            var result = await _repo.AdminGetAllUsers();

            if (result == null)
            {
                return NotFound("No Users Found");
            }

            return Ok(result);
        }

        //get info for a specific user 
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User")]
        public async Task<IActionResult> AdminGetUserDetails(string userID)
        {
            var result = await _repo.AdminGetUserDetails(userID);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        //set info for a specific user - based on prefilled info from get
        [HttpPut]  //if an Admin changes a user's emails, no verification needed.
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User")]
        public async Task<IActionResult> AdminUpdateDetails([FromBody] AdminUpdateUserDetailsDto DetailsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.AdminUpdateUserDetails(DetailsDto);

            if (result == null)
            {
                return BadRequest();
            }
            return Ok(result);
        }

        //get list of users and their roles
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User/Role")]
        public async Task<IActionResult> AdminGetRoleList()
        {
            var result = await _repo.AdminGetRoleList();
            return Ok(result);
        }

        //change user role to admin
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User/Role")]
        public async Task<IActionResult> AdminUpdateRole([FromBody] AdminUpdateUserRoleDto updateRoleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.AdminUpdateRole(updateRoleDto);

            return Ok(result);
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)] //change a user's password - old password not needed
        [Route("/api/Admin/User/Role/Password")]
        public async Task<IActionResult> AdminUpdatePassword([FromBody]AdminUpdatePasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.AdminUpdatePassword(passwordDto);
            if (result == null)
            {
                return NotFound("User not found)");
            }
            return Ok(result);
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User")]
        public async Task<IActionResult> AdminDeleteUser(string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound("User not found");
            }

            var result = await _repo.AdminDeleteUser(user);

            if (result == null)
            {
                return BadRequest("Something went wrong");
            }

            return Ok(result);
        }

    }
}
