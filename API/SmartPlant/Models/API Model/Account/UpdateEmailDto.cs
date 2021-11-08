using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class UpdateEmailDto
    {
        [MaxLength(256), EmailAddress, Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }
        [EmailAddress, Compare("Email", ErrorMessage = "Emails do not match.")]
        public string ConfirmEmail { get; set; }
    }
}
