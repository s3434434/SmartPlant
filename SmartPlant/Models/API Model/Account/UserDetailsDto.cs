﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Account
{
    public class UserDetailsDto
    {        
        [MaxLength(256)]
        public string FirstName { get; set; }
        [MaxLength(256)]
        public string LastName { get; set; }

        [MaxLength(256)]
        [Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }

        [MaxLength(10)]        
        public string PhoneNumber { get; set; }
    }
}