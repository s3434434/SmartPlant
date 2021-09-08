using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class UserRegistrationDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password required")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }
        
        [Required(ErrorMessage = "This is the uri for the frontend confirmation page")]
        public string ClientURI { get; set; }
    }

    public class RegistrationResponseDto 
    {
        public bool isSuccessfulRegistration { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }

}
