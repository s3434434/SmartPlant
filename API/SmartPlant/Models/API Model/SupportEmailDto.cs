using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class SupportEmailDto
    {
        [Required, MaxLength(50)] 
        public string EmailSubject { get; set; }

        [Required, MaxLength(500)]
        public string EmailBody { get; set; }
    }
}
