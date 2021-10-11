using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartPlant.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(50), RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters. 50 Characters max.")]
        public string FirstName { get; set; }

        [MaxLength(50), RegularExpression(@"^[a-z]{0,50}$", ErrorMessage = "Name can only contain letters. 50 Characters max.")]
        public string LastName { get; set; }

        [MaxLength(10), MinLength(10), RegularExpression(@"^0[23478]\d{8}$", ErrorMessage = "Must begin with a valid area code and be 10 digits: 02, 03, 04, 07, 08 ")]
        public override string PhoneNumber { get; set; }

        [JsonIgnore]
        public virtual IEnumerable<Plant> Plants { get; set; }
    }
}
