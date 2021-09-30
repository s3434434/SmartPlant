using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.API_Model.Plant;
using SmartPlant.Models.Repository;
using System;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : Controller
    {
        private readonly IPlantManager _repo;
        private readonly UserManager<ApplicationUser> _userManager;

        public PlantController(IPlantManager repo, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _userManager = userManager;
        }

        /*            (user)
         *   ANY ROLE REQUIRED ENDPOINTS
         *             BELOW
         */


        /// <summary>
        /// Gets all plants belonging to the current user
        /// </summary>
        /// <remarks>
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

            /*//this gets the users Role (user or admin)
            var role = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
            Console.WriteLine($"userid : {userID}\nRole : {role.ElementAt(0)}");*/

            var plants = await _repo.GetAllForUser(userID);

            if (plants == null)
            {
                return NotFound(); //404
            }

            return Ok(plants); //200
        }


        /// <summary>
        /// Adds a plant
        /// </summary>
        /// <remarks>
        /// Takes in a plant name (maxlength 250 - nullable) - this can be excluded but is intended help user readabillity  e.g. "office building 2 - floor 3 - Meeting room 2 - Peace Lily" &#xA;
        /// This should be used when the user chooses to add a plant. Autogenerates the plant ID. &#xA;
        /// The user should then copy and paste the new plant ID into an arduino setup file?
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

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            //it really shouldn't be null
            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = userID,
                Name = dto.PlantName
            };

            var plantToken = GeneratePlantToken(plant.PlantID);


            var result = await _repo.Add(plant, plantToken);

            if (result == 0)
            {
                return Conflict("Plant id exists"); //409 , 400? - this should no longer happen since we are now using GUIDs
            }
            if (result == -1)
            {
                return Conflict("Max Plant Limit Hit");
            }
            //return Created(new Uri(Request.GetEncodedUrl()+ "/" + plant.PlantID), result);

            //else result == 1
            return Created("", $"Success\n{plant}\nToken: {plantToken.Token}");
        }


        /// <summary>
        /// Updates a plants name
        /// </summary>
        /// <remarks>
        /// This takes in a plant ID and a string name --this can be excluded, making the name param null (no name)
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
                return Ok();
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

        [HttpPost]
        [Route("/api/Plants/NewToken/{plantID}")]
        public async Task<IActionResult> GenerateNewPlantToken(string plantID)
        {
            var plantToken = GeneratePlantToken(plantID);
            var result = await _repo.GenerateNewPlantToken(plantToken);

            return Ok();

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
        /// Takes in a plant name (maxlength 250 - nullable) - this can be excluded but is intended help user readabillity  e.g. "office building 2 - floor 3 - Meeting room 2 - Peace Lily"
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

            if (user == null)
            {
                return NotFound("User does not exist");
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = plantDto.UserID,
                Name = plantDto.PlantName
            };

            var plantToken = GeneratePlantToken(plant.PlantID);

            var result = await _repo.Add(plant, null);

            if (result == 0)
            {
                return Conflict("Plant id exists"); //409 , 400?
            }
            if (result == -1)
            {
                return Conflict("Max Plant Limit Hit");
            }
            //return Created(new Uri(Request.GetEncodedUrl()+ "/" + plant.PlantID), result);

            //else result == 1
            //return Created("", $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}\nPlant Name: {plant.Name}");
            return Created("", $"Success\n{plant}\nToken: {plantToken.Token}");
        }

        /// <summary>
        /// Updates a plants name
        /// </summary>
        /// <remarks>
        /// This takes in a plant ID and a string name --this can be excluded, making the name param null (no name)
        /// </remarks>
        /// <response code="200">Name changed</response>        
        /// <response code="404">Plant Not Found</response>
        [HttpPut]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminUpdate([FromBody] UpdatePlantDto dto)
        {
            //user id is not needed, since this is an admin action the userID is not relevant
            var plant = new Plant() { Name = dto.Name, PlantID = dto.PlantID };
            var result = await _repo.AdminUpdate(plant);

            if (result == 1)
            {
                return Ok();
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
                return NotFound("Plant does not exist");
            }
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
