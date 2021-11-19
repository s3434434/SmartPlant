using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Plant;
using SmartPlant.Models.Repository;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting.Internal;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Serialization.Json;
using SmartPlant.Models.API_Model.Admin;

namespace SmartPlant.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : Controller
    {
        private readonly IPlantManager _repo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly string clientID;

        public PlantController(IPlantManager repo, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _repo = repo;
            _userManager = userManager;
            _configuration = configuration;
            clientID = _configuration.GetSection("Imgur").GetSection("Client-ID").Value;
        }

        /*           
         *   USER ROLE REQUIRED ENDPOINTS
         *             BELOW
         */


        /// <summary>
        /// Gets all plants belonging to the current user, Returns plant Name and ID
        /// </summary>
        /// <remarks>
        /// The plant ID shouldn't be shown to the user, since it's not easy to read and they don't need to know about it&#xA;
        /// the plant ID is used with the other api endpoints.
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">No Plants Found</response>
        [HttpGet] //gets all plants for current user
        [Route("/api/Plants")]
        public async Task<IActionResult> Get()
        {
            //get the ID (which was stored in claimtyupes.Name) from the controllerbase ClaimsIdentity User
            //this should only work with a logged in user, using their own id's
            var userID = User.Identity.Name;

            var plants = await _repo.GetAllForUser(userID);

            if (plants == null)
            {
                //return NotFound(); //404
                return Ok(new List<Plant>());
            }

            return Ok(plants); //200
        }


        /// <summary>
        /// Adds a plant
        /// </summary>
        /// <remarks>
        /// Takes in a plant name (maxlength 250, any special char and numbers allowed) -  e.g. "office building 2 - floor 3 - Meeting room 2 - Peace Lily" &#xA;
        /// This should be used when the user chooses to add a plant. Autogenerates the plant ID and Plant Token. &#xA;
        /// The Plant Token is what should be put into the Arduino setup file so that it can known which plant to update data for.
        /// </remarks>
        /// <response code="201">Plant Created</response>
        /// <response code="400">Bad Data</response>
        /// <response code="409">Max plant limit hit (currently set to 5)</response>
        [HttpPost] //This should be used when the user chooses to add a plant. Autogenerates plant ID. UserID taken from JWT token 
        [Route("/api/Plants")]
        public async Task<IActionResult> Post([FromBody] AddPlantDto dto)
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);
            GenericReturnMessageDto msg;
            if (!PlantCareData.PlantCareDict.ContainsKey(dto.PlantType))
            {
                msg = new GenericReturnMessageDto
                {
                    Messages = new Dictionary<string, List<string>>
                    {
                        {"Plant Type", new List<string> {"Invalid Plant Type"}}
                    }
                };
                return BadRequest(msg);
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = userID,
                Name = dto.PlantName,
                PlantType = dto.PlantType
            };

            var plantToken = GeneratePlantToken(plant.PlantID);


            var result = await _repo.Add(plant, plantToken);

            if (result == 0)
            {
                return Conflict("Plant id exists"); //409 , 400? - this should no longer happen since we are now using GUIDs
            }
            if (result == -1)
            {
                var genericError = new GenericReturnMessageDto { Messages = new Dictionary<string, List<string>> { { "Limit", new List<String> { "Max Plant Limit Hit" } } } };
                return Conflict(genericError);
            }

            if (result == -2)
            {
                var genericError = new GenericReturnMessageDto { Messages = new Dictionary<string, List<string>> { { "Name Taken", new List<String> { "You are already using this name." } } } };
                return Conflict(genericError);
            }

            Console.WriteLine(dto.Base64ImgString != null);
            if (dto.Base64ImgString != null)
            {
                await _repo.UploadAndAddPlantImage(clientID, dto.Base64ImgString, plant.PlantID, userID);
            }


            msg = new GenericReturnMessageDto
            {
                Messages = new Dictionary<string, List<string>>
            {
                {
                    "Token",
                    new List<string>{plantToken.Token}
                }
            }};

            return Created("", msg);
        }


        /// <summary>
        /// Updates a plants name and Image. If Image string is null, it remains the same. If a new image string is passed the old one is deleted from Imgur.
        /// </summary>
        /// <remarks>
        /// This takes in a plant ID and a string name.
        /// </remarks>
        /// <response code="200">Name changed</response>        
        /// <response code="404">Plant Not Found</response>
        [HttpPut]
        [Route("/api/Plants")]
        public async Task<IActionResult> Update([FromBody] UpdatePlantDto dto)
        {
            //var userID = User.Identity.Name;
            var plant = new Plant() { Name = dto.Name, PlantID = dto.PlantID, UserID = User.Identity.Name };
            var result = await _repo.Update(plant);

            if (result == 1)
            {
                if (dto.Base64ImgString != null)
                {
                    var clientID = _configuration.GetSection("Imgur").GetSection("Client-ID").Value;
                    await _repo.UploadAndAddPlantImage(clientID, dto.Base64ImgString, dto.PlantID, User.Identity.Name);
                }

                return Ok();
            }

            if (result == -2)
            {
                var genericError = new GenericReturnMessageDto { Messages = new Dictionary<string, List<string>> { { "Name Taken", new List<String> { "You are already using this name." } } } };
                return Conflict(genericError);
            }
            return NotFound();

        }

        /// <summary>
        /// Deletes a plant that belongs to the user
        /// </summary>
        /// <remarks>Deleting a plant will cascade delete all related sensor data, this is permanent.
        /// </remarks>
        /// <response code="200">Plant Deleted</response>
        /// <response code="403">Plant Does Not Belong To User</response>
        /// <response code="404">PlantID Not Found</response>
        [HttpDelete]
        [Route("/api/Plants")]
        public async Task<IActionResult> Delete(string plantID)
        {
            var userID = User.Identity.Name;
            await _repo.DeletePlantImage(clientID, plantID, userID);
            var result = await _repo.Delete(plantID, userID);

            if (result == 1)
            {
                return Ok($"Plant Deleted ({plantID})");
            }
            if (result == 0)
            {
                return NotFound("Plant does not exist");
            }

            //else result == -1
            return Forbid("Plant does not belong to user");

        }

        /// <summary>
        /// Gets a plants plant token, for use updating sensor data from the Arduino hardware
        /// </summary>
        /// <remarks>
        /// For security purposes, this should only be shown if a user asks to see their token &#xA;
        /// since this is used to for updating sensor data it is sensitive information.
        /// </remarks>
        /// <response code="200">Returns the token</response>
        /// <response code="404">PlantID Not Found</response>
        [HttpGet]
        [Route("/api/Plants/Token/{plantID}")]
        public async Task<IActionResult> GetToken(string plantID)
        {
            var userID = User.Identity.Name;

            var result = await _repo.GetToken(plantID, userID);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        /// <summary>
        /// Generates a new token for a plant
        /// </summary>
        /// <remarks>
        /// This will invalidate the old token, &#xA;
        /// On the frontend, a warning message should be displayed &#xA;
        /// warning the user and confirming that they want to generate a new token.
        /// </remarks>
        /// <response code="200">New token generated, returns new token</response>
        /// <response code="404">Something went wrong, probably invalid plantid</response>
        [HttpPut]
        [Route("/api/Plants/Token/{plantID}")]
        public async Task<IActionResult> GenerateNewPlantToken(string plantID)
        {
            var userID = User.Identity.Name;
            var plantToken = GeneratePlantToken(plantID);
            var result = await _repo.GenerateNewPlantToken(userID, plantToken);

            if (!result)
            {
                return BadRequest("Something went wrong, invalid inputs...");
            }
            return Ok(plantToken.Token);

        }

        /// <summary>
        /// Gets the preset list of plant types
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        [HttpGet]
        [Route("/api/Plants/List")]
        public IActionResult GetPresetPlantList()
        {
            return Ok(PlantCareData.PlantCareDict.Keys);
        }


        /// <summary>
        /// Used to delete a plant image
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        [HttpDelete]
        [Route("/api/Plants/Image")]
        public async Task<IActionResult> DeletePlantImage(string plantID)
        {
            var userID = User.Identity.Name;

            var result = await _repo.DeletePlantImage(clientID, plantID, userID);
            return Ok(result);
        }


        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        /// <summary>
        /// Gets a list of all plants (plantID, userID)
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">No Plants Found</response>
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminGetAll()
        {
            var plants = await _repo.AdminGetAll();

            if (plants == null)
            {
                return NotFound(); //404
            }
            return Ok(plants); //200
        }


        /// <summary>
        /// Gets plants for a specific user
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">No Plants Found</response>
        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants/User/{id}")] //gets plants for a specific user
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> AdminGet(string id)
        {
            var plants = await _repo.GetAllForUser(id);

            if (plants == null)
            {
                return NotFound(); //404
            }

            return Ok(plants); //200
        }


        /// <summary>
        /// Adds a plant for a specific user
        /// </summary>
        /// <remarks>
        /// Takes in a plant name (maxlength 250) e.g. "office building 2 - floor 3 - Meeting room 2 - Peace Lily"
        /// and user ID
        /// </remarks>
        /// <response code="201">Plant Created</response>
        /// <response code="404">UserID Not Found</response>
        /// <response code="409">Max Plant Limit Hit</response>
        [HttpPost] //verifies user exists, then verifies plant id doesn't already exists, adds plant
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminPost([FromBody] AdminAddPlantDto plantDto)
        {
            var user = await _userManager.FindByIdAsync(plantDto.UserID);

            var genericError = new GenericReturnMessageDto();

            if (user == null)
            {
                genericError.Messages.Add("User", new List<string> { "User does not exist" });
                return NotFound(genericError);
            }

            if (!PlantCareData.PlantCareDict.ContainsKey(plantDto.PlantType))
            {
                var msg = new GenericReturnMessageDto
                {
                    Messages = new Dictionary<string, List<string>>
                    {
                        {"Plant Type", new List<string> {"Invalid Plant Type"}}
                    }
                };
                return BadRequest(msg);
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = plantDto.UserID,
                Name = plantDto.PlantName,
                PlantType = plantDto.PlantType
            };

            var plantToken = GeneratePlantToken(plant.PlantID);

            var result = await _repo.Add(plant, plantToken);

            if (result == 0)
            {
                genericError.Messages.Add("Plant", new List<string> { "Plant ID already exists" });
                return Conflict(genericError); //409 , 400?
            }
            if (result == -1)
            {
                genericError.Messages.Add("Limit", new List<string> { "Max plant limit reached" });
                return Conflict(genericError);
            }
            if (result == -2)
            {
                genericError = new GenericReturnMessageDto { Messages = new Dictionary<string, List<string>> { { "Name Taken", new List<String> { "You are already using this name." } } } };
                return Conflict(genericError);
            }
            
            return Created("", $"Success\n{plant}\nToken: {plantToken.Token}");
        }

        /// <summary>
        /// Updates a plants name
        /// </summary>
        /// <remarks>
        /// This takes in a plant ID and a string name
        /// </remarks>
        /// <response code="200">Name changed</response>        
        /// <response code="404">Plant Not Found</response>
        [HttpPut]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminUpdate([FromBody] AdminUpdatePlantDto dto)
        {
            //user id is not needed, since this is an admin action the userID is not relevant
            var plant = new Plant() { Name = dto.Name, PlantID = dto.PlantID };
            var result = await _repo.AdminUpdate(plant);

            if (result == 1)
            {
                return Ok();
            }

            if (result == -2)
            {
                var genericError = new GenericReturnMessageDto { Messages = new Dictionary<string, List<string>> { { "Name Taken", new List<String> { "You are already using this name." } } } };
                return Conflict(genericError);
            }
            return NotFound();

        }

        /// <summary>
        /// Deletes a plant
        /// </summary>
        /// <remarks>Deleting a plant will delete all related sensor data
        /// </remarks>
        /// <response code="200">Plant Deleted</response>
        /// <response code="404">Plant Not Found</response>
        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminDelete(string plantID)
        {
            var result = await _repo.AdminDelete(plantID);

            if (result)
            {
                return Ok($"Plant Deleted ({plantID})");
            }
            else
            {
                var genericError = new GenericReturnMessageDto();
                genericError.Messages.Add("Plant", new List<string> { "Plant does not exist" });
                return NotFound(genericError);
            }
        }

        ///<summary>
        /// Generates a new token for a plant
        /// </summary>
        /// <remarks>
        /// This will invalidate the old token, &#xA;
        /// On the frontend, a warning message should be displayed &#xA;
        /// warning the user and confirming that they want to generate a new token.
        /// </remarks>
        /// <response code="200">New token generated, returns new token</response>
        /// <response code="404">Something went wrong, probably invalid plantID or userID</response>
        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants/NewToken/{userID}/{plantID}")]
        public async Task<IActionResult> AdminGenerateNewPlantToken(string userID, string plantID)
        {
            var plantToken = GeneratePlantToken(plantID);
            var result = await _repo.AdminGenerateNewPlantToken(userID, plantToken);

            if (!result)
            {
                var genericError = new GenericReturnMessageDto();
                genericError.Messages.Add("Invalid", new List<string> { "Something went wrong, invalid inputs..." });
                return BadRequest(genericError);
            }
            return Ok(plantToken.Token);

        }

        /// <summary>
        /// Used to delete a plant image\
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        [HttpDelete]
        [Route("/api/Admin/Plants/Image")]
        public async Task<IActionResult> AdminDeletePlantImage(string userID, string plantID)
        {
            var result = await _repo.DeletePlantImage(clientID, plantID, userID);
            return Ok(result);
        }



        //helper methods
        private PlantToken GeneratePlantToken(string plantID)
        {
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            var plantToken = new PlantToken
            {
                PlantID = plantID,
                Token = token
            };
            return plantToken;
        }
    }
}
