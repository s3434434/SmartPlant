using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class AdminAddPlantDto
    {
        [Required]
        public string UserID { get; set; }
    }
}
