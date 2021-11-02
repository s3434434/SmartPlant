using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class UserForAuthenticationDto
    {
        [Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password required.")]
        public string Password { get; set; }
    }

    public class AuthResponseDto
    {
        public bool IsAuthSuccessful { get; set; }
        public Dictionary<string, List<string> > errors { get; set; }
        public string Token { get; set; }
    }
}
