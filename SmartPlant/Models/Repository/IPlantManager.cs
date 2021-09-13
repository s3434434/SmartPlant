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
        Task<int> Delete(string plantID, string userID);
        Task<IEnumerable<Plant>> AdminGetAll();
        Task<bool> AdminDelete(string plantID);

    }
}
