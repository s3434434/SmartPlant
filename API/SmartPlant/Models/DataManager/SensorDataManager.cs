using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using SmartPlant.Models.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class SensorDataManager : ISensorDataManager
    {
        private readonly DatabaseContext _context;

        public SensorDataManager(DatabaseContext context)
        {
            _context = context;
        }

        //returns all sensor data, is this needed?
        public async Task<IEnumerable<SensorData>> GetAll(string userID)
        {
            //if plant does not exist
            var usersPlants = await _context.Plants.Where(p => p.UserID == userID).ToListAsync();
            if (!(usersPlants.Count > 0))
            {
                return null;
            }

            Console.WriteLine($"plants = {usersPlants.Count}");            

            var data = new List<SensorData>();
            //add all sensor data of the plants that belong to the user.
            foreach (Plant p in usersPlants)
            {
                Console.WriteLine($"PlantID: {p.PlantID}");

                data.AddRange(
                    await _context.SensorData.Where(s => s.PlantID == p.PlantID).ToListAsync()
                    );
            }

            Console.WriteLine($"Data count: {data.Count}");

            if (!(data.Count > 0))
            {
                return null;
            }
            //var data = await _context.SensorData.ToListAsync();

            return data;
        }

        //returns sensor data for a specific plant
        public async Task<IEnumerable<SensorData>> GetAllForAPlant(string userID, string plantID)
        {
            //if a plant exists with the userid and plantid combination
            if (!await DoesPlantUserComboExist(userID, plantID))
            {
                return null;
            }

            var data = await _context.SensorData.Where(s => s.PlantID == plantID).ToListAsync();

            return data;
        }

        public async Task<IEnumerable<SensorData>> GetDaily(string userID, string plantID)
        {

            //if a plant exists with the userid and plantid combination.
            if (!await DoesPlantUserComboExist(userID, plantID))
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

        public async Task<IEnumerable<SensorData>> GetMonthly(string userID, string plantID)
        {
            //if a plant exists with the userid and plantid combination.
            if (!await DoesPlantUserComboExist(userID, plantID))
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


        public async Task<string> Add(string userID, SensorData data)
        {
            //check if the plant id exists

            //if a plant exists with the userid and plantid combination.
            if (!await DoesPlantUserComboExist(userID, data.PlantID))
            {
                return null;
            }

            //If the last update for the specific plant was less than 5 minutes ago, don't update.
            //stops database being spammed ? , but not webserver
            /* var last = await _context.SensorData.OrderBy(p => p.TimeStampUTC).LastOrDefaultAsync(p => p.PlantID == data.PlantID);
             var timeCheck = last.TimeStampUTC.AddMinutes(5);

             Console.WriteLine($"timeCHeck: {timeCheck}\nTIme Now: {DateTime.UtcNow}");
             if (timeCheck > DateTime.UtcNow)
             {
                 return "";
             }
            */
            _context.Add(data);
            await _context.SaveChangesAsync();

            //var msg = "";
            return "added";
        }

        /*
         * 
         *         ADMIN ROLE 
         * 
         */

        public async Task<IEnumerable<SensorData>> AdminGetAll()
        {
            var data = await _context.SensorData.ToListAsync();

            return data;
        }

        //returns sensor data for a specific plant
        public async Task<IEnumerable<SensorData>> AdminGetAllForAPlant(string plantID)
        {           
            //if plant doesn't exist return error 
            if (!await DoesPlantExist(plantID))
            {
                return null;
            }

            var data = await _context.SensorData.Where(s => s.PlantID == plantID).ToListAsync();

            return data;
        }

        public async Task<IEnumerable<SensorData>> AdminGetDaily(string plantID)
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

        public async Task<IEnumerable<SensorData>> AdminGetMonthly(string plantID)
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


        //for testing
        public async Task<string> AdminAdd(SensorData data)
        {
            //check if the plant id exists

            //if a plant exists with the userid and plantid combination.
            if (!await DoesPlantExist(data.PlantID))
            {
                return null;
            }
            
            _context.Add(data);
            await _context.SaveChangesAsync();

            //var msg = "";
            return "added";
        }



        //helper methods
        private async Task<bool> DoesPlantExist(string plantID)
        {
            var validPlant = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plantID);
            if (validPlant != null)
            {
                return true;
            }
            else return false;
        }

        private async Task<bool> DoesPlantUserComboExist(string userID, string plantID)
        {
            //if a plant exists with the userid and plantid combination.
            var plant = await _context.Plants.FirstOrDefaultAsync(p => p.UserID == userID && p.PlantID == plantID);

            if (plant == null)
            {
                return false;
            }
            return true;
        }

    }
}
