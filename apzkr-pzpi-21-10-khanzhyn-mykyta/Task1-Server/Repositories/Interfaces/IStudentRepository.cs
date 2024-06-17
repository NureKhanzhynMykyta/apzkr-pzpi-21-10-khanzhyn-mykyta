using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface IStudentRepository
    {
        Task<ICollection<Student>> GetAllStudentsAsync();
        Task<Student> GetStudentAsync(int id);
        Task<bool> InsertStudentAsync(Student student);
        Task<bool> UpdateStudentAsync(Student student, bool updatePassword);
        Task<bool> DeleteStudentAsync(int id);
        Task<bool> StudentIsRegisteredAsync(string email);
        Task<bool> StudentPasswordIsCorrectAsync(string email, string password);
        Task<int> GetStudentIdByEmail(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<Student> GetStudentNoTrackingAsync(int id);
        Task<Student> GetStudentByNfcIdAsync(string nfcId);
        Task<ICollection<Student>> GetStudentsFilteredAsync(string? className);
        Task<ICollection<Student>> GetStudentsByFullNameAsync(string surname, string name, string patronymic);
    }
}
