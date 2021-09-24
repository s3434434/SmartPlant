using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Account
{
    public class UpdateUserDetailsDto
    {
        [MaxLength(256)]
        public string FirstName { get; set; }
        [MaxLength(256)]
        public string LastName { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }
        [MaxLength(10)]
        public string PhoneNumber { get; set; }
    }
}
