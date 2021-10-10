using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model
{
    public class UserRegistrationDto
    {
        [MaxLength(250)]
        public string FirstName { get; set; }
        [MaxLength(250)]
        public string LastName { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }
        [MaxLength(10)]
        public string PhoneNumber { get; set; }

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
        public Dictionary<string, string> Errors { get; set; }
    }

}
