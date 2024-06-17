using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.DTO
{
    public class SubjectDto
    {
        public int Id { get; set; }
        [Required]
        public string SubjectName { get; set; }
        public string SubjectClass { get; set; }
    }
}
