using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
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
        [Route("{plantID}/Daily")] //shows a plants sensor data based on current date
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
        [Route("{plantID}/Monthly")] //shows sensor data based on current month
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
        public async Task<IActionResult> Post([FromBody] SensorDataModel dataModel)
        {
            var data = new SensorData
            {
                PlantID = dataModel.PlantID,
                Temp = dataModel.Temp,
                Humidity = dataModel.Humidity,
                LightIntensity = dataModel.LightIntensity,
                Moisture = dataModel.Moisture,
                TimeStampUTC = DateTime.UtcNow
            };

            var result = await _repo.Add(data);

            if (result == null)
            {
                return BadRequest("Plant ID does not exist");
            }

            return Created("", result);
        }

        [HttpPost] //this is just for testing with custom dates
        [Route("test")]
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
