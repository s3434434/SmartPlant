using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartPlant.Models.Repository
{
    public interface IPlantManager
    {
        Task<IEnumerable<Plant>> GetAllForUser(string userID);
        Task<int> Add(Plant plant);
        Task<int> Update(Plant plant);
        Task<int> Delete(string plantID, string userID);
        Task<IEnumerable<Plant>> AdminGetAll();
        Task<int> AdminUpdate(Plant plant);
        Task<bool> AdminDelete(string plantID);

    }
}
