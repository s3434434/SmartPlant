using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Account
{
    public class UpdatePasswordDto
    {
        [Required(ErrorMessage = "Password required.")]
        [MaxLength(256)]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Password required.")]
        [MaxLength(256)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmNewPassword { get; set; }
    }
}
