using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> GetAll(){

            var plants = await _repo.GetAll();

            if (plants == null)
            {
                return NotFound();
            }

            return Ok(plants);

            }
        //FILL OUT API CONTROLLERS BASED ON DATA MANAGER REPOS
        //MERGE BRANCH TO MASTER
        //ADD MIGRATION AND BUILD DATABASE
        //TEST API WITH SWAGGER
        //TRY IDENTITY CRAP FROM GUIDE
    }
}
