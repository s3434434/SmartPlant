using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Account
{
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Password required.")]
        [MaxLength(256)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmNewPassword { get; set; }

        [Required]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; }
    }
}
