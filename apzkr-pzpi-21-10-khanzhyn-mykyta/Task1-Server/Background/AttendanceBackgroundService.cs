using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using StudCheck_back.Database;
using StudCheck_back.Repositories.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

public class AttendanceBackgroundService : BackgroundService
{
    private readonly IServiceProvider serviceProvider;

    public AttendanceBackgroundService(IServiceProvider _serviceProvider)
    {
        serviceProvider = _serviceProvider;
    }

    // Перевірка часу та відмітка учнів як не прийшли
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;

            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<DatabaseContext>();

                // Перевірка, чи сьогодні не канікули та чи сьогодні не поза шкільним роком
                var isHoliday = await context.Holidays.AnyAsync(h => h.StartDate <= now && h.EndDate >= now);
                var schoolYearStart = new DateTime(now.Year, 9, 1);
                var schoolYearEnd = new DateTime(now.Year + 1, 5, 31);

                if (!isHoliday && now.Date >= schoolYearStart && now.Date <= schoolYearEnd &&
                    now.Hour == 16 && now.Minute == 0 && now.Second <= 59 &&
                    now.DayOfWeek != DayOfWeek.Saturday && now.DayOfWeek != DayOfWeek.Sunday)
                {
                    var attendanceRepository = scope.ServiceProvider.GetRequiredService<IAttendanceRepository>();
                    await attendanceRepository.MarkAbsentStudentsAsync();
                }
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}