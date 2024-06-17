using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StudCheck_back.Authorization;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using StudCheck_back.Repositories.Realisations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace StudCheck_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        IStudentRepository studentRepository;
        IMapper mapper;

        public StudentController(IStudentRepository _studentRepository, IMapper _mapper)
        {
            studentRepository = _studentRepository;
            mapper = _mapper;
        }

        // Отримання всіх учнів
        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var students = mapper.Map<List<StudentDto>>(await studentRepository.GetAllStudentsAsync());

                return Ok(students);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllStudents: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного учня за його ідентифікатором
        [HttpGet("getStudentById/{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                StudentDto student = mapper.Map<StudentDto>(await studentRepository.GetStudentAsync(id));

                return Ok(student);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного учня, якщо користувач авторизований
        [HttpGet("getStudent")]
        [Authorize]
        public async Task<IActionResult> GetStudent()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                int Id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "student")
                {
                    return Unauthorized();
                }

                StudentDto student = mapper.Map<StudentDto>(await studentRepository.GetStudentAsync(Id));

                return Ok(student);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового учня
        [HttpPost("postStudent")]
        [Authorize]
        public async Task<IActionResult> PostStudent([FromBody] StudentDto studentDto)
        {
            try
            {
                if (studentDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                if (await studentRepository.EmailExistsAsync(studentDto.Email))
                {
                    ModelState.AddModelError("", "Email is already in use by another user.");
                    return BadRequest(ModelState);
                }

                Student student = mapper.Map<Student>(studentDto);

                if (!await studentRepository.InsertStudentAsync(student))
                {
                    ModelState.AddModelError("", "Unable to insert new student");
                    return StatusCode(500, ModelState);
                }

                return Ok("Student created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostStudent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про учня
        [HttpPut("putStudent/{id}")]
        [Authorize]
        public async Task<IActionResult> PutStudent(int id, [FromBody] StudentDto studentDto, bool updatePassword = true)
        {
            try
            {
                if (studentDto == null)
                    return BadRequest(ModelState);

                if (id != studentDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                var existingStudent = await studentRepository.GetStudentNoTrackingAsync(id);
                if (existingStudent.Email != studentDto.Email && await studentRepository.EmailExistsAsync(studentDto.Email))
                {
                    ModelState.AddModelError("", "Електронною поштою вже користується інший учень або вчитель.");
                    return BadRequest(ModelState);
                }

                Student student = mapper.Map<Student>(studentDto);

                if (!await studentRepository.UpdateStudentAsync(student, updatePassword))
                {
                    ModelState.AddModelError("", "Unable to update student");
                    return StatusCode(500, ModelState);
                }

                return Ok("Student updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutStudent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про учня, можливі функції для самого учня, якщо користувач авторизований
        [HttpPut("editStudent")]
        [Authorize]
        public async Task<IActionResult> EditStudent([FromBody] EditStudentDto editStudentDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (id != editStudentDto.Id)
                {
                    return BadRequest();
                }

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "student")
                {
                    return Unauthorized();
                }

                var existingStudent = await studentRepository.GetStudentNoTrackingAsync(id);
                if (existingStudent == null)
                {
                    return NotFound("Учня не знайдено");
                }

                if (existingStudent.Email != editStudentDto.Email && await studentRepository.EmailExistsAsync(editStudentDto.Email))
                {
                    ModelState.AddModelError("", "Електронна пошта вже використовується іншим користувачем.");
                    return BadRequest(ModelState);
                }

                bool updatePassword = false;
                if (!string.IsNullOrEmpty(editStudentDto.CurrentPassword) || !string.IsNullOrEmpty(editStudentDto.NewPassword))
                {
                    if (string.IsNullOrEmpty(editStudentDto.CurrentPassword) || string.IsNullOrEmpty(editStudentDto.NewPassword))
                    {
                        ModelState.AddModelError("", "Щоб змінити пароль, необхідно вказати поточний і новий паролі.");
                        return BadRequest(ModelState);
                    }

                    if (editStudentDto.NewPassword.Length < 8)
                    {
                        ModelState.AddModelError("", "Новий пароль має бути не менше 8 символів.");
                        return BadRequest(ModelState);
                    }

                    if (!BCrypt.Net.BCrypt.Verify(editStudentDto.CurrentPassword, existingStudent.Password))
                    {
                        ModelState.AddModelError("", "Поточний пароль неправильний.");
                        return BadRequest(ModelState);
                    }

                    existingStudent.Password = editStudentDto.NewPassword;
                    updatePassword = true;
                }

                existingStudent.Number = editStudentDto.Number;
                existingStudent.Email = editStudentDto.Email;

                if (!await studentRepository.UpdateStudentAsync(existingStudent, updatePassword))
                {
                    ModelState.AddModelError("", "Unable to update student");
                    return StatusCode(500, ModelState);
                }

                return Ok("Student updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EditStudent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення учня за його ідентифікатором
        [HttpDelete("delStudent/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                if (!await studentRepository.DeleteStudentAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete student");
                    return StatusCode(500, ModelState);
                }

                return Ok("Student deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteStudent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Авторизація учня та генерація JWT-токена
        [HttpPost("authorizeStudent")]
        public async Task<IActionResult> Authorize([FromBody] LoginData loginData)
        {
            try
            {
                if (await studentRepository.StudentPasswordIsCorrectAsync(loginData.Email, loginData.Password))
                {
                    int studentId = await studentRepository.GetStudentIdByEmail(loginData.Email);

                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, studentId.ToString()),
                        new Claim(ClaimTypes.Role, "student")
                    };

                    var jwt = new JwtSecurityToken(
                            issuer: AuthOptions.ISSUER,
                            audience: AuthOptions.AUDIENCE,
                            claims: claims,
                            expires: DateTime.UtcNow.Add(TimeSpan.FromHours(2)),
                            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
                    );

                    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                    var response = new
                    {
                        access_token = encodedJwt,
                    };

                    Console.WriteLine("Student Authorized");
                    return Ok(response);
                }

                return Unauthorized(new { error = "Невірна адреса електронної пошти або пароль" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in Authorize: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання відфільтрованих учнів за класом
        [HttpGet("getFilteredStudents")]
        public async Task<IActionResult> GetFilteredStudents(string? className)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var students = mapper.Map<List<StudentDto>>(await studentRepository.GetStudentsFilteredAsync(className));
                var sortedStudents = students.OrderBy(s => s.Surname).ToList();

                return Ok(sortedStudents);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetFilteredStudents: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Пошук учнів за ім'ям, фамілією та по-батькові
        [HttpGet("getSearchStudents")]
        public async Task<IActionResult> GetStudentsByFullName(string surname, string name, string patronymic)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var students = mapper.Map<List<StudentDto>>(await studentRepository.GetStudentsByFullNameAsync(surname, name, patronymic));

                return Ok(students);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentsByFullName: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
