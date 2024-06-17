using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StudCheck_back.Authorization;
using StudCheck_back.Database;
using StudCheck_back.Models;
using StudCheck_back.Repositories.Interfaces;
using StudCheck_back.Repositories.Realisations;

namespace StudCheck_back
{
    public class Program 
    {
        public static void Main(string[] args)
        {
            // Отримання екземпляра WebApplicationBuilder
            var builder = WebApplication.CreateBuilder(args);

            // Налаштування аутентифікації з використанням JWT Bearer-токена
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = AuthOptions.ISSUER,
                        ValidateAudience = true,
                        ValidAudience = AuthOptions.AUDIENCE,
                        ValidateLifetime = true,
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true,
                    };
                });

            // Зчитування налаштувань адміністратора
            builder.Services.Configure<AdminCredentials>(builder.Configuration.GetSection("AdminCredentials"));

            // Додавання системи авторизації та контролерів до служб
            builder.Services.AddAuthorization();
            builder.Services.AddControllers();
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("StudentPolicy", policy => policy.RequireRole("student"));
                options.AddPolicy("TeacherPolicy", policy => policy.RequireRole("teacher"));
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("admin"));
            });

            // Додавання сервісів для роботи з базою даних та автомаппера
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            builder.Services.AddScoped<ITeacherRepository, TeacherRepository>();
            builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
            builder.Services.AddScoped<IClassRepository, ClassRepository>();
            builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
            builder.Services.AddScoped<IClassRecordRepository, ClassRecordRepository>();
            builder.Services.AddScoped<IHolidayRepository, HolidayRepository>();

            // Додавання фонового сервісу
            builder.Services.AddHostedService<AttendanceBackgroundService>();

            // Налаштування Swagger для документування API
            builder.Services.AddSwaggerGen(options =>
            {
                // Додавання опису аутентифікації JWT до Swagger
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "Enter your token in the text input below.",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer"
                });

                // Додавання вимог аутентифікації JWT до Swagger
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme()
                        {
                            Reference = new OpenApiReference()
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });

            // Налаштування доступу до бази даних
            builder.Services.AddDbContext<DatabaseContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("StudCheckDB"));
            });

            // Додавання служб Razor Pages
            builder.Services.AddRazorPages();

            // Налаштування CORS для дозволу запитів з визначених джерел
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // Побудова додатка
            var app = builder.Build();

            // Включення Swagger у режимі розробки
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Налаштування переадресації HTTPS
            app.UseHttpsRedirection();

            // Включення обробки статичних файлів
            app.UseStaticFiles();

            // Налаштування маршрутизації
            app.UseRouting();

            // Додавання маршрутів для Razor Pages
            app.MapRazorPages();

            // Налаштування CORS
            app.UseCors("AllowSpecificOrigin");

            // Включення аутентифікації та авторизації
            app.UseAuthentication();
            app.UseAuthorization();

            // Додавання маршрутів для контролерів
            app.MapControllers();

            // Запуск додатка
            app.Run();
        }
    }
}