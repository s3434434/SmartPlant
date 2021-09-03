using System;
using System.ComponentModel.DataAnnotations;

namespace SmartPlant.Models
{
    public class SensorData
    {
        //foreign key PlantID
        public string PlantID { get; set; }

        [Display(Name = "Temperature")]
        public decimal Temp { get; set; }

        //percentage value?        
        public decimal humidity { get; set; }

        //Integer value? measure in lux?
        public int LightIntensity { get; set; }

        //percentage value ? use integer if less precision is fine.
        public decimal Moisture { get; set; }

        //timestamp for when these values were recorded
        public DateTime TimeStamp { get; set; }

    }
}
