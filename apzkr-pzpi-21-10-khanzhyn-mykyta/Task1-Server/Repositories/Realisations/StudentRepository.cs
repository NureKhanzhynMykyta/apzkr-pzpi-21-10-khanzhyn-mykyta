using Microsoft.EntityFrameworkCore;
using StudCheck_back.Authorization;
using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Repositories.Realisations
{
    public class StudentRepository : IStudentRepository
    {
        DatabaseContext context;

        public StudentRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх учнів
        public async Task<ICollection<Student>> GetAllStudentsAsync()
        {
            try
            {
                return await context.Students.Include(s => s.Class).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllStudentsAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного учня за його ідентифікатором
        public async Task<Student> GetStudentAsync(int id)
        {
            try
            {
                return await context.Students
                    .Include(s => s.Class)
                    .FirstOrDefaultAsync(s => s.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentAsync: {ex.Message}");
                throw;
            }
        }

        // Вставка нового учня у базу даних з хешованим паролем
        public async Task<bool> InsertStudentAsync(Student student)
        {
            try
            {
                student.NfcId = NfcIdGenerator.GenerateNfcId();
                student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);
                await context.Students.AddAsync(student);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertStudentAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про учня з хешованим паролем
        public async Task<bool> UpdateStudentAsync(Student student, bool updatePassword)
        {
            try
            {
                if (updatePassword)
                {
                    student.Password = BCrypt.Net.BCrypt.HashPassword(student.Password);
                }
                else
                {
                    context.Entry(student).Property(x => x.Password).IsModified = false;
                }
                context.Students.Update(student);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateStudentAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення учня за його ідентифікатором
        public async Task<bool> DeleteStudentAsync(int id)
        {
            try
            {
                context.Students.Remove(await GetStudentAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteStudentAsync: {ex.Message}");
                throw;
            }
        }

        // Перевірка, чи учень з вказаною електронною поштою вже зареєстрований
        public async Task<bool> StudentIsRegisteredAsync(string email)
        {
            try
            {
                return await context.Students.AnyAsync(x => x.Email == email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in StudentIsRegisteredAsync: {ex.Message}");
                throw;
            }
        }

        // Перевірка вірності введеного пароля для конкретного учня
        public async Task<bool> StudentPasswordIsCorrectAsync(string email, string password)
        {
            try
            {
                if (await StudentIsRegisteredAsync(email))
                {
                    var student = await context.Students.FirstOrDefaultAsync(x => x.Email == email);
                    return BCrypt.Net.BCrypt.Verify(password, student.Password);
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in StudentPasswordIsCorrectAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання ідентифікатора учня за вказаною електронною поштою
        public async Task<int> GetStudentIdByEmail(string email)
        {
            try
            {
                var student = await context.Students.FirstOrDefaultAsync(x => x.Email == email);
                return student.Id;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentIdByEmail: {ex.Message}");
                throw;
            }
        }

        // Перевірка на те, чи була зареєстрована пошта
        public async Task<bool> EmailExistsAsync(string email)
        {
            try
            {
                return await context.Students.AnyAsync(x => x.Email == email) ||
                       await context.Teachers.AnyAsync(x => x.Email == email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EmailExistsAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного учня за його ідентифікатором але без відслідковування її контекстом
        public async Task<Student> GetStudentNoTrackingAsync(int id)
        {
            try
            {
                return await context.Students.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentNoTrackingAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного учня за його NFC ідентифікатором
        public async Task<Student> GetStudentByNfcIdAsync(string nfcId)
        {
            try
            {
                return await context.Students.FirstOrDefaultAsync(s => s.NfcId == nfcId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentByNfcIdAsync: {ex.Message}");
                throw;
            }
        }

        // Фільтрація учнів за класом
        public async Task<ICollection<Student>> GetStudentsFilteredAsync(string? className)
        {
            try
            {
                IQueryable<Student> query = context.Students
                    .Include(s => s.Class);

                if (!string.IsNullOrEmpty(className))
                {
                    query = query.Where(s => s.Class.ClassName.ToLower() == className.ToLower());
                }

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentsFilteredAsync: {ex.Message}");
                throw;
            }
        }

        // Пошук учня ім'ям, фамілією та по-батькові
        public async Task<ICollection<Student>> GetStudentsByFullNameAsync(string surname, string name, string patronymic)
        {
            try
            {
                return await context.Students
                    .Include(s => s.Class)
                    .Where(s =>
                        (string.IsNullOrEmpty(surname) || s.Surname.ToLower().Contains(surname.ToLower())) &&
                        (string.IsNullOrEmpty(name) || s.Name.ToLower().Contains(name.ToLower())) &&
                        (string.IsNullOrEmpty(patronymic) || s.Patronymic.ToLower().Contains(patronymic.ToLower())))
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentsByFullNameAsync: {ex.Message}");
                throw;
            }
        }
    }
}
