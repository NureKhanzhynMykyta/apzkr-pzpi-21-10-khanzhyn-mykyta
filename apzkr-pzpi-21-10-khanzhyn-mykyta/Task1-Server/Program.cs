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
            // ��������� ���������� WebApplicationBuilder
            var builder = WebApplication.CreateBuilder(args);

            // ������������ �������������� � ������������� JWT Bearer-������
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

            // ���������� ����������� ������������
            builder.Services.Configure<AdminCredentials>(builder.Configuration.GetSection("AdminCredentials"));

            // ��������� ������� ����������� �� ���������� �� �����
            builder.Services.AddAuthorization();
            builder.Services.AddControllers();
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("StudentPolicy", policy => policy.RequireRole("student"));
                options.AddPolicy("TeacherPolicy", policy => policy.RequireRole("teacher"));
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("admin"));
            });

            // ��������� ������ ��� ������ � ����� ����� �� �����������
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            builder.Services.AddScoped<ITeacherRepository, TeacherRepository>();
            builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
            builder.Services.AddScoped<IClassRepository, ClassRepository>();
            builder.Services.AddScoped<IAttendanceRepository, AttendanceRepository>();
            builder.Services.AddScoped<IClassRecordRepository, ClassRecordRepository>();
            builder.Services.AddScoped<IHolidayRepository, HolidayRepository>();

            // ��������� �������� ������
            builder.Services.AddHostedService<AttendanceBackgroundService>();

            // ������������ Swagger ��� �������������� API
            builder.Services.AddSwaggerGen(options =>
            {
                // ��������� ����� �������������� JWT �� Swagger
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "Enter your token in the text input below.",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer"
                });

                // ��������� ����� �������������� JWT �� Swagger
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

            // ������������ ������� �� ���� �����
            builder.Services.AddDbContext<DatabaseContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("StudCheckDB"));
            });

            // ��������� ����� Razor Pages
            builder.Services.AddRazorPages();

            // ������������ CORS ��� ������� ������ � ���������� ������
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            // �������� �������
            var app = builder.Build();

            // ��������� Swagger � ����� ��������
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // ������������ ������������� HTTPS
            app.UseHttpsRedirection();

            // ��������� ������� ��������� �����
            app.UseStaticFiles();

            // ������������ �������������
            app.UseRouting();

            // ��������� �������� ��� Razor Pages
            app.MapRazorPages();

            // ������������ CORS
            app.UseCors("AllowSpecificOrigin");

            // ��������� �������������� �� �����������
            app.UseAuthentication();
            app.UseAuthorization();

            // ��������� �������� ��� ����������
            app.MapControllers();

            // ������ �������
            app.Run();
        }
    }
}