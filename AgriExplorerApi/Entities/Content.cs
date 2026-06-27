namespace AgriExplorerApi.Entities;

public class MediaItem
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public MediaType Type { get; set; }
    public Biome Biome { get; set; }
    public MediaAspect Aspect { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Article
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ArticleCategory Category { get; set; }
    public Biome? Biome { get; set; }
    public short ReadingTimeMin { get; set; }
    public DateTime PublishedAt { get; set; }
    public string CoverImage { get; set; } = string.Empty;
    public string? CoverCaption { get; set; }

    /// <summary>Lưu dạng "a,b,c" -> tách bằng "," (MSSQL không có text[] native).</summary>
    public string Tags { get; set; } = string.Empty;
    public string RelatedSlugs { get; set; } = string.Empty;

    /// <summary>Khớp ArticleSection[] (FE), lưu JSON string.</summary>
    public string SectionsJson { get; set; } = "[]";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class SeasonalEvent
{
    public string Id { get; set; } = string.Empty;
    public string PlantSlug { get; set; } = string.Empty;
    public Plant? Plant { get; set; }
    public Region Region { get; set; }

    public short PlantingStart { get; set; }
    public short PlantingEnd { get; set; }
    public short HarvestStart { get; set; }
    public short HarvestEnd { get; set; }
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class WeatherAlert
{
    public string Id { get; set; } = string.Empty;
    public Biome Biome { get; set; }
    public Region Region { get; set; }

    /// <summary>Lưu dạng "1,2,3" -> tách bằng "," (MSSQL không có smallint[] native).</summary>
    public string Months { get; set; } = string.Empty;
    public WeatherAlertLevel Level { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
