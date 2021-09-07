using AutoMapper;
using Microsoft.AspNetCore.Identity;
using SmartPlant.Models.API_Model.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class AccountManager
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public AccountManager(UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

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

            await _userManager.UpdateAsync(user);

            return 1;
        }


        //admin
        //get all users list + name / email
        //get info for a specific user 
        //set info for a specific user - based on prefilled info from get
    }
}
