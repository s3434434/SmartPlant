using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Admin
{
    public class AdminUpdatePasswordDto
    {
        [Required(ErrorMessage = "ID is required")]
        public string ID { get; set; }

        [Required(ErrorMessage = "Password required.")]
        [MaxLength(256)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmNewPassword { get; set; }
    }
}
