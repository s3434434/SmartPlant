using Microsoft.AspNetCore.Identity;
using SmartPlant.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    public class UserController
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }





            //admin
            //get all users list + name / email
            //get info for a specific user 
            //set info for a specific user - based on prefilled info from get
    }
}
