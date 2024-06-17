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
    public class AttendanceController : ControllerBase
    {
        IAttendanceRepository attendanceRepository;
        IStudentRepository studentRepository;
        IMapper mapper;

        public AttendanceController(IAttendanceRepository _attendanceRepository, IStudentRepository _studentRepository, IMapper _mapper)
        {
            attendanceRepository = _attendanceRepository;
            studentRepository = _studentRepository;
            mapper = _mapper;
        }

        // Отримання всіх відвідувань
        [HttpGet]
        public async Task<IActionResult> GetAllAttendances()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var attendances = mapper.Map<List<AttendanceDto>>(await attendanceRepository.GetAllAttendancesAsync());

                return Ok(attendances);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllAttendances: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного відвідування за його ідентифікатором
        [HttpGet("getAttendance/{id}")]
        public async Task<IActionResult> GetAttendance(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                AttendanceDto attendance = mapper.Map<AttendanceDto>(await attendanceRepository.GetAttendanceAsync(id));

                return Ok(attendance);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendance: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання усіх відвідувань учня, або за конкретний рік
        [HttpGet("getStudentAttendances/{studentId}")]
        public async Task<IActionResult> GetStudentAttendances(int studentId, int? startYear = null)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                List<AttendanceDto> attendances;

                if (startYear.HasValue)
                {
                    attendances = mapper.Map<List<AttendanceDto>>(await attendanceRepository.GetAttendancesByStudentAndYearAsync(studentId, startYear.Value));
                }
                else
                {
                    attendances = mapper.Map<List<AttendanceDto>>(await attendanceRepository.GetAttendancesByStudentAsync(studentId));
                }

                return Ok(attendances);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentAttendances: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового запису відвідуваності за NFC
        [HttpPost("postAttendance/{nfcId}")]
        public async Task<IActionResult> PostAttendance(string nfcId)
        {
            try
            {
                if (string.IsNullOrEmpty(nfcId))
                {
                    return BadRequest("NfcId is required.");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingAttendance = await attendanceRepository.GetAttendanceByNfcIdForTodayAsync(nfcId);
                if (existingAttendance != null)
                {
                    return BadRequest("Attendance already exists for today.");
                }

                var student = await studentRepository.GetStudentByNfcIdAsync(nfcId);
                if (student == null)
                {
                    return NotFound("Student not found.");
                }

                var attendance = new Attendance
                {
                    StudentId = student.Id,
                    CheckInTime = DateTime.Now,
                    CheckOutTime = null,
                    Status = "Присутній"
                };

                if (!await attendanceRepository.InsertAttendanceAsync(attendance))
                {
                    ModelState.AddModelError("", "Unable to insert new attendance record.");
                    return StatusCode(500, ModelState);
                }

                return Ok("Attendance created successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostAttendance: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення відвідування за NFC, проставлення час виходу
        [HttpPut("putExitAttendance/{nfcId}")]
        public async Task<IActionResult> PutExitAttendance(string nfcId)
        {
            try
            {
                if (string.IsNullOrEmpty(nfcId))
                {
                    return BadRequest("NfcId is required.");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var attendance = await attendanceRepository.GetAttendanceByNfcIdForTodayAsync(nfcId);
                if (attendance == null)
                {
                    return NotFound("Attendance not found for today.");
                }

                if (attendance.CheckOutTime != null)
                {
                    return BadRequest("Check-out already recorded.");
                }

                attendance.CheckOutTime = DateTime.Now;
                if (!await attendanceRepository.UpdateAttendanceAsync(attendance))
                {
                    ModelState.AddModelError("", "Unable to update attendance record.");
                    return StatusCode(500, ModelState);
                }

                return Ok("Attendance check-out time updated successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutExitAttendance: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про відмітку учня за його ідентифікатором
        [HttpPut("putAttendance/{id}")]
        [Authorize]
        public async Task<IActionResult> PutAttendance(int id, [FromBody] AttendanceDto attendanceDto)
        {
            try
            {
                if (attendanceDto == null)
                    return BadRequest(ModelState);

                if (id != attendanceDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                Attendance attendance = mapper.Map<Attendance>(attendanceDto);

                if (!await attendanceRepository.UpdateAttendanceAsync(attendance))
                {
                    ModelState.AddModelError("", "Unable to update attendance");
                    return StatusCode(500, ModelState);
                }

                return Ok("Attendance updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutAttendance: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення відвідування за його ідентифікатором
        [HttpDelete("delAttendance/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAttendance(int id)
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

                if (!await attendanceRepository.DeleteAttendanceAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete attendance");
                    return StatusCode(500, ModelState);
                }

                return Ok("Attendance deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteAttendance: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання статистики відвідуванності за шкільний рік
        [HttpGet("attendanceStatistics/{studentId}/{startYear}")]
        public async Task<IActionResult> GetAttendanceStatistics(int studentId, int startYear)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var statistics = await attendanceRepository.GetAttendanceStatisticsAsync(studentId, startYear);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendanceStatistics: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Автоматичне позначення відсутніх студентів
        [HttpPost("markAbsentStudents")]
        public async Task<IActionResult> MarkAbsentStudents()
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await attendanceRepository.MarkAbsentStudentsAsync();
                return Ok("Absent students marked successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in MarkAbsentStudents: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
