﻿using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using SmartPlant.Models.Repository;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Models.DataManager
{
    public class PlantManager : IPlantManager
    {
        private readonly DatabaseContext _context;

        //Sets the maximum plants allower per user.
        private readonly int maxPlantsAllowed = 5;
               

        public PlantManager(DatabaseContext context)
        {
            _context = context;
        }

        //user by both admins and normal users
        //returns all plants belonging to a specific user (userID, plantID)
        public async Task<IEnumerable<Plant>> GetAllForUser(string userID)
        {
            //if user doesn't exist return error?
            var userExists = await _context.Plants.FirstOrDefaultAsync(p => p.UserID == userID);
            if (userExists is null)
            {
                return null; 
              
            }            

            var plants = await _context.Plants.Where(p => p.UserID == userID).ToListAsync();


            return plants;
        }

        //user by both admins and normal users
        //adds plant to db, returns its ID
        public async Task<int> Add(Plant plant)
        {
            var exists = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plant.PlantID);

            if (exists != null) //if the plant already exists, the plant ID is a primary and therefore unique
            {
                return 0;
            }

            var totalCount = await _context.Plants.Where(p => p.UserID == plant.UserID).ToListAsync();

            if (totalCount.Count >= maxPlantsAllowed)
            {
                return -1;
            }
            _context.Add(plant);
            await _context.SaveChangesAsync();

            var msg = $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}";
            return 1;
            //return plant.PlantID;
        }



        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */

        //returns all plants (userID, plantID)
        public async Task<IEnumerable<Plant>> AdminGetAll()
        {
            var plants = await _context.Plants.ToListAsync();

            return plants;
        }

    }
}
