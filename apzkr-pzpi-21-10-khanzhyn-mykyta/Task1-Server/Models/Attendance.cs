using System.ComponentModel.DataAnnotations.Schema;

namespace StudCheck_back.Models
{
    public class Attendance
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; }
    }
}
