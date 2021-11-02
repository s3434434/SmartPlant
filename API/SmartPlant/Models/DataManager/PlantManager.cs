using System;
using Microsoft.EntityFrameworkCore;
using SmartPlant.Data;
using SmartPlant.Models.Repository;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Newtonsoft.Json;
using RestSharp;
using SmartPlant.Models.API_Model.Admin;
using SmartPlant.Models.API_Model.Plant;

namespace SmartPlant.Models.DataManager
{
    public class PlantManager : IPlantManager
    {
        private readonly DatabaseContext _context;

        //Sets the maximum plants allowed per user.
        private readonly int maxPlantsAllowed = 5;


        public PlantManager(DatabaseContext context)
        {
            _context = context;
        }

        //used by both admins and normal users
        //returns all plants belonging to a specific user (userID, plantID)
        public async Task<IEnumerable<UserGetPlantDto>> GetAllForUser(string userID)
        {
            //if user doesn't exist return error?
            var userExists = await _context.Plants.FirstOrDefaultAsync(p => p.UserID == userID);
            if (userExists is null)
            {
                return null;

            }

            var plants = await _context.Plants.Where(p => p.UserID == userID).ToListAsync();

            var userPlants = new List<UserGetPlantDto>();
            plants.ForEach(p => userPlants.Add(new UserGetPlantDto
            {
                PlantID = p.PlantID,
                Name = p.Name,
                PlantType = p.PlantType,
                ImgurURL = (_context.PlantImages.FirstOrDefault(p1 => p1.PlantID == p.PlantID))?.ImageURL
            }));

            return userPlants;
        }

        //used by both admins and normal users
        //adds plant to db, returns its ID
        public async Task<int> Add(Plant plant, PlantToken plantToken)
        {
            var exists = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plant.PlantID);

            if (exists != null) //if the plant already exists, the plant ID is a primary and therefore unique
            {
                return 0;
            }

            if (IsPlantNameTaken(plant))
            {
                return -2;
            }

            var totalCount = await _context.Plants.Where(p => p.UserID == plant.UserID).ToListAsync();

            if (totalCount.Count >= maxPlantsAllowed)
            {
                return -1;
            }

            _context.Add(plant);
            _context.Add(plantToken);
            await _context.SaveChangesAsync();

