using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.DTO
{
    public class EditTeacherDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public string Patronymic { get; set; }
        [Phone]
        public string? Number { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
