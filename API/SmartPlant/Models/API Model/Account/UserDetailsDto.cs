using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class UserDetailsDto
    {
        [MaxLength(256)]
        public string FirstName { get; set; }
        [MaxLength(256)]
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
