using Microsoft.EntityFrameworkCore;
using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Repositories.Realisations
{
    public class SubjectRepository : ISubjectRepository
    {
        DatabaseContext context;

        public SubjectRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх предметів
        public async Task<ICollection<Subject>> GetAllSubjectsAsync()
        {
            try
            {
                return await context.Subjects.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllSubjectsAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного предмета за його ідентифікатором
        public async Task<Subject> GetSubjectAsync(int id)
        {
            try
            {
                return await context.Subjects.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetSubjectAsync: {ex.Message}");
                throw;
            }
        }

        // Створення нового предмета
        public async Task<bool> InsertSubjectAsync(Subject subject)
        {
            try
            {
                await context.Subjects.AddAsync(subject);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertSubjectAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про предмет за його ідентифікатором
        public async Task<bool> UpdateSubjectAsync(Subject subject)
        {
            try
            {
                context.Subjects.Update(subject);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateSubjectAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення предмета за його ідентифікатором
        public async Task<bool> DeleteSubjectAsync(int id)
        {
            try
            {
                context.Subjects.Remove(await GetSubjectAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteSubjectAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<Subject> GetSubjectByNameAndClassAsync(string subjectName, string subjectClass)
        {
            try
            {
                return await context.Subjects
                    .FirstOrDefaultAsync(s => s.SubjectName == subjectName && s.SubjectClass == subjectClass);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetSubjectByNameAndClassAsync: {ex.Message}");
                throw;
            }
        }
    }
}
