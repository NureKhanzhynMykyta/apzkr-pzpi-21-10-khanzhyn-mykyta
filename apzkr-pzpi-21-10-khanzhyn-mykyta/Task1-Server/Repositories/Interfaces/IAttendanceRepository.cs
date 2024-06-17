using StudCheck_back.DTO;
using StudCheck_back.Models;

namespace StudCheck_back.Repositories.Interfaces
{
    public interface IAttendanceRepository
    {
        Task<ICollection<Attendance>> GetAllAttendancesAsync();
        Task<Attendance> GetAttendanceAsync(int id);
        Task<ICollection<Attendance>> GetAttendancesByStudentAsync(int studentId);
        Task<ICollection<Attendance>> GetAttendancesByStudentAndYearAsync(int studentId, int startYear);
        Task<bool> InsertAttendanceAsync(Attendance attendance);
        Task<bool> UpdateAttendanceAsync(Attendance attendance);
        Task<bool> DeleteAttendanceAsync(int id);
        Task<Attendance> GetAttendanceByNfcIdForTodayAsync(string nfcId);
        Task<AttendanceStatisticsDto> GetAttendanceStatisticsAsync(int studentId, int startYear);
        Task MarkAbsentStudentsAsync();
    }
}
