using Microsoft.EntityFrameworkCore;
using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Repositories.Realisations
{
    public class HolidayRepository : IHolidayRepository
    {
        DatabaseContext context;

        public HolidayRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх канікул
        public async Task<ICollection<Holiday>> GetAllHolidaysAsync()
        {
            try
            {
                return await context.Holidays.OrderByDescending(h => h.StartDate).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllHolidaysAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретні канікули за його ідентифікатором
        public async Task<Holiday> GetHolidayAsync(int id)
        {
            try
            {
                return await context.Holidays.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetHolidayAsync: {ex.Message}");
                throw;
            }
        }

        // Створення нового запису канікул
        public async Task<bool> InsertHolidayAsync(Holiday holiday)
        {
            try
            {
                await context.Holidays.AddAsync(holiday);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertHolidayAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про канікули за його ідентифікатором
        public async Task<bool> UpdateHolidayAsync(Holiday holiday)
        {
            try
            {
                context.Holidays.Update(holiday);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateHolidayAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення канікул за його ідентифікатором
        public async Task<bool> DeleteHolidayAsync(int id)
        {
            try
            {
                context.Holidays.Remove(await GetHolidayAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteHolidayAsync: {ex.Message}");
                throw;
            }
        }
    }
}
