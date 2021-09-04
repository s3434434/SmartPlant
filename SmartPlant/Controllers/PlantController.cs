using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
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

        public PlantController(PlantManager repo)
        {
            _repo = repo;
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
        [Route("/User/{id}/Plants")]
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
