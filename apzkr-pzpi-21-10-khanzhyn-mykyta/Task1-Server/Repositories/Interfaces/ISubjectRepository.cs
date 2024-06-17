using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface ISubjectRepository
    {
        Task<ICollection<Subject>> GetAllSubjectsAsync();
        Task<Subject> GetSubjectAsync(int id);
        Task<bool> InsertSubjectAsync(Subject subject);
        Task<bool> UpdateSubjectAsync(Subject subject);
        Task<bool> DeleteSubjectAsync(int id);
        Task<Subject> GetSubjectByNameAndClassAsync(string subjectName, string subjectClass);
    }
}
