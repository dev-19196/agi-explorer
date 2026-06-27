using System.Text.Json;
using AgriExplorerApi.Data;
using AgriExplorerApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgriExplorerApi.Controllers;

public record ArticleDto(
    string Slug, string Title, string Description, string Category, string? Biome,
    short ReadingTimeMin, DateTime PublishedAt, string CoverImage, string? CoverCaption,
    string[] Tags, string[] RelatedSlugs, JsonElement Sections);

public record ArticleUpsertRequest(
    string Slug, string Title, string Description, string Category, string? Biome,
    short ReadingTimeMin, DateTime PublishedAt, string CoverImage, string? CoverCaption,
    string[] Tags, string[] RelatedSlugs, JsonElement Sections);

[ApiController]
[Route("api/articles")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _db;
    public ArticlesController(AppDbContext db) => _db = db;

    private static ArticleDto ToDto(Article a) => new(
        a.Slug, a.Title, a.Description, ToCategorySlug(a.Category), a.Biome?.ToString().ToLowerInvariant(),
        a.ReadingTimeMin, a.PublishedAt, a.CoverImage, a.CoverCaption,
        a.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        a.RelatedSlugs.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        JsonDocument.Parse(a.SectionsJson).RootElement);

    // Category đã được EF lưu đúng giá trị kebab-case (xem AppDbContext), nên
    // chỉ cần map enum -> string tại tầng entity property; helper này dự phòng
    // khi entity được nạp qua đường khác (không qua EF conversion).
    private static string ToCategorySlug(ArticleCategory c) => c switch
    {
        ArticleCategory.CanhTac => "canh-tac",
        ArticleCategory.SinhThai => "sinh-thai",
        ArticleCategory.ThuHoach => "thu-hoach",
        ArticleCategory.DongVat => "dong-vat",
        ArticleCategory.KhamPha => "kham-pha",
        _ => c.ToString().ToLowerInvariant(),
    };

    private static readonly Dictionary<string, ArticleCategory> CategoryFromSlug = new()
    {
        ["canh-tac"] = ArticleCategory.CanhTac,
        ["sinh-thai"] = ArticleCategory.SinhThai,
        ["thu-hoach"] = ArticleCategory.ThuHoach,
        ["dong-vat"] = ArticleCategory.DongVat,
        ["kham-pha"] = ArticleCategory.KhamPha,
    };

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleDto>>> GetAll(
        [FromQuery] string? category, [FromQuery] string? tag)
    {
        var query = _db.Articles.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category) && CategoryFromSlug.TryGetValue(category, out var cat))
            query = query.Where(a => a.Category == cat);

        var articles = await query.OrderByDescending(a => a.PublishedAt).ToListAsync();

        var result = articles.Select(ToDto);
        if (!string.IsNullOrWhiteSpace(tag))
            result = result.Where(a => a.Tags.Contains(tag));

        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ArticleDto>> GetBySlug(string slug)
    {
        var article = await _db.Articles.AsNoTracking().FirstOrDefaultAsync(a => a.Slug == slug);
        return article is null ? NotFound() : Ok(ToDto(article));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(ArticleUpsertRequest req)
    {
        if (!CategoryFromSlug.TryGetValue(req.Category, out var category))
            return BadRequest("category không hợp lệ.");

        Biome? biome = null;
        if (!string.IsNullOrWhiteSpace(req.Biome))
        {
            if (!Enum.TryParse<Biome>(req.Biome, true, out var b)) return BadRequest("biome không hợp lệ.");
            biome = b;
        }

        var existing = await _db.Articles.FindAsync(req.Slug);
        var sectionsJson = req.Sections.GetRawText();
        var tagsCsv = string.Join(',', req.Tags);
        var relatedCsv = string.Join(',', req.RelatedSlugs);

        if (existing is null)
        {
            _db.Articles.Add(new Article
            {
                Slug = req.Slug, Title = req.Title, Description = req.Description, Category = category,
                Biome = biome, ReadingTimeMin = req.ReadingTimeMin, PublishedAt = req.PublishedAt,
                CoverImage = req.CoverImage, CoverCaption = req.CoverCaption,
                Tags = tagsCsv, RelatedSlugs = relatedCsv, SectionsJson = sectionsJson,
            });
        }
        else
        {
            existing.Title = req.Title;
            existing.Description = req.Description;
            existing.Category = category;
            existing.Biome = biome;
            existing.ReadingTimeMin = req.ReadingTimeMin;
            existing.PublishedAt = req.PublishedAt;
            existing.CoverImage = req.CoverImage;
            existing.CoverCaption = req.CoverCaption;
            existing.Tags = tagsCsv;
            existing.RelatedSlugs = relatedCsv;
            existing.SectionsJson = sectionsJson;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{slug}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string slug)
    {
        var existing = await _db.Articles.FindAsync(slug);
        if (existing is null) return NotFound();
        _db.Articles.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record MediaDto(string Id, string Title, string Type, string Biome, string Aspect);
public record MediaUpsertRequest(string Id, string Title, string Type, string Biome, string Aspect);

[ApiController]
[Route("api/media")]
public class MediaController : ControllerBase
{
    private readonly AppDbContext _db;
    public MediaController(AppDbContext db) => _db = db;

    private static MediaDto ToDto(MediaItem m) => new(
        m.Id, m.Title, m.Type.ToString().ToLowerInvariant(),
        m.Biome.ToString().ToLowerInvariant(), m.Aspect.ToString().ToLowerInvariant());

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MediaDto>>> GetAll(
        [FromQuery] string? biome, [FromQuery] string? type)
    {
        var query = _db.MediaItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(biome) && Enum.TryParse<Biome>(biome, true, out var b))
            query = query.Where(m => m.Biome == b);

        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<MediaType>(type, true, out var t))
            query = query.Where(m => m.Type == t);

        var items = await query.ToListAsync();
        return Ok(items.Select(ToDto));
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Upsert(MediaUpsertRequest req)
    {
        if (!Enum.TryParse<MediaType>(req.Type, true, out var type) ||
            !Enum.TryParse<Biome>(req.Biome, true, out var biome) ||
            !Enum.TryParse<MediaAspect>(req.Aspect, true, out var aspect))
            return BadRequest("type/biome/aspect không hợp lệ.");

        var existing = await _db.MediaItems.FindAsync(req.Id);
        if (existing is null)
        {
            _db.MediaItems.Add(new MediaItem { Id = req.Id, Title = req.Title, Type = type, Biome = biome, Aspect = aspect });
        }
        else
        {
            existing.Title = req.Title;
            existing.Type = type;
            existing.Biome = biome;
            existing.Aspect = aspect;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _db.MediaItems.FindAsync(id);
        if (existing is null) return NotFound();
        _db.MediaItems.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
