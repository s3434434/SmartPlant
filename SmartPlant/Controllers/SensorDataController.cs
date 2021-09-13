using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : Controller
    {
        private readonly ISensorDataManager _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public SensorDataController(ISensorDataManager repo, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        /*            (user)
         *   ANY ROLE REQUIRED ENDPOINTS
         *             BELOW
         */


        [HttpGet]
        [Route("/api/SensorData/")]
        public async Task<IActionResult> GetAll()
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = await _repo.GetAll(userID);

            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("/api/SensorData/{plantID}")]
        public async Task<IActionResult> GetAllForPlant(string plantID)
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = await _repo.GetAllForAPlant(userID, plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("/api/SensorData/Daily/{plantID}")] //shows a plants sensor data based on current date
        public async Task<IActionResult> GetDaily(string plantID)
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = await _repo.GetDaily(userID, plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Route("/api/SensorData/Monthly/{plantID}")] //shows sensor data based on current month
        public async Task<IActionResult> GetMonthly(string plantID)
        {
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = await _repo.GetMonthly(userID, plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpPost]
        [Route("/api/SensorData")]
        public async Task<IActionResult> Post([FromBody] SensorDataModel dataModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            //use automapper to map from DTO to Model, then add current time UTC .
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = _mapper.Map<SensorData>(dataModel);
            data.TimeStampUTC = DateTime.UtcNow;

            var result = await _repo.Add(userID, data);

            if (result == null)
            {
                return NotFound("Plant ID does not exist");
            }
            if (result == "")
            {
                return StatusCode(429, "Please wait 5 minutes between updates");
            }

            return Created("", result);
        }

        /* [HttpPost] //this is just for testing with custom dates
         [Route("test")]
         public async Task<IActionResult> Post([FromBody] SensorData data)
         {

             var result = await _repo.Add(data);

             if (result == null)
             {
                 return BadRequest("Plant ID does not exist");
             }

             return Created("", result);
         }*/


        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/SensorData")] //returns ALL sensor data for ALL plants, is this needed? maybe for extra graphs/ statistics?
        public async Task<IActionResult> AdminGetAll()
        {
            var data = await _repo.AdminGetAll();

            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/SensorData/{plantID}")]
        public async Task<IActionResult> AdminGetAllForPlant(string plantID)
        {
            var data = await _repo.AdminGetAllForAPlant(plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/SensorData/Daily/{plantID}")] //shows a plants sensor data based on current date
        public async Task<IActionResult> AdminGetDaily(string plantID)
        {
            var data = await _repo.AdminGetDaily(plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [Route("/api/Admin/SensorData/Monthly/{plantID}")] //shows sensor data based on current month
        public async Task<IActionResult> AdminGetMonthly(string plantID)
        {
            var data = await _repo.AdminGetMonthly(plantID);
            if (data == null)
            {
                return NotFound("No Sensor Data Found");
            }

            return Ok(data);
        }


        //this is for adding sensor data, to test the daily/monthly views, etc.
        [HttpPost]
        [Route("/api/Admin/ForTesting/SensorData")]
        public async Task<IActionResult> AdminPost([FromBody] SensorDataModel dataModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Model state invalid");
            }

            //use automapper to map from DTO to Model, then add current time UTC .
            var userID = User.Identity.Name;
            var user = await _userManager.FindByIdAsync(userID);

            if (user == null)
            {
                return BadRequest("User does not exist, this really shouldn't happen");
            }

            var data = _mapper.Map<SensorData>(dataModel);
            data.TimeStampUTC = DateTime.UtcNow;

            var result = await _repo.AdminAdd(data);

            if (result == null)
            {
                return BadRequest("Plant ID does not exist");
            }
            if (result == "")
            {
                return StatusCode(429, "Please wait 5 minutes between updates");
            }

            return Created("", result);
        }


    }
}
