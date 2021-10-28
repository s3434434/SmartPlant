using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model.Plant
{
    public class AddPlantDto
    {
        //name of the plant chosen by the user e.g. COMPANY NAME - LOC - FLOOR 2 - MEETING ROOM 1
        [Required, MaxLength(250)]
        public string PlantName { get; set; }
        
        [Required, MaxLength(100)]
        public string PlantType { get; set; }

        public string Base64ImgString { get; set; }

    }
}
