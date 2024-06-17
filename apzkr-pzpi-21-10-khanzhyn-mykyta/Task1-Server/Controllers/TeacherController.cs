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
    public class TeacherController : ControllerBase
    {
        ITeacherRepository teacherRepository;
        IMapper mapper;

        public TeacherController(ITeacherRepository _teacherRepository, IMapper _mapper)
        {
            teacherRepository = _teacherRepository;
            mapper = _mapper;
        }

        // Отримання всіх вчителів
        [HttpGet]
        public async Task<IActionResult> GetAllTeachers()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var teachers = mapper.Map<List<TeacherDto>>(await teacherRepository.GetAllTeachersAsync());

                return Ok(teachers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllTeachers: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного вчителя за його ідентифікатором
        [HttpGet("getTeacherById/{id}")]
        public async Task<IActionResult> GetTeacherById(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                TeacherDto teacher = mapper.Map<TeacherDto>(await teacherRepository.GetTeacherAsync(id));

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTeacherById: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Отримання конкретного вчителя, якщо користувач авторизований
        [HttpGet("getTeacher")]
        [Authorize]
        public async Task<IActionResult> GetTeacher()
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher")
                {
                    return Unauthorized();
                }

                TeacherDto teacher = mapper.Map<TeacherDto>(await teacherRepository.GetTeacherAsync(id));

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTeacher: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Створення нового вчителя
        [HttpPost("postTeacher")]
        [Authorize]
        public async Task<IActionResult> PostTeacher([FromBody] TeacherDto teacherDto)
        {
            try
            {
                if (teacherDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "admin")
                {
                    return Unauthorized();
                }

                if (await teacherRepository.EmailExistsAsync(teacherDto.Email))
                {
                    ModelState.AddModelError("", "Електронна пошта вже використовується іншим користувачем.");
                    return BadRequest(ModelState);
                }

                Teacher teacher = mapper.Map<Teacher>(teacherDto);

                if (!await teacherRepository.InsertTeacherAsync(teacher))
                {
                    ModelState.AddModelError("", "Unable to insert new teacher");
                    return StatusCode(500, ModelState);
                }

                return Ok("Teacher created successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostTeacher: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про вчителя
        [HttpPut("putTeacher/{id}")]
        public async Task<IActionResult> PutTeacher(int id, [FromBody] TeacherDto teacherDto, bool updatePassword = true)
        {
            try
            {
                if (teacherDto == null)
                    return BadRequest(ModelState);

                if (id != teacherDto.Id)
                    return BadRequest();

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var existingTeacher = await teacherRepository.GetTeacherNoTrackingAsync(id);
                if (existingTeacher.Email != teacherDto.Email && await teacherRepository.EmailExistsAsync(teacherDto.Email))
                {
                    ModelState.AddModelError("", "Електронна пошта вже використовується іншим студентом або викладачем.");
                    return BadRequest(ModelState);
                }

                Teacher teacher = mapper.Map<Teacher>(teacherDto);

                if (!await teacherRepository.UpdateTeacherAsync(teacher, updatePassword))
                {
                    ModelState.AddModelError("", "Unable to update teacher");
                    return StatusCode(500, ModelState);
                }

                return Ok("Teacher updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutTeacher: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Оновлення інформації про вчителя, можливі функції для самого вчителя, якщо користувач авторизований
        [HttpPut("editTeacher")]
        [Authorize]
        public async Task<IActionResult> EditTeacher([FromBody] EditTeacherDto editTeacherDto)
        {
            try
            {
                if (editTeacherDto == null)
                    return BadRequest(ModelState);

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                int id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                if (id != editTeacherDto.Id)
                    return BadRequest();

                string userType = User.FindFirstValue(ClaimTypes.Role);

                if (userType != "teacher" && userType != "admin")
                {
                    return Unauthorized();
                }

                var existingTeacher = await teacherRepository.GetTeacherNoTrackingAsync(id);
                if (existingTeacher.Email != editTeacherDto.Email && await teacherRepository.EmailExistsAsync(editTeacherDto.Email))
                {
                    ModelState.AddModelError("", "Електронна пошта вже використовується іншим користувачем.");
                    return BadRequest(ModelState);
                }

                bool updatePassword = false;
                if (!string.IsNullOrEmpty(editTeacherDto.CurrentPassword) || !string.IsNullOrEmpty(editTeacherDto.NewPassword))
                {
                    if (string.IsNullOrEmpty(editTeacherDto.CurrentPassword) || string.IsNullOrEmpty(editTeacherDto.NewPassword))
                    {
                        ModelState.AddModelError("", "Щоб змінити пароль, необхідно вказати поточний і новий паролі.");
                        return BadRequest(ModelState);
                    }

                    if (editTeacherDto.NewPassword.Length < 8)
                    {
                        ModelState.AddModelError("", "Новий пароль має бути не менше 8 символів.");
                        return BadRequest(ModelState);
                    }

                    if (!BCrypt.Net.BCrypt.Verify(editTeacherDto.CurrentPassword, existingTeacher.Password))
                    {
                        ModelState.AddModelError("", "Current password is incorrect.");
                        return BadRequest(ModelState);
                    }

                    existingTeacher.Password = editTeacherDto.NewPassword;
                    updatePassword = true;
                }

                existingTeacher.Name = editTeacherDto.Name;
                existingTeacher.Surname = editTeacherDto.Surname;
                existingTeacher.Patronymic = editTeacherDto.Patronymic;
                existingTeacher.Number = editTeacherDto.Number;
                existingTeacher.Email = editTeacherDto.Email;

                if (!await teacherRepository.UpdateTeacherAsync(existingTeacher, updatePassword))
                {
                    ModelState.AddModelError("", "Unable to update teacher");
                    return StatusCode(500, ModelState);
                }

                return Ok("Teacher updated successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EditTeacher: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Видалення вчителя за його ідентифікатором
        [HttpDelete("delTeacher/{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!await teacherRepository.DeleteTeacherAsync(id))
                {
                    ModelState.AddModelError("", "Unable to delete teacher");
                    return StatusCode(500, ModelState);
                }

                return Ok("Teacher deleted successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteTeacher: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Авторизація вчителя та генерація JWT-токена
        [HttpPost("authorizeTeacher")]
        public async Task<IActionResult> Authorize([FromBody] LoginData loginData)
        {
            try
            {
                if (await teacherRepository.TeacherPasswordIsCorrectAsync(loginData.Email, loginData.Password))
                {
                    int teacherId = await teacherRepository.GetTeacherIdByEmail(loginData.Email);

                    var claims = new List<Claim> {
                        new Claim(ClaimTypes.NameIdentifier, teacherId.ToString()),
                        new Claim(ClaimTypes.Role, "teacher")
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

                    Console.WriteLine("Teacher Authorized");
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
    }
}
