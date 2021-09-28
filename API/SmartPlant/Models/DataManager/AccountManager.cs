using AutoMapper;
using EmailService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using SmartPlant.JwtFeatures;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Account;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.Repository;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class AccountManager : IAccountManager
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly DatabaseContext _context;
        private readonly IEmailSender _emailSender;
        private readonly JwtHandler _jwtHandler;

        public AccountManager(UserManager<ApplicationUser> userManager, IMapper mapper,
            DatabaseContext context, IEmailSender emailSender, JwtHandler jwtHandler)
        {
            _userManager = userManager;
            _mapper = mapper;
            _context = context;
            _emailSender = emailSender;
            _jwtHandler = jwtHandler;

        }

        public async Task<RegistrationResponseDto> Register(ApplicationUser user, UserRegistrationDto userRegDto)
        {
            var result = await _userManager.CreateAsync(user, userRegDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return new RegistrationResponseDto { isSuccessfulRegistration = false, Errors = errors };
            };

            //send confirmation email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var queryString = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            var content = QueryHelpers.AddQueryString(userRegDto.ClientURI, queryString);
            var message = new Message(new string[] { user.Email }, "SmartPlant - Confirm Your Email", content);
            await _emailSender.SendEmailAsync(message);

            await _userManager.AddToRoleAsync(user, UserRoles.User);

            return new RegistrationResponseDto { isSuccessfulRegistration = true, Errors = new string[] { "The token is added here for easier testing", token } };

        }

        public async Task<IdentityResult> ConfirmEmail(ApplicationUser user, string token)
        {
            return await _userManager.ConfirmEmailAsync(user, token);

            /*if (!result.Succeeded)
            {
                return false;
            }

            return true;*/
        }

        public async Task<AuthResponseDto> Login(UserForAuthenticationDto loginUser)
        {
            var user = await _userManager.FindByEmailAsync(loginUser.Email);

            //if user doens't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                return (new AuthResponseDto { IsAuthSuccessful = false, ErrorMessage = "Incorrect Login Details" });
            }
            if (!await _userManager.IsEmailConfirmedAsync(user)) // if the user hasn't confirmed their email
            {
                return (new AuthResponseDto { IsAuthSuccessful = false, ErrorMessage = "Email is not confirmed" });
            }

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return new AuthResponseDto { IsAuthSuccessful = true, Token = token };

        }


        public async Task<IEnumerable<string>> ForgotPassword(ForgotPasswordDto passwordDto)
        {
            var user = await _userManager.FindByEmailAsync(passwordDto.Email);
            if (user == null)
            {
                return null;
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var queryString = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            var content = QueryHelpers.AddQueryString(passwordDto.ClientURI, queryString);
            var message = new Message(new string[] { user.Email }, "SmartPlant - Reset Your Password", content);
            await _emailSender.SendEmailAsync(message);

            //return true;
            return new string[] { token };

        }

        public async Task<IdentityResult> ResetPassword(ResetPasswordDto passwordDto)
        {
            var user = await _userManager.FindByEmailAsync(passwordDto.Email);

            if (user == null)
            {
                return null;
            }

            var result = await _userManager.ResetPasswordAsync(user, passwordDto.Token, passwordDto.NewPassword);

            return result;
        }



        /*    
         *           (user)
        *   ANY ROLE REQUIRED ENDPOINTS
        *             BELOW
        */



        public async Task<UserDetailsDto> GetDetails(string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return null;
            }

            var details = new UserDetailsDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber
            };
            return details;
        }

        public async Task<IdentityResult> UpdateDetails(string userID, UpdateUserDetailsDto details)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError() { Code = "0", Description = "User not found." });
            }

            user.FirstName = details.FirstName;
            user.LastName = details.LastName;
            user.Address = details.Address;
            user.PhoneNumber = details.PhoneNumber;

            await _userManager.UpdateAsync(user);

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateEmail(string userID, UpdateEmailDto emailDto)
        {
            var id_user = await _userManager.FindByIdAsync(userID);

            if (id_user == null)
                return IdentityResult.Failed(new IdentityError() { Code = "0", Description = "User not found." });

            var email_user = await _userManager.FindByEmailAsync(emailDto.Email);

            if (email_user != null)
            {
                if (email_user.Id == id_user.Id)
                    return IdentityResult.Failed(new IdentityError() { Code = "2", Description = "New email is the same as existing email." });

                if (email_user.Id != id_user.Id)
                    return IdentityResult.Failed(new IdentityError() { Code = "1", Description = "Email already in use." });
            }

            id_user.Email = emailDto.Email;
            id_user.UserName = emailDto.Email;

            await _userManager.UpdateAsync(id_user);

            return IdentityResult.Success;

            /* _userManager.GenerateChangeEmailTokenAsync
             * 
             * Use this instead if we want to require verification for email changes.
             * This would change the return value
             * The generated changeemail token would need to be sent to the new email address
             * attached to the frontend URL as a query string for email change confirmation
             * e.g. www.frontend.com/email/confirm?email=newemail@gmail.com&token=*INSERT TOKEN HERE*
             * would require a new api endpoint to confirm email change
             */
        }

        /// <summary>
        /// Updates a users password.
        /// </summary>
        /// <param name="userID"></param>
        /// <param name="passwordDto"></param>
        /// <returns>
        /// An IdentityResult
        /// </returns>
        public async Task<IdentityResult> UpdatePassword(string userID, UpdatePasswordDto passwordDto)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError() { Code = "0", Description = "User not found." });
            }

            var result = await _userManager.ChangePasswordAsync(user, passwordDto.OldPassword, passwordDto.NewPassword);
            return result;
        }


        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */

        public async Task<List<AdminGetAllUsersDto>> AdminGetAllUsers()
        {
            var userList = await _userManager.Users.ToListAsync();

            var UserListDto = new List<AdminGetAllUsersDto>();

            foreach (ApplicationUser u in userList)
            {
                UserListDto.Add(
                    new AdminGetAllUsersDto
                    {
                        ID = u.Id,
                        Email = u.Email
                    }
                );
            }

            return UserListDto;
        }

        public async Task<UserDetailsDto> AdminGetUserDetails(string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null)
            {
                return null;
            }

            var detailsDto = _mapper.Map<UserDetailsDto>(user);

            return detailsDto;
        }

        public async Task<AdminUpdateUserDetailsDto> AdminUpdateUserDetails(AdminUpdateUserDetailsDto detailsDto)
        {
            var user = await _userManager.FindByIdAsync(detailsDto.ID);
            if (user == null)
            {
                return null;
            }

            user.FirstName = detailsDto.FirstName;
            user.LastName = detailsDto.LastName;
            user.Email = detailsDto.Email;
            user.Address = detailsDto.Address;
            user.PhoneNumber = detailsDto.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return detailsDto;
            }
            return null;
        }

        public async Task<List<AdminGetRoleListDto>> AdminGetRoleList()
        {
            var userList = await _userManager.Users.ToListAsync();
            var userRoleList = new List<AdminGetRoleListDto>();

            foreach (ApplicationUser u in userList)
            {

                var role = await _userManager.GetRolesAsync(u);

                userRoleList.Add(
                    new AdminGetRoleListDto
                    {
                        ID = u.Id,
                        Email = u.Email,
                        Role = role[0] //users should only have 1 role in this program
                    });
            }

            return userRoleList;
        }

        public async Task<AdminUpdateUserRoleDto> AdminUpdateRole(AdminUpdateUserRoleDto detailsDto)
        {
            var user = await _userManager.FindByIdAsync(detailsDto.ID);
            if (user == null)
            {
                return null;
            }

            if (detailsDto.Role == UserRoles.Admin)
            {   //add to new role, remove from old role
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
                await _userManager.RemoveFromRoleAsync(user, UserRoles.User);
                return detailsDto;

            }
            if (detailsDto.Role == UserRoles.User)
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
                await _userManager.RemoveFromRoleAsync(user, UserRoles.Admin);
                return detailsDto;
            }

            return null;
        }

        public async Task<IdentityResult> AdminUpdatePassword(AdminUpdatePasswordDto passwordDto)
        {
            var user = await _userManager.FindByIdAsync(passwordDto.ID);

            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError() { Code = "0", Description = "User not found." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, passwordDto.NewPassword);

            return result;
        }

        public async Task<IdentityResult> AdminDeleteUser(ApplicationUser user)
        {
            return await _userManager.DeleteAsync(user);
        }
    }
}
