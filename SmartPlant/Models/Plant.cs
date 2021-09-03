using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models
{
    public class Plant
    {
        //[DatabaseGenerated(DatabaseGeneratedOption.none)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string PlantID { get; set; }

        //foreign key from User
        public string OwnerID { get; set; }


    }
}
