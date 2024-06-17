using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace StudCheck_back.Repositories.Realisations
{
    public class ClassRepository : IClassRepository
    {
        DatabaseContext context;

        public ClassRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх класів
        public async Task<ICollection<Class>> GetAllClassesAsync()
        {
            try
            {
                return await context.Classes.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllClassesAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного класу за його ідентифікатором
        public async Task<Class> GetClassAsync(int id)
        {
            try
            {
                return await context.Classes.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClassAsync: {ex.Message}");
                throw;
            }
        }

        // Вставка нового класу
        public async Task<bool> InsertClassAsync(Class classEntity)
        {
            try
            {
                await context.Classes.AddAsync(classEntity);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertClassAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про клас
        public async Task<bool> UpdateClassAsync(Class classEntity)
        {
            try
            {
                context.Classes.Update(classEntity);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateClassAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення класу за його ідентифікатором
        public async Task<bool> DeleteClassAsync(int id)
        {
            try
            {
                context.Classes.Remove(await GetClassAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteClassAsync: {ex.Message}");
                throw;
            }
        }
    }
}