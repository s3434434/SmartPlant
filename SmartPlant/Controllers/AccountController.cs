using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.JwtFeatures;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
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
                return BadRequest(new RegistrationResponseDto {isSuccessfulRegistration = false ,Errors = errors });
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
            if (user == null || ! await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {                
                return Unauthorized(new AuthResponseDto { ErrorMessage = "Incorrect Login Details" });
            }

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(user);                        
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthResponseDto { IsAuthSuccessful = true, Token = token });
        }



        /*            
         *            FOR
         *     USER ACCOUNT DETAILS
         *           BELOW
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
        public async Task<IActionResult> UpdateDetails()
        {


            return Ok();
        }





        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        //GET FOR ADMIN GETTING LIST OF USER IDS
        //admin
        //get all users list + name / email
        //get info for a specific user 
        //set info for a specific user - based on prefilled info from get

    }
}