            var msg = $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}";
            return 1;
            //return plant.PlantID;
        }

        public async Task<int> Update(Plant plant)
        {
            var plantToUpdate = await _context.Plants.Where(p => p.UserID == plant.UserID && p.PlantID == plant.PlantID).FirstOrDefaultAsync();
            if (plantToUpdate == null)
            {
                return -1;
            }
            if (IsPlantNameTaken(plant))
            {
                return -2;
            }
            plantToUpdate.Name = plant.Name;

            _context.Plants.Update(plantToUpdate);

            return await _context.SaveChangesAsync();
        }

        public async Task<int> Delete(string plantID, string userID)
        {
            var plant = await _context.Plants.FindAsync(plantID);

            if (plant == null)
            {
                return 0;
            }

            if (plant.UserID == userID)
            {

                _context.Plants.Remove(plant);

                var t = await _context.SaveChangesAsync();
                System.Console.WriteLine(t);

                return 1;
            }

            //else plant does not belong to the user
            return -1;
        }

        public async Task<string> GetToken(string plantID, string userID)
        {
            var plant = await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plantID &&
                                                     p.UserID == userID);
            if (plant == null)
            {
                return null;
            }

            return (await _context.PlantTokens.FirstOrDefaultAsync(p => p.PlantID == plantID))?.Token;
        }

        public async Task<bool> GenerateNewPlantToken(string userID, PlantToken plantToken)
        {
            //if plant id and user id exist/match, else it will be null
            if (_context.Plants.FirstOrDefault(p => p.PlantID == plantToken.PlantID
                                                    && p.UserID == userID) == null)
            {
                return false;
            }

            _context.PlantTokens.Update(plantToken);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return false;
            }

            return true;


        }

        public async Task<bool> UploadAndAddPlantImage(string clientID, string img, string plantID, string userID)
        {

            Console.WriteLine("in upload");
            //check if plant + userid combo exists.
            if (_context.Plants.FirstOrDefaultAsync(p => p.PlantID == plantID && p.UserID == userID) == null)
            {
                Trace.WriteLine("plant doesn't exist");
                Console.WriteLine("plant doesn't exist");
                return false;
            }

            var client = new RestClient("https://api.imgur.com/3/image");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", $"Client-ID {clientID}");
            request.AlwaysMultipartFormData = true;
            request.AddParameter("image", img);
            IRestResponse response = client.Execute(request);

            Console.WriteLine($"Content: {response.Content}");
            if (!response.IsSuccessful)
            {
                return false;
            }

            /*var imageLink = response.Content
            var plantImage = new PlantImage{}*/
            var data = JsonConvert.DeserializeObject<ImgurApiSuccessResponse>(response.Content);
            var url = data?.Data.link;
            var deleteHash = data?.Data.deletehash;

            var newPlantImage = new PlantImage { PlantID = plantID, ImageURL = url, DeleteHash = deleteHash };

            Console.WriteLine(data?.Data.link);
            Trace.WriteLine(data?.Data.link);
            Console.WriteLine(data?.Data.deletehash);
            Trace.WriteLine(data?.Data.deletehash);

            var existingPlantImage = await _context.PlantImages.FirstOrDefaultAsync(p => p.PlantID == plantID);

            if (existingPlantImage != null)
            {
                Console.WriteLine("deleting existing image first");
                //delete old image from imgur using the delete hash.
                var result = await DeletePlantImage(clientID, plantID, userID);
                _context.PlantImages.Add(newPlantImage);
            }
            else
            {
                _context.PlantImages.Add(newPlantImage);
            }

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeletePlantImage(string clientID, string plantID, string userID)
        {
            //check if plant + userid combo exists.
            if (await _context.Plants.FirstOrDefaultAsync(p => p.PlantID == plantID && p.UserID == userID) == null)
            {
                return false;
            }

            var plantImage = await _context.PlantImages.FirstOrDefaultAsync(p => p.PlantID == plantID);

            if (plantImage != null)
            {
                var client = new RestClient($"https://api.imgur.com/3/image/{plantImage.DeleteHash}");
                client.Timeout = -1;
                var request = new RestRequest(Method.DELETE);
                request.AddHeader("Authorization", $"Client-ID {clientID}");
                request.AlwaysMultipartFormData = true;
                IRestResponse response = client.Execute(request);
                Console.WriteLine(response.Content);
                Trace.WriteLine(response.Content);

                _context.PlantImages.Remove(plantImage);
                await _context.SaveChangesAsync();
                return response.IsSuccessful;
            }

            return false;
        }

        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */

        //returns all plants (userID, plantID)
        public async Task<IEnumerable<AdminGetPlantDto>> AdminGetAll()
        {
            var plants = await _context.Plants.ToListAsync();

            var adminGetDto = new List<AdminGetPlantDto>();
            foreach (var p in plants)
            {
                adminGetDto.Add(new AdminGetPlantDto
                {
                    PlantID = p.PlantID,
                    UserID = p.UserID,
                    Name = p.Name,
                    PlantType = p.PlantType,
                    ImgurURL = (_context.PlantImages.FirstOrDefault(p1 => p1.PlantID == p.PlantID))?.ImageURL
                });
            }

            return adminGetDto;
        }

        public async Task<int> AdminUpdate(Plant plant)
        {
            var plantToUpdate = await _context.Plants.Where(p => p.PlantID == plant.PlantID).FirstOrDefaultAsync();
            if (plantToUpdate == null)
            {
                return -1;
            }

            if (IsPlantNameTaken(plant))
            {
                return -2;
            }

            plantToUpdate.Name = plant.Name;

            _context.Plants.Update(plantToUpdate);

            return await _context.SaveChangesAsync();
        }

        public async Task<bool> AdminDelete(string plantID)
        {
            var plant = await _context.Plants.FindAsync(plantID);

            if (plant == null)
            {
                return false;
            }

            _context.Remove(plant);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AdminGenerateNewPlantToken(string userID, PlantToken plantToken)
        {
            //if plant id and user id exist/match, else it will be null
            if (_context.Plants.FirstOrDefault(p => p.PlantID == plantToken.PlantID
                                                    && p.UserID == userID) == null)
            {
                return false;
            }

            _context.PlantTokens.Update(plantToken);
            var result = await _context.SaveChangesAsync();

            if (result == 0)
            {
                return false;
            }

            return true;
        }

        //helpers

        private bool IsPlantNameTaken(Plant plant)
        {
            return _context.Plants.FirstOrDefault(p => p.UserID == plant.UserID && p.Name == plant.Name && p.PlantID != plant.PlantID) != null;
        }

    }
}
