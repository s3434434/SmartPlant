using System.Collections.Generic;
using System.Threading.Tasks;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.API_Model.Plant;

namespace SmartPlant.Models.Repository
{
    public interface IPlantManager
    {
        Task<IEnumerable<UserGetPlantDto>> GetAllForUser(string userID);
        Task<int> Add(Plant plant, PlantToken plantToken);
        Task<int> Update(Plant plant);
        Task<int> Delete(string plantID, string userID);
        Task<string> GetToken(string plantID, string userID);
        Task<bool> GenerateNewPlantToken(string userID, PlantToken plantToken);
        Task<bool> UploadAndAddPlantImage(string clientID, string img, string plantID, string userID);
        Task<bool> DeletePlantImage(string clientID, string plantID, string userID);
        Task<IEnumerable<AdminGetPlantDto>> AdminGetAll();
        Task<int> AdminUpdate(Plant plant);
        Task<bool> AdminDelete(string plantID);
        Task<bool> AdminGenerateNewPlantToken(string userID, PlantToken plantToken);

    }
}
