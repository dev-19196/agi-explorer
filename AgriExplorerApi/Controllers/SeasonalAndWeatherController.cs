using AgriExplorerApi.Data;
using AgriExplorerApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgriExplorerApi.Controllers;

public record SeasonalEventDto(
    string Id, string PlantSlug, string Region, short PlantingStart, short PlantingEnd,
    short HarvestStart, short HarvestEnd, string? Note);

public record SeasonalEventUpsertRequest(
    string Id, string PlantSlug, string Region, short PlantingStart, short PlantingEnd,
    short HarvestStart, short HarvestEnd, string? Note);

[ApiController]
[Route("api/seasonal-events")]
public class SeasonalEventsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SeasonalEventsController(AppDbContext db) => _db = db;

    private static SeasonalEventDto ToDto(SeasonalEvent s) => new(
        s.Id, s.PlantSlug, s.Region.ToString().ToLowerInvariant(),
        s.PlantingStart, s.PlantingEnd, s.HarvestStart, s.HarvestEnd, s.Note);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeasonalEventDto>>> GetAll(
        [FromQuery] string? region, [FromQuery] int? month)
    {
        var query = _db.SeasonalEvents.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(region) && Enum.TryParse<Region>(region, true, out var r))
            query = query.Where(s => s.Region == r);

        if (month is >= 1 and <= 12)
            query = query.Where(s =>
                (s.PlantingStart <= month && month <= s.PlantingEnd) ||
                (s.HarvestStart <= month && month <= s.HarvestEnd));

        var events = await query.ToListAsync();
        return Ok(events.Select(ToDto));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(SeasonalEventUpsertRequest req)
    {
        if (!Enum.TryParse<Region>(req.Region, true, out var region))
            return BadRequest("region không hợp lệ.");

        var existing = await _db.SeasonalEvents.FindAsync(req.Id);
        if (existing is null)
        {
            _db.SeasonalEvents.Add(new SeasonalEvent
            {
                Id = req.Id, PlantSlug = req.PlantSlug, Region = region,
                PlantingStart = req.PlantingStart, PlantingEnd = req.PlantingEnd,
                HarvestStart = req.HarvestStart, HarvestEnd = req.HarvestEnd, Note = req.Note,
            });
        }
        else
        {
            existing.PlantSlug = req.PlantSlug;
            existing.Region = region;
            existing.PlantingStart = req.PlantingStart;
            existing.PlantingEnd = req.PlantingEnd;
            existing.HarvestStart = req.HarvestStart;
            existing.HarvestEnd = req.HarvestEnd;
            existing.Note = req.Note;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _db.SeasonalEvents.FindAsync(id);
        if (existing is null) return NotFound();
        _db.SeasonalEvents.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record WeatherAlertDto(
    string Id, string Biome, string Region, int[] Months, string Level, string Title, string Description);

public record WeatherAlertUpsertRequest(
    string Id, string Biome, string Region, int[] Months, string Level, string Title, string Description);

[ApiController]
[Route("api/weather-alerts")]
public class WeatherAlertsController : ControllerBase
{
    private readonly AppDbContext _db;
    public WeatherAlertsController(AppDbContext db) => _db = db;

    private static WeatherAlertDto ToDto(WeatherAlert w) => new(
        w.Id, w.Biome.ToString().ToLowerInvariant(), w.Region.ToString().ToLowerInvariant(),
        w.Months.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToArray(),
        w.Level.ToString().ToLowerInvariant(), w.Title, w.Description);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WeatherAlertDto>>> GetAll([FromQuery] string? region)
    {
        var query = _db.WeatherAlerts.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(region) && Enum.TryParse<Region>(region, true, out var r))
            query = query.Where(w => w.Region == r);

        var alerts = await query.ToListAsync();
        return Ok(alerts.Select(ToDto));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(WeatherAlertUpsertRequest req)
    {
        if (!Enum.TryParse<Biome>(req.Biome, true, out var biome) ||
            !Enum.TryParse<Region>(req.Region, true, out var region) ||
            !Enum.TryParse<WeatherAlertLevel>(req.Level, true, out var level))
            return BadRequest("biome/region/level không hợp lệ.");

        var monthsCsv = string.Join(',', req.Months);
        var existing = await _db.WeatherAlerts.FindAsync(req.Id);

        if (existing is null)
        {
            _db.WeatherAlerts.Add(new WeatherAlert
            {
                Id = req.Id, Biome = biome, Region = region, Months = monthsCsv,
                Level = level, Title = req.Title, Description = req.Description,
            });
        }
        else
        {
            existing.Biome = biome;
            existing.Region = region;
            existing.Months = monthsCsv;
            existing.Level = level;
            existing.Title = req.Title;
            existing.Description = req.Description;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _db.WeatherAlerts.FindAsync(id);
        if (existing is null) return NotFound();
        _db.WeatherAlerts.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
