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
        private readonly PlantManager _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public PlantController(PlantManager repo, IMapper mapper ,UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        

        [HttpGet] //gets all plants (plantid, userid) for the user
        [Route("/api/User/{id}/Plants")]
        //[Route("/{userID}/Plants")]?
        //[Route("/{userID}")]?
        public async Task<IActionResult> Get(string id)
        {

            //get the ID (which was stored in claimtyupes.Name)
            //from the controllerbase ClaimsIdentity User
            //should be able to remove the id input from the method param,
            //and then this should only work with a logged in user, using their own id's
            //admin can this old method, separate into an admin controller.
            var userID = User.Identity.Name;
            
            /*//this gets the users Role (user or admin)
            var role = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);
            Console.WriteLine($"userid : {userID}\nRole : {role.ElementAt(0)}");*/

            var plants = await _repo.GetAllForUser(id);

            if (plants == null)
            {
                return NotFound(); //404
            }

            return Ok(plants); //200
        }
                    
        [HttpPost] //verifies user exists, then verifies plant id doesn't already exists, adds plant        
        public async Task<IActionResult> Post([FromBody] AddPlantDto plantDto)
        {
            var plant = _mapper.Map<Plant>(plantDto);
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            //it really shouldn't be null
            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            plant.UserID = userID;

            var result = await _repo.Add(plant);

            if (result == null)
            {
                return Conflict("Plant id exists"); //409 , 400?
            }

            //return Created(new Uri(Request.GetEncodedUrl()+ "/" + plant.PlantID), result);
            return Created("", result);
        }



        /* 
         * ADMIN REQUIRED ENDPOINTS
         *        BELOW
         */

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/Plants")]
        public async Task<IActionResult> AdminGetAll()
        {
            var plants = await _repo.GetAll();

            if (plants == null)
            {
                return NotFound(); //404
            }
            return Ok(plants); //200
        }

        [HttpGet] 
        [Route("/api/Admin/User/{id}/Plants")]
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
        [Route("/api/Admin/Plant")]
        public async Task<IActionResult> AdminPost([FromBody] Plant plant)
        {
            var user = await _userManager.FindByIdAsync(plant.UserID);

            if (user == null)
            {
                return BadRequest("User does not exist");
            }

            var id = plant.PlantID;
            var result = await _repo.Add(plant);

            if (result == null)
            {
                return Conflict(); //409 , 400?
            }

            //return Created(new Uri(Request.GetEncodedUrl()+ "/" + plant.PlantID), result);
            return Created("", result);
        }


    }
}
