using Microsoft.EntityFrameworkCore;
using StudCheck_back.Database;
using StudCheck_back.DTO;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;

namespace StudCheck_back.Repositories.Realisations
{
    public class ClassRecordRepository : IClassRecordRepository
    {
        DatabaseContext context;

        public ClassRecordRepository(DatabaseContext _context)
        {
            context = _context;
        }

        // Запис з вагами різних типів робіт у предметі
        private Dictionary<string, double> GetDefaultGradeWeights()
        {
            return new Dictionary<string, double>
            {
                { "ПР", 1 },
                { "ТР", 1 },
                { "ДР", 1 },
                { "КР", 1 }
            };
        }

        // Отримання всіх оцінок
        public async Task<ICollection<ClassRecord>> GetAllClassRecordsAsync()
        {
            try
            {
                return await context.ClassRecords
                    .Include(cr => cr.Student)
                    .Include(cr => cr.Subject)
                    .Include(cr => cr.Teacher)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllClassRecordsAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання конкретної оцінки за її ідентифікатором
        public async Task<ClassRecord> GetClassRecordAsync(int id)
        {
            try
            {
                return await context.ClassRecords
                    .Include(cr => cr.Student)
                    .Include(cr => cr.Subject)
                    .Include(cr => cr.Teacher)
                    .FirstOrDefaultAsync(cr => cr.Id == id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClassRecordAsync: {ex.Message}");
                throw;
            }
        }

        // Створення нової оцінки
        public async Task<bool> InsertClassRecordAsync(ClassRecord classRecord)
        {
            try
            {
                await context.ClassRecords.AddAsync(classRecord);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in InsertClassRecordAsync: {ex.Message}");
                throw;
            }
        }

        // Оновлення інформації про оцінку за її ідентифікатором
        public async Task<bool> UpdateClassRecordAsync(ClassRecord classRecord)
        {
            try
            {
                context.ClassRecords.Update(classRecord);
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateClassRecordAsync: {ex.Message}");
                throw;
            }
        }

        // Видалення оцінки за її ідентифікатором
        public async Task<bool> DeleteClassRecordAsync(int id)
        {
            try
            {
                context.ClassRecords.Remove(await GetClassRecordAsync(id));
                return await context.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteClassRecordAsync: {ex.Message}");
                throw;
            }
        }

        // Фільтрація та пошук оцінок
        public async Task<ICollection<ClassRecord>> GetClassRecordsFilteredAsync(string? subjectName, string? subjectClass, string? studentName, string? gradeType)
        {
            try
            {
                IQueryable<ClassRecord> query = context.ClassRecords
                    .Include(cr => cr.Subject)
                    .Include(cr => cr.Student)
                    .Include(cr => cr.Teacher);

                if (!string.IsNullOrEmpty(subjectName))
                {
                    query = query.Where(cr => cr.Subject.SubjectName.ToLower() == subjectName.ToLower());
                }

                if (!string.IsNullOrEmpty(subjectClass))
                {
                    query = query.Where(cr => cr.Subject.SubjectClass.ToLower() == subjectClass.ToLower());
                }

                if (!string.IsNullOrEmpty(studentName))
                {
                    query = query.Where(cr => (cr.Student.Surname + " " + cr.Student.Name + " " + cr.Student.Patronymic).ToLower().Contains(studentName.ToLower()));
                }

                if (!string.IsNullOrEmpty(gradeType))
                {
                    query = query.Where(cr => cr.GradeType.ToLower() == gradeType.ToLower());
                }

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetClassRecordsFilteredAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання семестрової оцінки з предмета та урахуванням вагів
        public async Task<double> GetWeightedAverageGradeAsync(int studentId, int subjectId, DateTime startDate, DateTime endDate, Dictionary<string, double> gradeWeights)
        {
            try
            {
                var classRecords = await context.ClassRecords
                    .Where(cr => cr.StudentId == studentId && cr.SubjectId == subjectId && cr.GradeDate >= startDate && cr.GradeDate <= endDate)
                    .ToListAsync();

                if (classRecords.Count == 0)
                    return 0;

                double sumWeightedGrades = 0;
                double totalWeights = 0;

                foreach (var record in classRecords)
                {
                    double weight = gradeWeights.ContainsKey(record.GradeType) ? gradeWeights[record.GradeType] : 1;
                    sumWeightedGrades += record.Grade * weight;
                    totalWeights += weight;
                }

                return sumWeightedGrades / totalWeights;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetWeightedAverageGradeAsync: {ex.Message}");
                throw;
            }
        }

        // Отримання річної оцінки за обраний предмет у учня
        public async Task<AnnualGradeDto> GetAnnualGradeDetailsAsync(int studentId, int subjectId, int year, Dictionary<string, double> gradeWeights = null)
        {
            try
            {
                DateTime firstSemesterStart = new DateTime(year, 9, 1);
                DateTime firstSemesterEnd = new DateTime(year, 12, 31);
                DateTime secondSemesterStart = new DateTime(year + 1, 1, 1);
                DateTime secondSemesterEnd = new DateTime(year + 1, 5, 31);

                var weights = gradeWeights ?? GetDefaultGradeWeights();

                double firstSemesterAverage = await GetWeightedAverageGradeAsync(studentId, subjectId, firstSemesterStart, firstSemesterEnd, weights);
                double secondSemesterAverage = await GetWeightedAverageGradeAsync(studentId, subjectId, secondSemesterStart, secondSemesterEnd, weights);
                double annualAverage = Math.Round((firstSemesterAverage + secondSemesterAverage) / 2);

                return new AnnualGradeDto
                {
                    FirstSemesterGrade = firstSemesterAverage,
                    SecondSemesterGrade = secondSemesterAverage,
                    AnnualGrade = annualAverage
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAnnualGradeDetailsAsync: {ex.Message}");
                throw;
            }
        }
    }
}