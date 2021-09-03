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

        //returns all plants (ownerID, plantID)
        public async Task<IEnumerable<Plant>> GetAll()
        {
            var plants = await _context.Plants.ToListAsync();

            return plants;
        }

        //returns all plants belonging to a specific user (ownerID, plantID)
        public async Task<IEnumerable<Plant>> GetAllForUser(string ownerID)
        {
            //if user doesn't exist return error?
            var userExists = _context.Plants.FirstOrDefault(p => p.OwnerID == ownerID);
            if (userExists is null)
            {
                return null; 
              
            }

            var plants = await _context.Plants.Where(p => p.OwnerID == ownerID).ToListAsync();

            return plants;
        }

    }
}
