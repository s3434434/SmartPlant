using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Models;
using SmartPlant.Models.DataManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : ControllerBase
    {
        private readonly PlantManager _repo;
        private readonly UserManager<ApplicationUser> _userManager;

        public PlantController(PlantManager repo, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _userManager = userManager;
        }

        [HttpGet]
        [Route("/api/plants")]
        public async Task<IActionResult> GetAll(){

            var plants = await _repo.GetAll();

            if (plants == null)
            {
                return NotFound(); //404
            }

            return Ok(plants); //200

            }

        [HttpGet] //gets all plants (plantid, userid) for the user
        [Route("/api/User/{id}/Plants")]
        //[Route("/{userID}/Plants")]?
        //[Route("/{userID}")]?
        public async Task<IActionResult> Get(string id)
        {
            var plants = await _repo.GetAllForUser(id);

            if (plants == null)
            {
                return NotFound(); //404
            }

            return Ok(plants); //200
        }
            
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Plant plant)
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
