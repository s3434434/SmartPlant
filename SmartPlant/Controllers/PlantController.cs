using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.DataManager;
using SmartPlant.Models.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : Controller
    {
        private readonly IPlantManager _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public PlantController(IPlantManager repo, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        /*            (user)
         *   ANY ROLE REQUIRED ENDPOINTS
         *             BELOW
         */

        [HttpGet] //gets all plants for current user
        [Route("/api/Plants")]
        public async Task<IActionResult> Get()
        {
            //get the ID (which was stored in claimtyupes.Name)
            //from the controllerbase ClaimsIdentity User
            //should be able to remove the id input from the method param,
            //and then this should only work with a logged in user, using their own id's
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

        [HttpPost] //This should be used when the user chooses to add a plant. Autogenerates plant ID. UserID taken from JWT token 
        [Route("/api/Plants")]
        public async Task<IActionResult> Post()
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            //it really shouldn't be null
            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = userID
            };

            var result = await _repo.Add(plant);

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
            return Created("", $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}");
        }

        [HttpDelete]
        [Route("/api/Plants")]
        public async Task<IActionResult> Delete()
        {
            return null;
        }


        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


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

        [HttpPost] //verifies user exists, then verifies plant id doesn't already exists, adds plant
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminPost(string userID)
        {
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return NotFound("User does not exist");
            }

            var plant = new Plant
            {
                PlantID = Guid.NewGuid().ToString(),
                UserID = userID
            };

            var result = await _repo.Add(plant);

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
            return Created("", $"Success\nPlant ID: {plant.PlantID}\nuserID: {plant.UserID}");
        }
    }
}
