using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.Repository;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAccountManager _repo;

        public AccountController(IAccountManager repo, IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        /// <summary>
        /// Registers a user to the database, sends a confirmation email .
        /// </summary>
        /// <remarks>
        /// This takes in a URI, e.g. website.com/confirmEmail , and attaches the confirmation token and email as a querystring. This 
        /// gets sent as the confirmation link in the email and should be routed to the frontend confirmation webpage. &#xA;
        /// The only required inputs are the Email, Password, Confirmation Password. &#xA;
        /// &#xA;
        /// First name, last name, and phone number are optional and can be left blank.&#xA;
        /// &#xA;
        /// If included, &#xA;
        /// First Name and Last Name can only contain letters, no special characters or numbers, max length of 50. &#xA;
        /// Phone Numbers must begin with [02, 03, 04, 07, 08] followed by 8 digits. Length must equal 10.
        /// </remarks>
        /// <param name="userRegDto"></param>
        /// <response code="200">Successfully Registers User</response>
        /// <response code="400">Invalid Registration input</response>
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
                return BadRequest(result);
            }

            //return StatusCode(201)
            return Ok(result);
        }


        /// <summary>
        /// Confirms a user's email 
        /// </summary>
        /// <remarks>Required to login</remarks>        
        /// <response code="200">Successfully Logged In</response>
        /// <response code="400">Failed to login</response>
        [HttpPut]
        [Route("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                return BadRequest("User Not Found");
            }

            var result = await _repo.ConfirmEmail(user, dto.Token);

            if (!result.Succeeded)
            {
                return BadRequest("Invalid Email Confirmation Request - Something Went Wrong");
            }
            return Ok("Email Confirmed");
        }


        /// <summary>
        /// Logs the user in, returns a Json Web Token in the response body
        /// </summary>
        /// <remarks>The JWT must be stored (local storage?) and used with every API endpoint that requires authentication.
        /// Pass the token through in the header with authorization type bearer e.g.&#xA; 
        /// 'headers': { &#xA;
        ///     ...
        ///     'Authorization': 'Bearer [INSERT TOKEN HERE]', &#xA;
        ///     'Content-Type': 'application/json' &#xA;
        ///     }
        /// </remarks>
        /// <response code="200">Successfully Logged In</response>
        /// <response code="401">Invalid Login Details</response>
        [HttpPost("Login")]
        //[Route("/api/Login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto loginUser)
        {
            var result = await _repo.Login(loginUser);

            if (!result.IsAuthSuccessful)
            {
                return Unauthorized(result.ErrorMessage);
            }

            return Ok(result.Token);
        }


        /// <summary>
        /// Sends a confirmation email with a password reset token to the user.
        /// </summary>
        /// <remarks>The also takes in a URI, which would be the route for the frontend 'confirm reset password' page.
        /// To that URI it attaches a querystring with the user's email and password reset token.
        /// </remarks>
        /// <response code="200">Reset Email Sent</response>
        /// <response code="400">Invalid Details</response>
        [HttpPost]
        [Route("Password/Forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.ForgotPassword(passwordDto);

            if (result == null)
            {
                return BadRequest("Email not found");
            }
            return Ok(result);
        }


        /// <summary>
        /// Resets the user's password
        /// </summary>
        /// <remarks>
        /// This takes in a password and confirmed password, and the token + email from the 'forgot password' email.&#xA;
        /// The token is probably html encoded e.g. '/' becomes %2F in the URL  &#xA;
        /// needs to be decoded before using
        /// </remarks>
        /// <response code="200">Password Reset</response>
        /// <response code="400">Something went wrong, incorrect info</response>
        [HttpPost]
        [Route("Password/Reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.ResetPassword(passwordDto);

            if (result == null)
            {
                return BadRequest("Email not found");
            }

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


        /// <summary>
        /// Gets the logged in user's details
        /// </summary>
        /// <remarks>Returns user details (First name, last name, email, phone number)
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">Something went wrong, user not found</response>
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


        /// <summary>
        /// Updates non-important details (First name, last name, address, phone number)
        /// </summary>
        /// <remarks>This is used for updating non-important user details. Since the email address is used to login, it has its own method
        /// &#xA;
        /// First Name and Last Name can only contain letters, no special characters or numbers, max length of 50. &#xA;
        /// Phone Numbers must begin with [02, 03, 04, 07, 08] followed by 8 digits. Length must equal 10.
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Something went wrong, user not found</response>
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


        /// <summary>
        /// Updates the logged in user's email
        /// </summary>
        /// <remarks>The new email will be required for future logins. -No confirmation email sent.
        /// </remarks>
        /// <response code="200">Email changed or same as current</response>
        /// <response code="400">Bad input, or email already taken</response>
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

            IdentityResult result = await _repo.UpdateEmail(userID, emailDto);

            if (!result.Succeeded)
            {
                foreach (IdentityError error in result.Errors)
                    return BadRequest(error.Description);
            }

            return Ok("Success");
        }


        /// <summary>
        /// Updates the logged in user's password
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Password Changed</response>
        /// <response code="400">Passwords don't match</response>
        /// <response code="401">Old password Incorrect</response>
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

            if (!result.Succeeded)
            {
                foreach (IdentityError error in result.Errors)
                    return Unauthorized(error.Description);
            }

            return Ok("Password Changed");
        }

        /// <summary>
        /// Sends an email to support -- currently the email used is SmartPlantTeam4@gmail.com
        /// </summary>
        /// <remarks>
        /// This requires a logged in user to use.
        /// </remarks>
        /// <response code="200">Email Sent</response>
        /// <response code="400">Something went wrong</response>
        /// <response code="401"></response>
        [HttpPost]
        [Authorize]
        [Route("/api/User/ContactSupport")]
        public async Task<IActionResult> ContactSupport(SupportEmailDto dto)
        {
            string userID = User.Identity.Name;

            var result =  await _repo.ContactSupport(userID, dto);

            if (!result)
            {
                return BadRequest("Something went wrong.");
            }
            return Ok("Email Sent");
        }


        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        /// <summary>
        /// Gets a list of all Users and their details (User Id, Email)
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Sucess</response>
        /// <response code="404">No Users Found</response>
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

        /// <summary>
        /// Gets info for a specific user (First name, last name, address, phone number)
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">User Found</response>
        /// <response code="404">User Not Found</response>
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


        /// <summary>
        /// Used to update a user's details (First name, last name, address, phone number, email)
        /// </summary>
        /// <remarks>Since this is an admin action, no verification needed for changing emails
        /// &#xA;
        /// If included, &#xA;
        /// First Name and Last Name can only contain letters, no special characters or numbers, max length of 50. &#xA;
        /// Phone Numbers must begin with [02, 03, 04, 07, 08] followed by 8 digits. Length must equal 10.
        /// </remarks>
        /// <response code="200">Details successfully updated</response>
        /// <response code="400">User Not Found or email already in use</response>
        [HttpPut]
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
                return BadRequest("Email already exists or user does not exist");
            }
            return Ok(result);
        }


        /// <summary>
        /// Gets a list of users and their roles (userID, email, role)
        /// </summary>
        /// <remarks>Currently there are only 2 roles, User and Admin
        /// </remarks>
        /// <response code="200">Success</response>
        //get list of users and their roles
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/User/Role")]
        public async Task<IActionResult> AdminGetRoleList()
        {
            var result = await _repo.AdminGetRoleList();
            return Ok(result);
        }


        /// <summary>
        /// Used to update a user's role
        /// </summary>
        /// <remarks>Elevate a user to an Admin, or vice versa
        /// </remarks>
        /// <response code="200">Role Updated</response>
        /// <response code="400">Failed to update</response>
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


        /// <summary>
        /// Change a user's password
        /// </summary>
        /// <remarks>Takes in a userID, a new password, and a confirmation password
        /// </remarks>
        /// <response code="200">Password Updated</response>
        /// <response code="400">Passwords don't match</response>
        /// <response code="404">UserID Not Found</response>
        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)] //change a user's password - old password not needed
        [Route("/api/Admin/User/Password")]
        public async Task<IActionResult> AdminUpdatePassword([FromBody] AdminUpdatePasswordDto passwordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var result = await _repo.AdminUpdatePassword(passwordDto);

            if (!result.Succeeded)
            {
                return NotFound(result.Errors);
            }
            return Ok(result);
        }


        /// <summary>
        /// Deletes a User
        /// </summary>
        /// <remarks>Deleting a user will cascade delete all connected plants, which will delete all connected sensor data.
        /// </remarks>
        /// <response code="200">User Deleted</response>
        /// <response code="400">Bad Data</response>
        /// <response code="404">UserID Not Found</response>
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
