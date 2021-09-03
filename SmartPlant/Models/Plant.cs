using System.ComponentModel.DataAnnotations.Schema;

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
