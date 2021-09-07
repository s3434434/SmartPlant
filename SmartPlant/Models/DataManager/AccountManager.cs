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

        public AccountManager(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;

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



        //admin
        //get all users list + name / email
        //get info for a specific user 
        //set info for a specific user - based on prefilled info from get
    }
}
