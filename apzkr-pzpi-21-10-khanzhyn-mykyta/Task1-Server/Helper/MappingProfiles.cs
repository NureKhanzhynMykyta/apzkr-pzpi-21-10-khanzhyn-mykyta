using AutoMapper;
using StudCheck_back.DTO;
using StudCheck_back.Models;

namespace StudCheck_back.Helper
{
    public class MappingProfiles : Profile
    {
        // Додавання мапінгу для кожної моделі та її DTO
        public MappingProfiles()
        {
            CreateMap<Student, StudentDto>()
                .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class.ClassName));
            CreateMap<StudentDto, Student>();

            CreateMap<Teacher, TeacherDto>();
            CreateMap<TeacherDto, Teacher>();

            CreateMap<Attendance, AttendanceDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.Surname + " " + src.Student.Name + " " + src.Student.Patronymic));
            CreateMap<AttendanceDto, Attendance>();

            CreateMap<Subject, SubjectDto>();
            CreateMap<SubjectDto, Subject>();

            CreateMap<Class, ClassDto>();
            CreateMap<ClassDto, Class>();

            CreateMap<ClassRecord, ClassRecordDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.Surname + " " + src.Student.Name + " " + src.Student.Patronymic))
                .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.SubjectName))
                .ForMember(dest => dest.SubjectClass, opt => opt.MapFrom(src => src.Subject.SubjectClass))
                .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher.Surname + " " + src.Teacher.Name + " " + src.Teacher.Patronymic));
            CreateMap<ClassRecordDto, ClassRecord>();

            CreateMap<Holiday, HolidayDto>();
            CreateMap<HolidayDto, Holiday>();
        }
    }
}
