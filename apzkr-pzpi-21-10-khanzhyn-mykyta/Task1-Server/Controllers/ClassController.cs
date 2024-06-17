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
    public class ClassController : ControllerBase
    {
        IClassRepository classRepository;
        IMapper mapper;

        public ClassController(IClassRepository _classRepository, IMapper _mapper)
        {
            classRepository = _classRepository;
            mapper = _mapper;
        }

        // Отримання всіх класів
        [HttpGet]
        public async Task<IActionResult> GetAllClasses()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var classes = mapper.Map<List<ClassDto>>(await classRepository.GetAllClassesAsync());
                return Ok(classes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllClasses: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного класу за його ідентифікатором
        [HttpGet("getClass/{id}")]
        public async Task<IActionResult> GetClass(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                ClassDto classDto = mapper.Map<ClassDto>(await classRepository.GetClassAsync(id));
                return Ok(classDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClass: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового класу
        [HttpPost("postClass")]
        [Authorize]
        public async Task<IActionResult> PostClass([FromBody] ClassDto classDto)
        {
            try
            {
                if (classDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                Class classEntity = mapper.Map<Class>(classDto);

                if (!await classRepository.InsertClassAsync(classEntity))
                {
                    ModelState.AddModelError("", "Unable to insert new class");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostClass: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про клас за його ідентифікатором
        [HttpPut("putClass/{id}")]
        [Authorize]
        public async Task<IActionResult> PutClass(int id, [FromBody] ClassDto classDto)
        {
            try
            {
                if (classDto == null)
                    return BadRequest(ModelState);

                if (id != classDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                Class classEntity = mapper.Map<Class>(classDto);

                if (!await classRepository.UpdateClassAsync(classEntity))
                {
                    ModelState.AddModelError("", "Unable to update class");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutClass: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення класу за його ідентифікатором
        [HttpDelete("delClass/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteClass(int id)
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

                if (!await classRepository.DeleteClassAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete class");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteClass: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
