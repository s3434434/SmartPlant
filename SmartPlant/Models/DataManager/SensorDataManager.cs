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
        public async Task<IEnumerable<SensorData>> GetAllForPlant(string plantID)
        {
            //if user doesn't exist return error?
            var plantDataExists = await _context.SensorData.FirstOrDefaultAsync(s => s.PlantID == plantID);
            if (plantDataExists is null)
            {
                return null;
            }

            var data = await _context.SensorData.Where(s => s.PlantID == plantID).ToListAsync();

            return data;
        }

        public async Task<string> Add(SensorData data)
        {
            //check if the plant id exists
            var validPlant = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == data.PlantID);

            if (validPlant == null)
            {
                return null;
            }


            _context.Add(data);
            await _context.SaveChangesAsync();

            //var msg = "";
            return "added";
        }

    }
}
