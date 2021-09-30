using System.Collections.Generic;
using System.Threading.Tasks;
using SmartPlant.Models.API_Model.SensorData;

namespace SmartPlant.Models.Repository
{
    public interface ISensorDataManager
    {
        Task<IEnumerable<SensorData>> GetAll(string userID);
        Task<IEnumerable<SensorData>> GetAllForAPlant(string userID, string plantID);
        Task<IEnumerable<SensorData>> GetDaily(string userID, string plantID);
        Task<IEnumerable<SensorData>> GetMonthly(string userID, string plantID);
        Task<string> Add(string userID, SensorData data);
        Task<bool> AddWithToken(SensorDataWithTokenDto dto);
        Task<IEnumerable<SensorData>> AdminGetAll();
        Task<IEnumerable<SensorData>> AdminGetAllForAPlant(string plantID);
        Task<IEnumerable<SensorData>> AdminGetDaily(string plantID);
        Task<IEnumerable<SensorData>> AdminGetMonthly(string plantID);
        Task<string> AdminAdd(SensorData data);

    }
}
