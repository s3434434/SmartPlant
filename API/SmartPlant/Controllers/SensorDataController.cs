using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using SmartPlant.Models.Repository;
using System;
using System.Threading.Tasks;
using SmartPlant.Models.API_Model.SensorData;

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


        /// <summary>
        /// Gets all sensor data for every plant belonging to the user
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400"></response>
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Gets all sensor data for a specific plant belonging to the user
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400"></response>
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Gets daily sensor data for a plant belonging to the user
        /// </summary>
        /// <remarks> Based on current day
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400"></response>
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Gets monthly sensor data for a plant belonging to the user
        /// </summary>
        /// <remarks> Based on current month
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="400"></response>
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Adds sensor data for a plant belonging to the user
        /// </summary>
        /// <remarks>
        /// Don't use this &#xA;
        /// ----------------------&#xA;
        /// Sensor data is stored as decimals, with 2 decimal places. &#xA; 
        /// For example: 12.446 becomes 12.45. &#xA; 
        ///              33.44469123 becomes 33.44.
        /// </remarks>
        /// <response code="201">Sensor Data Created</response>
        /// <response code="400">Bad Data / Format</response>
        /// <response code="404">PlantID Not Found</response>
        /// <response code="429">Wait at least 5 mins between updates</response>
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
                return NotFound("Plant ID does not exist in the user's list of plants.");
            }
            if (result == "")
            {
                return StatusCode(429, "Please wait 5 minutes between updates");
            }

            return Created("", result);
        }

        /// <summary>
        /// Adds sensor data for a plant belonging to the user - using a plant token for authentication
        /// </summary>
        /// <remarks> 
        /// This should be used from the Arduino code to update the database with sensor data &#xA; 
        /// Sensor data is stored as decimals, with 2 decimal places. &#xA; 
        /// For example: 12.446 becomes 12.45. &#xA; 
        ///              33.44469123 becomes 33.44.
        /// </remarks>
        /// <response code="201">Sensor Data Created</response>
        /// <response code="400">Bad Data / Format</response>
        /// <response code="401">Bad Plant Token or too soon for sensor update</response>
        [HttpPost]
        [AllowAnonymous]
        [Route("/api/SensorData/WithToken")]
        public async Task<IActionResult> PostWithToken(SensorDataWithTokenDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid inputs");
            }

            if (!await _repo.AddWithToken(dto))
            {
                return Unauthorized();
            }

            return Created("",dto);

        }

        /* 
         * ADMIN ROLE REQUIRED ENDPOINTS
         *           BELOW
         */


        /// <summary>
        /// Gets all sensor data for all plants
        /// </summary>
        /// <remarks> 
        /// </remarks>
        /// <response code="200">Success</response>        
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Gets sensor data for a specific plantID
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">PlantID Not Found</response>
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


        /// <summary>
        /// Gets daily sensor data for a specific plantID
        /// </summary>
        /// <remarks> Based on the current date
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">No Sensor Data Found</response>
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


        /// <summary>
        /// Gets monthly sensor data for a specific plantID
        /// </summary>
        /// <remarks> Based on the current date
        /// </remarks>
        /// <response code="201">Success</response>
        /// <response code="404">PlantID Not Found</response>
        /// <response code="429"></response>
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



        /// <summary>
        /// Adds sensor data -- this is just used for testing 
        /// </summary>
        /// <remarks> 
        /// </remarks>
        /// <response code="200">Success</response>
        /// <response code="404">No Sensor Data Found</response>
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
