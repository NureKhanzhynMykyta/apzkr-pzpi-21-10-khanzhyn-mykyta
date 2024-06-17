using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface IClassRepository
    {
        Task<ICollection<Class>> GetAllClassesAsync();
        Task<Class> GetClassAsync(int id);
        Task<bool> InsertClassAsync(Class classEntity);
        Task<bool> UpdateClassAsync(Class classEntity);
        Task<bool> DeleteClassAsync(int id);
    }
}
