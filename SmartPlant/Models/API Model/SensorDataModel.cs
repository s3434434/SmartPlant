using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class SensorDataModel
    {
        [Required]
        public string PlantID { get; set; }
        
        [Range(-50, 50), Required]
        public int Temp { get; set; }
        
        [Range(0, 100), Required]
        public int Humidity { get; set; }
        
        [Range(0, 100), Required]
        public int LightIntensity { get; set; }

        [Range(0, 100), Required]
        public int Moisture { get; set; }
      

        public decimal Test { get; set; }
    }
}
