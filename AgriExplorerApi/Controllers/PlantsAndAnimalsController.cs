using AgriExplorerApi.Data;
using AgriExplorerApi.Dtos;
using AgriExplorerApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgriExplorerApi.Controllers;

public record PlantUpsertRequest(
    string Slug, string Name, string ScientificName, string Category, string Biome,
    string Country, string Tagline, System.Text.Json.JsonElement? Detail);

[ApiController]
[Route("api/plants")]
public class PlantsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PlantsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlantDto>>> GetAll([FromQuery] string? biome, [FromQuery] string? category)
    {
        var query = _db.Plants.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(biome) && Enum.TryParse<Biome>(biome, true, out var b))
            query = query.Where(p => p.Biome == b);

        if (!string.IsNullOrWhiteSpace(category) && Enum.TryParse<PlantCategory>(category, true, out var c))
            query = query.Where(p => p.Category == c);

        var plants = await query.ToListAsync();
        return Ok(plants.Select(p => p.ToDto()));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<PlantDto>> GetBySlug(string slug)
    {
        var plant = await _db.Plants.AsNoTracking().FirstOrDefaultAsync(p => p.Slug == slug);
        return plant is null ? NotFound() : Ok(plant.ToDto());
    }

    /// <summary>Ghi dữ liệu chỉ cho role admin (giữ tinh thần "deny by default" như RLS cũ).</summary>
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(PlantUpsertRequest req)
    {
        if (!Enum.TryParse<PlantCategory>(req.Category, true, out var category) ||
            !Enum.TryParse<Biome>(req.Biome, true, out var biome))
            return BadRequest("category hoặc biome không hợp lệ.");

        var existing = await _db.Plants.FindAsync(req.Slug);
        var detailJson = req.Detail?.GetRawText();

        if (existing is null)
        {
            _db.Plants.Add(new Plant
            {
                Slug = req.Slug, Name = req.Name, ScientificName = req.ScientificName,
                Category = category, Biome = biome, Country = req.Country, Tagline = req.Tagline,
                DetailJson = detailJson,
            });
        }
        else
        {
            existing.Name = req.Name;
            existing.ScientificName = req.ScientificName;
            existing.Category = category;
            existing.Biome = biome;
            existing.Country = req.Country;
            existing.Tagline = req.Tagline;
            existing.DetailJson = detailJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{slug}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string slug)
    {
        var existing = await _db.Plants.FindAsync(slug);
        if (existing is null) return NotFound();
        _db.Plants.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record AnimalUpsertRequest(
    string Slug, string Name, string ScientificName, string Biome,
    string Country, string Tagline, System.Text.Json.JsonElement? Detail);

[ApiController]
[Route("api/animals")]
public class AnimalsController : ControllerBase
{
    private readonly AppDbContext _db;
    public AnimalsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnimalDto>>> GetAll([FromQuery] string? biome)
    {
        var query = _db.Animals.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(biome) && Enum.TryParse<Biome>(biome, true, out var b))
            query = query.Where(a => a.Biome == b);

        var animals = await query.ToListAsync();
        return Ok(animals.Select(a => a.ToDto()));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<AnimalDto>> GetBySlug(string slug)
    {
        var animal = await _db.Animals.AsNoTracking().FirstOrDefaultAsync(a => a.Slug == slug);
        return animal is null ? NotFound() : Ok(animal.ToDto());
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(AnimalUpsertRequest req)
    {
        if (!Enum.TryParse<Biome>(req.Biome, true, out var biome))
            return BadRequest("biome không hợp lệ.");

        var existing = await _db.Animals.FindAsync(req.Slug);
        var detailJson = req.Detail?.GetRawText();

        if (existing is null)
        {
            _db.Animals.Add(new Animal
            {
                Slug = req.Slug, Name = req.Name, ScientificName = req.ScientificName,
                Biome = biome, Country = req.Country, Tagline = req.Tagline, DetailJson = detailJson,
            });
        }
        else
        {
            existing.Name = req.Name;
            existing.ScientificName = req.ScientificName;
            existing.Biome = biome;
            existing.Country = req.Country;
            existing.Tagline = req.Tagline;
            existing.DetailJson = detailJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{slug}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string slug)
    {
        var existing = await _db.Animals.FindAsync(slug);
        if (existing is null) return NotFound();
        _db.Animals.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
