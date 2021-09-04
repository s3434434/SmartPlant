using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using System;
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
            //if user doesn't exist return error            
            if (!await DoesPlantExist(plantID))
            {
                return null;
            }

            var data = await _context.SensorData.Where(s => s.PlantID == plantID).ToListAsync();

            return data;
        }

        public async Task<IEnumerable<SensorData>> GetDaily(string plantID)
        {

            if (!await DoesPlantExist(plantID))
            {
                return null;
            }

            //this would the the date of the executing machines timezone, not the user 
            var currentDate = DateTime.UtcNow;

            var data = await _context.SensorData
                .Where(p => p.PlantID == plantID)
                .Where(p => p.TimeStampUTC.Year == currentDate.Year)
                .Where(p => p.TimeStampUTC.Month == currentDate.Month)
                .Where(p => p.TimeStampUTC.Day == currentDate.Day)
                .ToListAsync();

            return data;
        }

        public async Task<IEnumerable<SensorData>> GetMonthly(string plantID)
        {

            if (!await DoesPlantExist(plantID))
            {
                return null;
            }

            //this would the the date of the executing machines timezone, not the user 
            var currentDate = DateTime.UtcNow;

            var data = await _context.SensorData
                .Where(p => p.PlantID == plantID)
                .Where(p => p.TimeStampUTC.Year == currentDate.Year)
                .Where(p => p.TimeStampUTC.Month == currentDate.Month)
                .ToListAsync();

            return data;
        }

        public async Task<string> Add(SensorData data)
        {
            //check if the plant id exists
            
            if (!await DoesPlantExist(data.PlantID))
            {
                return null;
            }

            _context.Add(data);
            await _context.SaveChangesAsync();

            //var msg = "";
            return "added";
        }


        private async Task<bool> DoesPlantExist(string plantID)
        {
            var validPlant = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plantID);
            if (validPlant != null)
            {
                return true;
            }
            else return false;
        }

    }
}
