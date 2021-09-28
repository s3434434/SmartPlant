﻿using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SmartPlant.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(250)]
        public string FirstName { get; set; }
        [MaxLength(250)]
        public string LastName { get; set; }
        [MaxLength(250)]
        public string Address { get; set; }

        [JsonIgnore]
        public virtual IEnumerable<Plant> Plants { get; set; }
    }
}
