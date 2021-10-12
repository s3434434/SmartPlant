using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Admin
{
    public class AdminUpdateUserDetailsDto
    {
        [Required(ErrorMessage = "ID is required")]
        public string ID { get; set; }

        [RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string FirstName { get; set; }

        [RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters, no special characters or numbers. 50 Characters max.")]
        public string LastName { get; set; }

        [MaxLength(256), EmailAddress, Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }

        [RegularExpression(@"^0[23478]\d{8}$", ErrorMessage = "Must begin with a valid area code and be 10 digits: 02, 03, 04, 07, 08 ")]
        public string PhoneNumber { get; set; }
    }
}
