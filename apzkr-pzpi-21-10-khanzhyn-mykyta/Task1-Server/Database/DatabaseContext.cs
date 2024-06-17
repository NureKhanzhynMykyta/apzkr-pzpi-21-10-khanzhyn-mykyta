using Microsoft.EntityFrameworkCore;
using StudCheck_back.Models;
using System;

namespace StudCheck_back.Database
{
    public class DatabaseContext : DbContext
    {
        // DbSet для кожної моделі
        public DbSet<Student> Students => Set<Student>();
        public DbSet<Class> Classes => Set<Class>();
        public DbSet<Teacher> Teachers => Set<Teacher>();
        public DbSet<Subject> Subjects => Set<Subject>();
        public DbSet<ClassRecord> ClassRecords => Set<ClassRecord>();
        public DbSet<Attendance> Attendances => Set<Attendance>();
        public DbSet<Holiday> Holidays => Set<Holiday>();

        // Конструктор, який приймає параметри підключення до бази даних
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        // Метод для налаштування відносин та полів бази даних
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Таблиця Student
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.NfcId)
                .IsUnique();

            modelBuilder.Entity<Student>()
                .Property(s => s.BirthDate)
                .HasDefaultValueSql("FORMAT(GETDATE(), 'yyyy-MM-dd')");

            // Таблиця Class
            modelBuilder.Entity<Class>()
                .HasMany(c => c.Students)
                .WithOne(s => s.Class)
                .HasForeignKey(s => s.ClassId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Class>()
                .HasIndex(c => c.ClassName)
                .IsUnique();

            // Таблиця Subject
            modelBuilder.Entity<Subject>()
                .HasIndex(s => new { s.SubjectName, s.SubjectClass })
                .IsUnique();

            // Таблиця ClassRecord
            modelBuilder.Entity<ClassRecord>()
                .HasOne(cr => cr.Student)
                .WithMany(s => s.ClassRecords)
                .HasForeignKey(cr => cr.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClassRecord>()
                .HasOne(cr => cr.Subject)
                .WithMany(s => s.ClassRecords)
                .HasForeignKey(cr => cr.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ClassRecord>()
                .HasOne(cr => cr.Teacher)
                .WithMany(t => t.ClassRecords)
                .HasForeignKey(cr => cr.TeacherId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ClassRecord>()
                .Property(cr => cr.GradeDate)
                .HasDefaultValueSql("FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm')");

            // Таблиця Attendance
            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Student)
                .WithMany(s => s.Attendances)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.CheckInTime)
                .HasDefaultValueSql("FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm')");

            modelBuilder.Entity<Attendance>()
                .Property(a => a.CheckOutTime)
                .IsRequired(false);

            modelBuilder.Entity<Attendance>()
                .Property(a => a.Status)
                .HasDefaultValue("Присутній");

            // Таблиця Holiday
            modelBuilder.Entity<Holiday>()
                .Property(s => s.StartDate)
                .HasDefaultValueSql("FORMAT(GETDATE(), 'yyyy-MM-dd')");
            
            modelBuilder.Entity<Holiday>()
                .Property(s => s.EndDate)
                .HasDefaultValueSql("FORMAT(GETDATE(), 'yyyy-MM-dd')");
        }
    }
}
