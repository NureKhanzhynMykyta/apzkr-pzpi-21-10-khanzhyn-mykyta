using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.Models
{
    public class Subject
    {
        public int Id { get; set; }
        [Required]
        public string SubjectName { get; set; }
        public string SubjectClass { get; set; }
        public ICollection<ClassRecord> ClassRecords { get; set; }
    }
}
