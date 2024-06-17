using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StudCheck_back.Models
{
    public class Class
    {
        public int Id { get; set; }
        [Required]
        public string ClassName { get; set; }
        public ICollection<Student> Students { get; set; }
    }
}
