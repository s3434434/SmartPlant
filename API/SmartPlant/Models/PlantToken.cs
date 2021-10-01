using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartPlant.Models
{
    public class PlantToken
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Key]
        public string PlantID { get; set; }
        [Required, MaxLength(50)]
        public string Token { get; set; }

        [JsonIgnore]
        public virtual Plant Plant { get; set; }
    }
}
