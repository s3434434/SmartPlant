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
    //[Route("api/Plant/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly SensorDataManager _repo;

        public SensorDataController(SensorDataManager repo)
        {
            _repo = repo;
        }

        [HttpGet]
        [Route("All")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _repo.GetAll();

            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("{plantID}")]
        public async Task<IActionResult> GetAllForPlant(string plantID)
        {
            var data = await _repo.GetAllForPlant(plantID);
            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("{plantID}/Daily")]
        public async Task<IActionResult> GetDaily(string plantID)
        {
            var data = await _repo.GetDaily(plantID);
            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("{plantID}/Monthly")]
        public async Task<IActionResult> GetMonthly(string plantID)
        {
            var data = await _repo.GetMonthly(plantID);
            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SensorData data)
        {
            var result = await _repo.Add(data);

            if (result == null)
            {
                return BadRequest("Plant ID does not exist");
            }

            return Created("", result);
        }


    }
}
