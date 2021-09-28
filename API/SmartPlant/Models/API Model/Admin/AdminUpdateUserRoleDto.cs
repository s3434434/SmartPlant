using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Admin
{
    public class AdminUpdateUserRoleDto
    {

        [Required(ErrorMessage = "ID Required")]
        public string ID { get; set; }

        [Required]
        [RegularExpression(@"^Admin$|^User$", ErrorMessage = "Role must be 'Admin' or 'User'")]
        public string Role { get; set; }
    }
}
