using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmartPlant.Data;
using SmartPlant.Models;
using SmartPlant.Models.API_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartPlant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DatabaseContext _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(DatabaseContext repo, IMapper mapper,
            UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _mapper = mapper;
            _userManager = userManager;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto userRegDto)
        {
            if (userRegDto == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = _mapper.Map<ApplicationUser>(userRegDto);

            var result = await _userManager.CreateAsync(user, userRegDto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new RegistrationResponseDto { Errors = errors });
            };
            await _userManager.AddToRoleAsync(user, UserRoles.User);

            return StatusCode(201);
        }

    }
}
