using System.Text.Json;
using AgriExplorerApi.Entities;

namespace AgriExplorerApi.Dtos;

public record PlantDto(
    string Slug,
    string Name,
    string ScientificName,
    string Category,
    string Biome,
    string Country,
    string Tagline,
    JsonElement? Detail);

public record AnimalDto(
    string Slug,
    string Name,
    string ScientificName,
    string Biome,
    string Country,
    string Tagline,
    JsonElement? Detail);

public static class ContentMapper
{
    private static JsonElement? ParseJsonOrNull(string? json)
        => string.IsNullOrWhiteSpace(json) ? null : JsonDocument.Parse(json).RootElement;

    // Enum C# là PascalCase ("Fruit") nhưng FE (types/content.ts) dùng lowercase
    // ("fruit") -> hạ chữ khi trả ra DTO, KHÔNG đổi enum trong DB.
    public static PlantDto ToDto(this Plant p) => new(
        p.Slug, p.Name, p.ScientificName, p.Category.ToString().ToLowerInvariant(), p.Biome.ToString().ToLowerInvariant(),
        p.Country, p.Tagline, ParseJsonOrNull(p.DetailJson));

    public static AnimalDto ToDto(this Animal a) => new(
        a.Slug, a.Name, a.ScientificName, a.Biome.ToString().ToLowerInvariant(),
        a.Country, a.Tagline, ParseJsonOrNull(a.DetailJson));
}
