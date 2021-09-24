using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Admin
{
    public class AdminUpdateUserDetailsDto
    {   
        [Required(ErrorMessage="ID is required")]
        public string ID { get; set; }

        [MaxLength(250)]
        public string FirstName { get; set; }
        [MaxLength(250)]
        public string LastName { get; set; }

        [MaxLength(256)]
        [Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }
        [MaxLength(10)]
        public string PhoneNumber { get; set; }
    }
}
