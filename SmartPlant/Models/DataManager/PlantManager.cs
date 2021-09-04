using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class PlantManager
    {
        private readonly DatabaseContext _context;

        public PlantManager(DatabaseContext context)
        {
            _context = context;
        }

        //returns all plants (userID, plantID)
        public async Task<IEnumerable<Plant>> GetAll()
        {
            var plants = await _context.Plants.ToListAsync();

            return plants;
        }

        //returns all plants belonging to a specific user (userID, plantID)
        public async Task<IEnumerable<Plant>> GetAllForUser(string userID)
        {
            //if user doesn't exist return error?
            var userExists = await _context.Plants.FirstOrDefaultAsync(p => p.userID == userID);
            if (userExists is null)
            {
                return null; 
              
            }

            var plants = await _context.Plants.Where(p => p.userID == userID).ToListAsync();

            return plants;
        }

        //adds plant to db, returns its ID
        public async Task<string> Add(Plant plant)
        {
            var exists = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plant.PlantID);

            if (exists != null) //if the plant already exists, the plant ID is a primary and therefore unique
            {
                return null;
            }

            _context.Add(plant);
            await _context.SaveChangesAsync();

            var msg = $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.userID}";
            return msg;
            //return plant.PlantID;
        }

    }
}
