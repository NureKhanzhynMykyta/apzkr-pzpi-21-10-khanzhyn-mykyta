using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using StudCheck_back.Repositories.Realisations;
using System.Security.Claims;

namespace StudCheck_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HolidayController : ControllerBase
    {
        IHolidayRepository holidayRepository;
        IMapper mapper;

        public HolidayController(IHolidayRepository _holidayRepository, IMapper _mapper)
        {
            holidayRepository = _holidayRepository;
            mapper = _mapper;
        }

        // Отримання всіх канікул
        [HttpGet]
        public async Task<IActionResult> GetAllHolidays()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var holidays = mapper.Map<List<HolidayDto>>(await holidayRepository.GetAllHolidaysAsync());

                return Ok(holidays);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllHolidays: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретні канікули за його ідентифікатором
        [HttpGet("getHoliday/{id}")]
        public async Task<IActionResult> GetHolidayById(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                HolidayDto holiday = mapper.Map<HolidayDto>(await holidayRepository.GetHolidayAsync(id));

                return Ok(holiday);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetHolidayById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового запису канікул
        [HttpPost("postHoliday")]
        [Authorize]
        public async Task<IActionResult> AddHoliday([FromBody] HolidayDto holidayDto)
        {
            try
            {
                if (holidayDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                Holiday holiday = mapper.Map<Holiday>(holidayDto);

                if (!await holidayRepository.InsertHolidayAsync(holiday))
                {
                    ModelState.AddModelError("", "Unable to insert new holiday");
                    return StatusCode(500, ModelState);
                }

                return Ok("Holiday created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddHoliday: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про канікули за його ідентифікатором
        [HttpPut("putHoliday/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateHoliday(int id, [FromBody] HolidayDto holidayDto)
        {
            try
            {
                if (holidayDto == null)
                    return BadRequest(ModelState);

                if (id != holidayDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                Holiday holiday = mapper.Map<Holiday>(holidayDto);

                if (!await holidayRepository.UpdateHolidayAsync(holiday))
                {
                    ModelState.AddModelError("", "Unable to update holiday");
                    return StatusCode(500, ModelState);
                }

                return Ok("Holiday updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateHoliday: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення канікул за його ідентифікатором
        [HttpDelete("delHoliday/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteHoliday(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                if (!await holidayRepository.DeleteHolidayAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete holiday");
                    return StatusCode(500, ModelState);
                }

                return Ok("Holiday deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteHoliday: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
