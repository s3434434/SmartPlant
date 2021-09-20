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
using System;
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
            var param = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            var callback = QueryHelpers.AddQueryString(userRegDto.ClientURI, param);
            var message = new Message(new string[] { user.Email }, "SmarPlant - Confirm Your Email", callback);
            await _emailSender.SendEmailAsync(message);

            await _userManager.AddToRoleAsync(user, UserRoles.User);

            return new RegistrationResponseDto { isSuccessfulRegistration = true, Errors = new string[] { "The token is added here for easier testing",token } };

        }

        public async Task<bool> ConfirmEmail(ApplicationUser user, string token)
        {
            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (!result.Succeeded)
            {
                return false;
            }

            return true;
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

            var param = new Dictionary<string, string>
            {
                {"token", token },
                { "email", user.Email }
            };

            var callback = QueryHelpers.AddQueryString(passwordDto.ClientURI, param);
            var message = new Message(new string[] { user.Email }, "SmarPlant - Reset Your Password", callback);            
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
                PhoneNumber = user.PhoneNumber
            };
            return details;
        }

        public async Task<String> UpdateDetails(string userID, UpdateUserDetailsDto details)
        {
            //check if email exists elsewhere
            // var emailAlreadyExists = await _userManager.FindByEmailAsync(details.Email);
            var user = await _userManager.FindByIdAsync(userID);

            //if the email already belongs to a user
            //check that it belongs to THE user
            //if so keep going
            //otherwise if it belongs to someone else, stop            

            /*if (emailAlreadyExists != null)
            {
                if (emailAlreadyExists.Id != user.Id)
                {
                    return null;
                }

            }*/

            user.FirstName = details.FirstName;
            user.LastName = details.LastName;
            //user.Email = details.Email;
            //user.UserName = details.Email;
            user.PhoneNumber = details.PhoneNumber;

            await _userManager.UpdateAsync(user);

            return "success";
        }

        public async Task<int> UpdateEmail(string userID, UpdateEmailDto emailDto)
        {
            var user = await _userManager.FindByIdAsync(userID);
            if (user == null)
            {
                return -2;
            }

            var doesEmailAlreadyExist = await _userManager.FindByEmailAsync(emailDto.Email);

            if (doesEmailAlreadyExist != null)
            {
                if (doesEmailAlreadyExist.Id == userID)
                {
                    return 0;
                }
                return -1;
            }

            user.Email = emailDto.Email;
            user.UserName = emailDto.Email;

            await _userManager.UpdateAsync(user);

            return 1;

        }

        public async Task<int> UpdatePassword(string userID, UpdatePasswordDto passwordDto)
        {
            var user = await _userManager.FindByIdAsync(userID);

            var oldPasswordMatches = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, passwordDto.OldPassword);
            if (oldPasswordMatches == 0)// 0 means it doesn't match
            {
                return 0;
            }

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, passwordDto.NewPassword);

            Console.WriteLine($"User email:  |{user.Email}|");
            await _userManager.UpdateAsync(user);

            return 1;
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

        public async Task<string> AdminUpdatePassword(AdminUpdatePasswordDto passwordDto)
        {
            var user = await _userManager.FindByIdAsync(passwordDto.ID);
            
            if (user == null)
            {
                return null;
            }

            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, passwordDto.NewPassword);

            await _userManager.UpdateAsync(user);

            return "Password Updated";

        }

        public async Task<string> AdminDeleteUser(ApplicationUser user)
        {
            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return null;
            }
            return "User Deleted";
        }

    }
}
