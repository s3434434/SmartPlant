using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model
{
    public class AdminAddPlantDto
    {
        [Required]
        [MaxLength(450)]
        public string UserID { get; set; }
        [MaxLength(250)]
        public string PlantName { get; set; }
    }
}
