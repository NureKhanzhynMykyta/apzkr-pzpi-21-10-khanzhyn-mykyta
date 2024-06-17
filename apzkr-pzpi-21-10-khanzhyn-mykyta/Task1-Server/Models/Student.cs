using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudCheck_back.Models
{
    public class Student
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        public string Patronymic { get; set; }
        public string? Number { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
        public DateTime BirthDate { get; set; }
        [Required]
        public string NfcId { get; set; }
        public int? ClassId { get; set; }
        [ForeignKey("ClassId")]
        public Class? Class { get; set; }
        public ICollection<ClassRecord> ClassRecords { get; set; }
        public ICollection<Attendance> Attendances { get; set; }
    }
}
