using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Plant
{
    public class PlantImageDto
    {
        [Required]
        public string Base64ImgString { get; set; }
    }
}
