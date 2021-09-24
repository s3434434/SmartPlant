using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Account
{
    public class UpdateEmailDto
    {
        [DataType(DataType.EmailAddress)]
        [Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }
        [Compare("Email", ErrorMessage = "Emails do not match.")]
        public string ConfirmEmail { get; set; }
    }
}
