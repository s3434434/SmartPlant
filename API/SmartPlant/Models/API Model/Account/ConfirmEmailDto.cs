using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Account
{
    public class ConfirmEmailDto
    {
        [Required, MaxLength(250)]
        public string Email { get; set; }
        [Required, MaxLength(500)]
        public string Token { get; set; }
    }
}
