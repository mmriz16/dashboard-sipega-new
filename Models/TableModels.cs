using System.Collections.Generic;

namespace DashboardSipega.Models
{
    public class TableCell
    {
        public string Text { get; set; } = "";
        public string Type { get; set; } = "text"; // "text", "badge", "action"
        public string BadgeClass { get; set; } = ""; // "draft", "verified", "rejected", "progress"
    }

    public class TableViewModel
    {
        public List<string> Headers { get; set; } = new();
        public List<List<TableCell>> Rows { get; set; } = new();
        public bool ShowCheckbox { get; set; } = true;
    }
}
