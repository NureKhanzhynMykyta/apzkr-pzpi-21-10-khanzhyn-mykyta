using StudCheck_back.DTO;
using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface IClassRecordRepository
    {
        Task<ICollection<ClassRecord>> GetAllClassRecordsAsync();
        Task<ClassRecord> GetClassRecordAsync(int id);
        Task<bool> InsertClassRecordAsync(ClassRecord classRecord);
        Task<bool> UpdateClassRecordAsync(ClassRecord classRecord);
        Task<bool> DeleteClassRecordAsync(int id);
        Task<ICollection<ClassRecord>> GetClassRecordsFilteredAsync(string? subjectName, string? subjectClass, string? studentName, string? gradeType);
        Task<double> GetWeightedAverageGradeAsync(int studentId, int subjectId, DateTime startDate, DateTime endDate, Dictionary<string, double> gradeWeights);
        Task<AnnualGradeDto> GetAnnualGradeDetailsAsync(int studentId, int subjectId, int year, Dictionary<string, double> gradeWeights = null);
    }
}
