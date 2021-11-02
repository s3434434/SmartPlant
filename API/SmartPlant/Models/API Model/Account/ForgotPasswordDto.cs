using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class ForgotPasswordDto
    {
        [MaxLength(256), EmailAddress, Required(ErrorMessage = "Email required.")]
        public string Email { get; set; }
        [Required]
        public string ClientURI { get; set; }
    }
}
