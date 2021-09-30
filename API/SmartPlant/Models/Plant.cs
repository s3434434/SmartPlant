using SmartPlant.Models.Repository;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartPlant.Models
{
    public class Plant
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key, Required]
        public string PlantID { get; set; }

        [ForeignKey("User"), Required]
        public string UserID { get; set; }

        //name of the plant chosen by the user e.g. COMPANY NAME - LOC - FLOOR 2 - MEETING ROOM 1
        [MaxLength(250)]
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }
        [JsonIgnore] public virtual PlantToken Token { get; set; }

        public override string ToString()
        {
            return $"Plant ID: {PlantID}\nuserID: {UserID}\nPlant Name: {Name}";
        }

    }
}
