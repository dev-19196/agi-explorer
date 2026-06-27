namespace AgriExplorerApi.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "admin"; // mở rộng "editor"/"user" khi làm UGC (Mục 5)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
