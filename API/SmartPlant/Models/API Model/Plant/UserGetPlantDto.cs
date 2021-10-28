using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Plant
{
    public class UserGetPlantDto
    {
        public string PlantID { get; set; }
        public string Name { get; set; }
        public string PlantType { get; set; }
    }
}
