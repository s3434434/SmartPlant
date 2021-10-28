using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using SmartPlant.Models.Repository;

namespace SmartPlant.Models
{
    public class Plant
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key, Required]
        public string PlantID { get; set; }

        [ForeignKey("User"), Required]
        public string UserID { get; set; }

        //name of the plant chosen by the user e.g. COMPANY NAME - LOC - FLOOR 2 - MEETING ROOM 1
        [Required, MaxLength(250)]
        public string Name { get; set; }

        [Required, MaxLength(100)]
        public string PlantType { get; set; }

        [JsonIgnore]
        public virtual ApplicationUser User { get; set; }
        [JsonIgnore]
        public virtual PlantToken Token { get; set; }

        [JsonIgnore]
        public virtual PlantImage Image { get; set; }

        public override string ToString()
        {
            return $"Plant ID: {PlantID}\nuserID: {UserID}\nPlant Name: {Name}";
        }

    }
}
