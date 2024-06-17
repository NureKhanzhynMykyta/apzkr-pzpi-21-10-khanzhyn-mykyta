using Microsoft.EntityFrameworkCore;
using StudCheck_back.Database;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Repositories.Realisations
{
    public class AttendanceRepository : IAttendanceRepository
    {
        DatabaseContext context;

        public AttendanceRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Отримання всіх відвідувань
        public async Task<ICollection<Attendance>> GetAllAttendancesAsync()
        {
            try
            {
                return await context.Attendances.Include(a => a.Student).OrderByDescending(a => a.CheckInTime).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllAttendancesAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного відвідування за його ідентифікатором
        public async Task<Attendance> GetAttendanceAsync(int id)
        {
            try
            {
                return await context.Attendances.Include(a => a.Student).FirstOrDefaultAsync(a => a.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendanceAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання усіх відвідувань учня
        public async Task<ICollection<Attendance>> GetAttendancesByStudentAsync(int studentId)
        {
            try
            {
                return await context.Attendances
                    .Where(a => a.StudentId == studentId)
                    .Include(a => a.Student)
                    .OrderByDescending(a => a.CheckInTime)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendancesByStudentIdAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання відвідувань учня за конкретний рік
        public async Task<ICollection<Attendance>> GetAttendancesByStudentAndYearAsync(int studentId, int startYear)
        {
            try
            {
                var startDate = new DateTime(startYear, 9, 1);
                var endDate = new DateTime(startYear + 1, 5, 31);

                return await context.Attendances
                    .Where(a => a.StudentId == studentId && a.CheckInTime >= startDate && a.CheckInTime <= endDate)
                    .Include(a => a.Student)
                    .OrderByDescending(a => a.CheckInTime)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendancesByStudentIdAndYearAsync: {ex.Message}");
                throw;
            }
        }

        // Створення нового запису відвідуваності
        public async Task<bool> InsertAttendanceAsync(Attendance attendance)
        {
            try
            {
                await context.Attendances.AddAsync(attendance);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertAttendanceAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення відвідування
        public async Task<bool> UpdateAttendanceAsync(Attendance attendance)
        {
            try
            {
                context.Attendances.Update(attendance);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateAttendanceAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення відвідування за його ідентифікатором
        public async Task<bool> DeleteAttendanceAsync(int id)
        {
            try
            {
                context.Attendances.Remove(await GetAttendanceAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteAttendanceAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретного відвідування за NFC та дати
        public async Task<Attendance> GetAttendanceByNfcIdForTodayAsync(string nfcId)
        {
            try
            {
                var today = DateTime.Today;
                return await context.Attendances
                    .Where(a => a.Student.NfcId == nfcId && a.CheckInTime.Date == today)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendanceByNfcIdForTodayAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання статистики відвідуванності за шкільний рік
        public async Task<AttendanceStatisticsDto> GetAttendanceStatisticsAsync(int studentId, int schoolYearStart)
        {
            try
            {
                var schoolYearStartDate = new DateTime(schoolYearStart, 9, 1);
                var schoolYearEndDate = new DateTime(schoolYearStart + 1, 5, 31);

                var holidays = await context.Holidays
                    .Where(h => h.StartDate >= schoolYearStartDate && h.EndDate <= schoolYearEndDate)
                    .ToListAsync();

                var attendanceRecords = await context.Attendances
                    .Where(a => a.StudentId == studentId && a.CheckInTime >= schoolYearStartDate && a.CheckInTime <= schoolYearEndDate)
                    .ToListAsync();

                var presentDays = attendanceRecords.Count(a => a.Status == "Присутній");
                var absentDays = attendanceRecords.Count(a => a.Status == "Відсутній");

                var totalSchoolDays = 0;

                for (var date = schoolYearStartDate; date <= schoolYearEndDate; date = date.AddDays(1))
                {
                    if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                        continue;

                    if (holidays.Any(h => h.StartDate <= date && h.EndDate >= date))
                        continue;

                    totalSchoolDays++;
                }

                var attendancePercentage = Math.Round((double)presentDays / totalSchoolDays * 100, 2);

                var student = await context.Students.FindAsync(studentId);

                return new AttendanceStatisticsDto
                {
                    StudentId = studentId,
                    StudentName = $"{student.Surname} {student.Name} {student.Patronymic}",
                    TotalDays = totalSchoolDays,
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    AttendancePercentage = attendancePercentage
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAttendanceStatisticsAsync: {ex.Message}");
                throw;
            }
        }

        // Автоматичне позначення відсутніх студентів
        public async Task MarkAbsentStudentsAsync()
        {
            try
            {
                var today = DateTime.Today;
                var students = await context.Students.ToListAsync();
                var attendances = await context.Attendances.Where(a => a.CheckInTime.Date == today).ToListAsync();

                var presentStudentIds = attendances.Select(a => a.StudentId).ToList();

                foreach (var student in students)
                {
                    if (!presentStudentIds.Contains(student.Id))
                    {
                        var attendance = new Attendance
                        {
                            StudentId = student.Id,
                            CheckInTime = DateTime.Now,
                            Status = "Відсутній"
                        };

                        await context.Attendances.AddAsync(attendance);
                    }
                }

                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in MarkAbsentStudentsAsync: {ex.Message}");
                throw;
            }
        }
    }
}
