using System;
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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace SmartPlant.Models.DataManager
{
    public class AccountManager : IAccountManager
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly DatabaseContext _context;
        private readonly IEmailSender _emailSender;
        private readonly JwtHandler _jwtHandler;
        private readonly IConfiguration _configuration;

        public AccountManager(UserManager<ApplicationUser> userManager, IMapper mapper,
            DatabaseContext context, IEmailSender emailSender, JwtHandler jwtHandler,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _mapper = mapper;
            _context = context;
            _emailSender = emailSender;
            _jwtHandler = jwtHandler;
            _configuration = configuration;

        }
        public async Task<RegistrationResponseDto> Register(ApplicationUser user, UserRegistrationDto userRegDto)
        {
            user.PhoneNumber = user.PhoneNumber?.Length > 0 ? user.PhoneNumber : null;

            var result = await _userManager.CreateAsync(user, userRegDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                var errorDictionary = new Dictionary<string, List<String>>();

                errors.ToList().ForEach(e => errorDictionary.Add(Regex.Match(e, @"^([\w\-]+)").Value, new List<string> { e }));

                return new RegistrationResponseDto
                {
                    isSuccessfulRegistration = false,
                    Errors = errorDictionary
                };
            };

            //send confirmation email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var queryString = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            //setting the emails message
            var content = $"Thank you for registering for Demeter!\n\n\n" +
                          $"Please click on the following link to confirm your email and activate your account.\n\n{QueryHelpers.AddQueryString(userRegDto.ClientURI, queryString)}";
            var message = new Message(new string[] { user.Email }, "Demeter SmartPlant - Confirm Your Email", content);
            await _emailSender.SendEmailAsync(message);

            await _userManager.AddToRoleAsync(user, UserRoles.User);

            return new RegistrationResponseDto
            {
                isSuccessfulRegistration = true,
                Errors = new Dictionary<string, List<string>>() { { "The token is added here for easier testing", new List<string> { token } } }
            };

        }

        public async Task<IdentityResult> ConfirmEmail(ApplicationUser user, string token)
        {
            return await _userManager.ConfirmEmailAsync(user, token);
        }

        public async Task<AuthResponseDto> Login(UserForAuthenticationDto loginUser)
        {
            var user = await _userManager.FindByEmailAsync(loginUser.Email);

            //if user doesn't exist or password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                return (new AuthResponseDto
                {
                    IsAuthSuccessful = false,
                    errors = new Dictionary<string, List<string>>
                    {
                        {"Login Details", new List<string>{"Incorrect Login Details"} }
                    }
                });
            }
            if (!await _userManager.IsEmailConfirmedAsync(user)) // if the user hasn't confirmed their email
            {
                return (new AuthResponseDto
                {
                    IsAuthSuccessful = false,
                    errors = new Dictionary<string, List<string>>
                    {
                        {"Email", new List<string> {"Email is not confirmed"}}
                    }
                });
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

            //setting email message
            var content = $"Hello {user.Email}!\n\n" +
                          $"Please click on the following link to reset your password\n\n" +
                          $"{QueryHelpers.AddQueryString(passwordDto.ClientURI, queryString)}\n\n" +
                          $"If you did not request to reset your password, your account may have been compromised. We suggest you change all your passwords immediately.";
            var message = new Message(new string[] { user.Email }, "Demeter SmartPlant - Reset Your Password", content);
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


        public async Task<bool> ContactSupport(string userID, SupportEmailDto dto)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return false;
            }

            var subject = $"{user.FirstName}  | {user.Email} | {user.Id} -- {dto.EmailSubject} ";

            //email message
            var content = $"=================================================================\n\n" +
                          $"Name:\t\t {user.FirstName ?? "N/A"}\n" +
                          $"Email:\t\t {user.Email},\n" +
                          $"UserID:\t\t {user.Id}\n\n" +
                          $"=================================================================\n" +
                          $"\n\n{dto.EmailBody}";

            var receivingEmail = _configuration.GetSection("SupportEmailConfig").GetSection("ReceivingEmail").Value;

            var message = new Message(new string[] { receivingEmail }, subject, content);
            await _emailSender.SendEmailAsync(message);

            return true;
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
            user.PhoneNumber = details.PhoneNumber?.Length > 0 ? details.PhoneNumber : null;

            return await _userManager.UpdateAsync(user);
        }

        public async Task<IdentityResult> UpdateEmail(string userID, UpdateEmailDto emailDto)
        {
            var id_user = await _userManager.FindByIdAsync(userID);

            if (id_user == null)
                return IdentityResult.Failed(new IdentityError() { Code = "NotFound", Description = "User not found." });

            var email_user = await _userManager.FindByEmailAsync(emailDto.Email);

            if (email_user != null)
            {
                if (email_user.Id == id_user.Id)
                    return IdentityResult.Failed(new IdentityError() { Code = "Same", Description = "New email is the same as existing email." });

                if (email_user.Id != id_user.Id)
                    return IdentityResult.Failed(new IdentityError() { Code = "Exists", Description = "Email already in use." });
            }

            id_user.Email = emailDto.Email;
            id_user.UserName = emailDto.Email;

            return await _userManager.UpdateAsync(id_user);

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
                return IdentityResult.Failed(new IdentityError() { Code = "NotFound", Description = "User not found." });
            }

            var result = await _userManager.ChangePasswordAsync(user, passwordDto.OldPassword, passwordDto.NewPassword);
            return result;
        }

        public async Task<string> GetCurrentUserRole(string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);
            if (user != null)
            {
                var result = await _userManager.GetRolesAsync(user);

                return result[0]; //in this program a user should only have one role.
            }

            return "";
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
            user.PhoneNumber = detailsDto.PhoneNumber?.Length > 0 ? detailsDto.PhoneNumber : null;

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
