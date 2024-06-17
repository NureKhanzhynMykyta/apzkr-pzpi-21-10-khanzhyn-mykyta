namespace StudCheck_back.DTO
{
    public class AttendanceStatisticsDto
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public int TotalDays { get; set; }
        public int PresentDays { get; set; }
        public int AbsentDays { get; set; }
        public double AttendancePercentage { get; set; }
    }
}
