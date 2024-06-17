using StudCheck_back.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.DTO
{
    public class ClassRecordDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string SubjectClass { get; set; }
        public int? TeacherId { get; set; }
        public string TeacherName { get; set; }
        public float Grade { get; set; }
        [Required]
        [RegularExpression("^(ПР|ТР|ДР|КР)$", ErrorMessage = "GradeType must be one of the following: ПР, ТР, ДР, КР")]
        public string GradeType { get; set; }
        public DateTime GradeDate { get; set; }
    }
}
