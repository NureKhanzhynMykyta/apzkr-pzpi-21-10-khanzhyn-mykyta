using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.DTO
{
    public class ClassDto
    {
        public int Id { get; set; }
        [Required]
        public string ClassName { get; set; }
    }
}
