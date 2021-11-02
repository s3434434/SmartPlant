using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Plant
{
    public class UpdatePlantDto
    {
        [Required, MaxLength(250)]
        public string Name { get; set; }
        [Required]
        [MaxLength(450)]
        public string PlantID { get; set; }
        public string Base64ImgString { get; set; }
    }
}
