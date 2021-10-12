using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class GenericErrorDto
    {
        public Dictionary<string, List<string>> errors { get; set; }

        public GenericErrorDto()
        {
            this.errors = new Dictionary<string, List<string>>();   
        }
    }
}
