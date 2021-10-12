using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class UserDetailsDto
    {
        [RegularExpression(@"^[A-Za-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string FirstName { get; set; }

        [RegularExpression(@"^[A-Za-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string LastName { get; set; }

        [MaxLength(256)]
        [Required(ErrorMessage = "Email required.")]

        public string Email { get; set; }

        [MaxLength(10), MinLength(10), RegularExpression(@"^0[23478]\d{8}$", ErrorMessage = "Must begin with a valid area code and be 10 digits: 02, 03, 04, 07, 08 ")]
        public string PhoneNumber { get; set; }
    }
}
