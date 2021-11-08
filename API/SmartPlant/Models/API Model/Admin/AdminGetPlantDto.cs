using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model.Admin
{
    public class AdminGetPlantDto
    {
        
        public string PlantID { get; set; }

       
        public string UserID { get; set; }

       
        public string Name { get; set; }

       
        public string PlantType { get; set; }

        public string ImgurURL { get; set; }
    }
}
