﻿using System;
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