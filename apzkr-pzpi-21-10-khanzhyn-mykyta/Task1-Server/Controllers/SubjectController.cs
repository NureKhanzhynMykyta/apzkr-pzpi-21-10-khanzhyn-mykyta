using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        ISubjectRepository subjectRepository;
        IMapper mapper;

        public SubjectController(ISubjectRepository _subjectRepository, IMapper _mapper)
        {
            subjectRepository = _subjectRepository;
            mapper = _mapper;
        }

        // Отримання всіх предметів
        [HttpGet]
        public async Task<IActionResult> GetAllSubjects()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subjects = mapper.Map<List<SubjectDto>>(await subjectRepository.GetAllSubjectsAsync());

                return Ok(subjects);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllSubjects: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного предмета за його ідентифікатором
        [HttpGet("getSubject/{id}")]
        public async Task<IActionResult> GetSubject(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                SubjectDto subject = mapper.Map<SubjectDto>(await subjectRepository.GetSubjectAsync(id));

                return Ok(subject);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetSubject: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового предмета
        [HttpPost("postSubject")]
        public async Task<IActionResult> PostSubject([FromBody] SubjectDto subjectDto)
        {
            try
            {
                if (subjectDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                Subject subject = mapper.Map<Subject>(subjectDto);

                if (!await subjectRepository.InsertSubjectAsync(subject))
                {
                    ModelState.AddModelError("", "Unable to insert new subject");
                    return StatusCode(500, ModelState);
                }

                return Ok("Subject created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostSubject: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про предмет за його ідентифікатором
        [HttpPut("putSubject/{id}")]
        public async Task<IActionResult> PutSubject(int id, [FromBody] SubjectDto subjectDto)
        {
            try
            {
                if (subjectDto == null)
                    return BadRequest(ModelState);

                if (id != subjectDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                Subject subject = mapper.Map<Subject>(subjectDto);

                if (!await subjectRepository.UpdateSubjectAsync(subject))
                {
                    ModelState.AddModelError("", "Unable to update subject");
                    return StatusCode(500, ModelState);
                }

                return Ok("Subject updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutSubject: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення предмета за його ідентифікатором
        [HttpDelete("delSubject/{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!await subjectRepository.DeleteSubjectAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete subject");
                    return StatusCode(500, ModelState);
                }

                return Ok("Subject deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteSubject: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
