﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.JwtFeatures;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.DataManager;
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
        private readonly JwtHandler _jwtHandler;
        private readonly AccountManager _repo;

        public AccountController(AccountManager repo, IMapper mapper,
            UserManager<ApplicationUser> userManager, JwtHandler jwtHandler)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
            _jwtHandler = jwtHandler;
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

            var result = await _userManager.CreateAsync(user, userRegDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new RegistrationResponseDto { isSuccessfulRegistration = false, Errors = errors });
            };
            await _userManager.AddToRoleAsync(user, UserRoles.User);

            return StatusCode(201);
        }

        [HttpPost("Login")]
        //[Route("/api/Login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto loginUser)
        {
            var user = await _userManager.FindByEmailAsync(loginUser.Email);

            //if user doens't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                return Unauthorized(new AuthResponseDto { ErrorMessage = "Incorrect Login Details" });
            }

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthResponseDto { IsAuthSuccessful = true, Token = token });
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
            if (userDetailsDto == null)
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
            if (emailDto == null)
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
            if (passwordDto == null)
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

            return Ok(result);
        }

        //set info for a specific user - based on prefilled info from get
        [HttpPut]  //if an Admin changes a user's emails, no verification needed.
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User")]
        public async Task<IActionResult> AdminUpdateDetails([FromBody] AdminUpdateUserDetailsDto DetailsDto)
        {
            if (DetailsDto == null)
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
            if (updateRoleDto == null)
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
            if (passwordDto == null)
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

    }
}
