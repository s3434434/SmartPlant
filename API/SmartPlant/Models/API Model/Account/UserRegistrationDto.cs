using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model
{
    public class UserRegistrationDto
    {
        [RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string FirstName { get; set; }

        [RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string LastName { get; set; }

        [RegularExpression(@"^0[23478]\d{8}$", ErrorMessage = "Must begin with a valid area code and be 10 digits: 02, 03, 04, 07, 08 ")]
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
