using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SmartPlant.Models.Repository
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
