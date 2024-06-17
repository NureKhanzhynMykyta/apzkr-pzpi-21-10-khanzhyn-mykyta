using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using StudCheck_back.Authorization;
using Microsoft.EntityFrameworkCore;

namespace StudCheck_back.Repositories.Realisations
{
    public class TeacherRepository : ITeacherRepository
    {
        DatabaseContext context;

        public TeacherRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх вчителів
        public async Task<ICollection<Teacher>> GetAllTeachersAsync()
        {
            try
            {
                return await context.Teachers.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllTeachersAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного вчителя за його ідентифікатором
        public async Task<Teacher> GetTeacherAsync(int id)
        {
            try
            {
                return await context.Teachers.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTeacherAsync: {ex.Message}");
                throw;
            }
        }

        // Вставка нового вчителя у базу даних з хешованим паролем
        public async Task<bool> InsertTeacherAsync(Teacher teacher)
        {
            try
            {
                teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacher.Password);
                await context.Teachers.AddAsync(teacher);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertTeacherAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про вчителя з хешованим паролем
        public async Task<bool> UpdateTeacherAsync(Teacher teacher, bool updatePassword)
        {
            try
            {
                if (updatePassword)
                {
                    teacher.Password = BCrypt.Net.BCrypt.HashPassword(teacher.Password);
                }
                else
                {
                    context.Entry(teacher).Property(x => x.Password).IsModified = false;
                }
                context.Teachers.Update(teacher);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateTeacherAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення вчителя за його ідентифікатором
        public async Task<bool> DeleteTeacherAsync(int id)
        {
            try
            {
                context.Teachers.Remove(await GetTeacherAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteTeacherAsync: {ex.Message}");
                throw;
            }
        }

        // Перевірка, чи вчитель з вказаною електронною поштою вже зареєстрований
        public async Task<bool> TeacherIsRegisteredAsync(string email)
        {
            try
            {
                return await context.Teachers.AnyAsync(x => x.Email == email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in TeacherIsRegisteredAsync: {ex.Message}");
                throw;
            }
        }

        // Перевірка вірності введеного пароля для конкретного вчителя
        public async Task<bool> TeacherPasswordIsCorrectAsync(string email, string password)
        {
            try
            {
                if (await TeacherIsRegisteredAsync(email))
                {
                    var teacher = await context.Teachers.FirstOrDefaultAsync(x => x.Email == email);
                    return BCrypt.Net.BCrypt.Verify(password, teacher.Password);
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in TeacherPasswordIsCorrectAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання ідентифікатора вчителя за вказаною електронною поштою
        public async Task<int> GetTeacherIdByEmail(string email)
        {
            try
            {
                var teacher = await context.Teachers.FirstOrDefaultAsync(x => x.Email == email);
                return teacher.Id;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTeacherIdByEmail: {ex.Message}");
                throw;
            }
        }

        // Перевірка на те, чи була зареєстрована пошта
        public async Task<bool> EmailExistsAsync(string email)
        {
            try
            {
                return await context.Teachers.AnyAsync(x => x.Email == email) ||
                       await context.Students.AnyAsync(x => x.Email == email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EmailExistsAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного вчителя за його ідентифікатором але без відслідковування її контекстом
        public async Task<Teacher> GetTeacherNoTrackingAsync(int id)
        {
            try
            {
                return await context.Teachers.AsNoTracking().FirstOrDefaultAsync(t => t.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetTeacherNoTrackingAsync: {ex.Message}");
                throw;
            }
        }
    }
}
