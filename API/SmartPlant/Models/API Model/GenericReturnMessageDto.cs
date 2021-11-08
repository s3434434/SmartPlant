using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.API_Model
{
    public class GenericReturnMessageDto
    {
        public Dictionary<string, List<string>> Messages { get; set; }

        public GenericReturnMessageDto()
        {
            Messages = new Dictionary<string, List<string>>();   
        }
    }
}
