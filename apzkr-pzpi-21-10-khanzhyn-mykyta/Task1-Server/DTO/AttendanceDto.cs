using StudCheck_back.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudCheck_back.DTO
{
    public class AttendanceDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public DateTime CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string Status { get; set; }
    }
}
