using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.Repository
{
    public interface IPlantManager
    {
        Task<IEnumerable<Plant>> GetAllForUser(string userID);
        Task<int> Add(Plant plant);
        Task<IEnumerable<Plant>> AdminGetAll();

    }
}
