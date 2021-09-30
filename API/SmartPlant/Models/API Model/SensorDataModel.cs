using System;
using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models.API_Model
{
    public class SensorDataModel
    {
        public string PlantID { get; set; }

        [Required]
        public string Token { get; set; }

        [Range(-30, 50.00), Required]
        public decimal Temp { get; set; }

        [Range(0, 100.00), Required]
        public decimal Humidity { get; set; }

        [Range(0, 100.00), Required]
        public decimal LightIntensity { get; set; }

        [Range(0, 100.00), Required]
        public decimal Moisture { get; set; }

    }
}
