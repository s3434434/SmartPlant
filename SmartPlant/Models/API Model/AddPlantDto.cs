using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class AddPlantDto
    {
        [Required]
        public string PlantID { get; set; }
    }
}
