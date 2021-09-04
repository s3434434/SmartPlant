using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartPlant.Models
{
    public class Plant
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key,Required]
        public string PlantID { get; set; }

        //foreign key from User - toDo
        [Required]
        public string userID { get; set; }


    }
}
