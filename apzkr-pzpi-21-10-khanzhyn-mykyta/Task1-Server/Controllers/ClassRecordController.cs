using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using System.Security.Claims;

namespace StudCheck_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassRecordController : ControllerBase
    {
        IClassRecordRepository classRecordRepository;
        ISubjectRepository subjectRepository;
        IMapper mapper;

        public ClassRecordController(IClassRecordRepository _classRecordRepository, ISubjectRepository _subjectRepository, IMapper _mapper)
        {
            classRecordRepository = _classRecordRepository;
            subjectRepository = _subjectRepository;
            mapper = _mapper;
        }


        // Отримання всіх оцінок
        [HttpGet]
        public async Task<IActionResult> GetClassRecords()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var classRecords = mapper.Map<List<ClassRecordDto>>(await classRecordRepository.GetAllClassRecordsAsync());

                return Ok(classRecords);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClassRecords: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретної оцінки за її ідентифікатором
        [HttpGet("getClassRecord/{id}")]
        public async Task<IActionResult> GetClassRecord(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                ClassRecordDto classRecord = mapper.Map<ClassRecordDto>(await classRecordRepository.GetClassRecordAsync(id));

                return Ok(classRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClassRecord: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нової оцінки
        [HttpPost("postClassRecord")]
        [Authorize]
        public async Task<IActionResult> PostClassRecord([FromBody] ClassRecordDto classRecordDto)
        {
            try
            {
                if (classRecordDto == null)
                {
                    return BadRequest(ModelState);
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                int teacherId;

                if (userType == "admin") 
                {
                    teacherId = classRecordDto.TeacherId ?? 0;
                }
                else
                {
                    teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                }

                ClassRecord classRecord = mapper.Map<ClassRecord>(classRecordDto);
                classRecord.TeacherId = teacherId;

                if (!await classRecordRepository.InsertClassRecordAsync(classRecord))
                {
                    ModelState.AddModelError("", "Unable to insert new class record");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class record created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostClassRecord: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про оцінку за її ідентифікатором
        [HttpPut("putClassRecord/{id}")]
        [Authorize]
        public async Task<IActionResult> PutClassRecord(int id, [FromBody] ClassRecordDto classRecordDto)
        {
            try
            {
                if (classRecordDto == null)
                    return BadRequest(ModelState);

                if (id != classRecordDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                int teacherId;

                if (userType == "admin")
                {
                    teacherId = classRecordDto.TeacherId ?? 0;
                }
                else
                {
                    teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                }

                ClassRecord classRecord = mapper.Map<ClassRecord>(classRecordDto);
                classRecord.TeacherId = teacherId;

                if (!await classRecordRepository.UpdateClassRecordAsync(classRecord))
                {
                    ModelState.AddModelError("", "Unable to update class record");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class record updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutClassRecord: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення оцінки за її ідентифікатором
        [HttpDelete("delClassRecord/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteClassRecord(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                if (!await classRecordRepository.DeleteClassRecordAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete class record");
                    return StatusCode(500, ModelState);
                }

                return Ok("Class record deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteClassRecord: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Фільтрація та пошук оцінок
        [HttpGet("getFilteredClassRecords")]
        public async Task<IActionResult> GetFilteredClassRecords(string? subjectName, string? subjectClass, string? studentName, string? gradeType)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var classRecords = mapper.Map<List<ClassRecordDto>>(await classRecordRepository.GetClassRecordsFilteredAsync(subjectName, subjectClass, studentName, gradeType));

                return Ok(classRecords);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetFilteredClassRecords: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання річної оцінки за обраний предмет у учня
        [HttpGet("annualAverageGrade")]
        public async Task<IActionResult> GetAnnualAverageGrade(int studentId, string subjectName, string subjectClass, int year, double weightPR = 1, double weightTR = 1, double weightDR = 1, double weightKR = 1)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var subject = await subjectRepository.GetSubjectByNameAndClassAsync(subjectName, subjectClass);
                if (subject == null)
                {
                    return NotFound("Subject not found");
                }

                var gradeWeights = new Dictionary<string, double>
                {
                    { "ПР", weightPR },
                    { "ТР", weightTR },
                    { "ДР", weightDR },
                    { "КР", weightKR }
                };

                var annualGrade = await classRecordRepository.GetAnnualGradeDetailsAsync(studentId, subject.Id, year, gradeWeights);

                return Ok(annualGrade);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAnnualAverageGrade: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
