namespace AgriExplorerApi.Entities;

public class Plant
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ScientificName { get; set; } = string.Empty;
    public PlantCategory Category { get; set; }
    public Biome Biome { get; set; }
    public string Country { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;

    /// <summary>
    /// Khớp với PlantDetail (FE types/content.ts). MSSQL không có jsonb native
    /// như Postgres -> lưu nvarchar(max), serialize/deserialize JSON ở tầng DTO.
    /// </summary>
    public string? DetailJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<SeasonalEvent> SeasonalEvents { get; set; } = new List<SeasonalEvent>();
}

public class Animal
{
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ScientificName { get; set; } = string.Empty;
    public Biome Biome { get; set; }
    public string Country { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;

    /// <summary>Khớp với AnimalDetail (FE types/content.ts), lưu JSON string.</summary>
    public string? DetailJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
