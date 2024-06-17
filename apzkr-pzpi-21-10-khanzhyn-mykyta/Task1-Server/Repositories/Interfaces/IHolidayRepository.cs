using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface IHolidayRepository
    {
        Task<ICollection<Holiday>> GetAllHolidaysAsync();
        Task<Holiday> GetHolidayAsync(int id);
        Task<bool> InsertHolidayAsync(Holiday holiday);
        Task<bool> UpdateHolidayAsync(Holiday holiday);
        Task<bool> DeleteHolidayAsync(int id);
    }
}
