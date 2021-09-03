using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class SensorDataManager
    {
        private readonly DatabaseContext _context;

        public SensorDataManager(DatabaseContext context)
        {
            _context = context;
        }

        //returns all sensor data, is this needed?
        public async Task<IEnumerable<SensorData>> GetAll()
        {
            var data = await _context.SensorData.ToListAsync();

            return data;
        }

        //returns sensor data for a specific plant
        public async Task<IEnumerable<Plant>> GetAllForUser(string plantID)
        {
            //if user doesn't exist return error?
            var plantDataExists = _context.SensorData.FirstOrDefault(s => s.PlantID == plantID);
            if (plantDataExists is null)
            {
                return null;
            }

            var data = await _context.Plants.Where(s => s.PlantID == plantID).ToListAsync();

            return data;
        }

    }
}
