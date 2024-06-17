using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.DTO
{
    public class EditStudentDto
    {
        public int Id { get; set; }
        [Phone]
        public string? Number { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string? CurrentPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
