using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Plant
{
    public class UpdatePlantDto
    {
        [MaxLength(250)]
        public string Name { get; set; }
        [Required]
        [MaxLength(450)]
        public string PlantID { get; set; }
    }
}
