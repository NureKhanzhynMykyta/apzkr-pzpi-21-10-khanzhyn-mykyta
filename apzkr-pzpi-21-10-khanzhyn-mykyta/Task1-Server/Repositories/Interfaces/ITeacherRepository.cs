using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface ITeacherRepository
    {
        Task<ICollection<Teacher>> GetAllTeachersAsync();
        Task<Teacher> GetTeacherAsync(int id);
        Task<bool> InsertTeacherAsync(Teacher teacher);
        Task<bool> UpdateTeacherAsync(Teacher teacher, bool updatePassword);
        Task<bool> DeleteTeacherAsync(int id);
        Task<bool> TeacherIsRegisteredAsync(string email);
        Task<bool> TeacherPasswordIsCorrectAsync(string email, string password);
        Task<int> GetTeacherIdByEmail(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<Teacher> GetTeacherNoTrackingAsync(int id);
    }
}
