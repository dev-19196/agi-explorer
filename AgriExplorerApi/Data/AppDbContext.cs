using AgriExplorerApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgriExplorerApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Plant> Plants => Set<Plant>();
    public DbSet<Animal> Animals => Set<Animal>();
    public DbSet<MediaItem> MediaItems => Set<MediaItem>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<SeasonalEvent> SeasonalEvents => Set<SeasonalEvent>();
    public DbSet<WeatherAlert> WeatherAlerts => Set<WeatherAlert>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // ── Plant ──────────────────────────────────────────────────────────
        b.Entity<Plant>(e =>
        {
            e.HasKey(p => p.Slug);
            e.Property(p => p.Category).HasConversion<string>().HasMaxLength(20);
            e.Property(p => p.Biome).HasConversion<string>().HasMaxLength(20);
            e.Property(p => p.DetailJson).HasColumnType("nvarchar(max)");
            e.HasIndex(p => p.Biome);
            e.HasIndex(p => p.Category);
        });

        // ── Animal ─────────────────────────────────────────────────────────
        b.Entity<Animal>(e =>
        {
            e.HasKey(a => a.Slug);
            e.Property(a => a.Biome).HasConversion<string>().HasMaxLength(20);
            e.Property(a => a.DetailJson).HasColumnType("nvarchar(max)");
            e.HasIndex(a => a.Biome);
        });

        // ── MediaItem ──────────────────────────────────────────────────────
        b.Entity<MediaItem>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Type).HasConversion<string>().HasMaxLength(20);
            e.Property(m => m.Biome).HasConversion<string>().HasMaxLength(20);
            e.Property(m => m.Aspect).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(m => m.Biome);
            e.HasIndex(m => m.Type);
        });

        // ── Article ────────────────────────────────────────────────────────
        // ArticleCategory: giữ đúng giá trị kebab-case cũ ("canh-tac"...) để FE
        // không phải đổi union type trong types/content.ts.
        var articleCategoryToString = new Dictionary<ArticleCategory, string>
        {
            [ArticleCategory.CanhTac] = "canh-tac",
            [ArticleCategory.SinhThai] = "sinh-thai",
            [ArticleCategory.ThuHoach] = "thu-hoach",
            [ArticleCategory.DongVat] = "dong-vat",
            [ArticleCategory.KhamPha] = "kham-pha",
        };
        var stringToArticleCategory = articleCategoryToString.ToDictionary(kv => kv.Value, kv => kv.Key);

        b.Entity<Article>(e =>
        {
            e.HasKey(a => a.Slug);
            e.Property(a => a.Category)
                .HasConversion(
                    v => articleCategoryToString[v],
                    v => stringToArticleCategory[v])
                .HasMaxLength(20);
            e.Property(a => a.Biome).HasConversion<string>().HasMaxLength(20);
            e.Property(a => a.SectionsJson).HasColumnType("nvarchar(max)");
            e.Property(a => a.Tags).HasColumnType("nvarchar(max)");
            e.Property(a => a.RelatedSlugs).HasColumnType("nvarchar(max)");
            e.HasIndex(a => a.Category);
            e.HasIndex(a => a.PublishedAt);
        });

        // ── SeasonalEvent ──────────────────────────────────────────────────
        b.Entity<SeasonalEvent>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Region).HasConversion<string>().HasMaxLength(10);
            e.HasOne(s => s.Plant)
                .WithMany(p => p.SeasonalEvents)
                .HasForeignKey(s => s.PlantSlug)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(s => s.PlantSlug);
            e.HasIndex(s => s.Region);
            e.ToTable(t => t.HasCheckConstraint("CK_SeasonalEvent_PlantingStart", "[PlantingStart] BETWEEN 1 AND 12"));
            e.ToTable(t => t.HasCheckConstraint("CK_SeasonalEvent_PlantingEnd", "[PlantingEnd] BETWEEN 1 AND 12"));
            e.ToTable(t => t.HasCheckConstraint("CK_SeasonalEvent_HarvestStart", "[HarvestStart] BETWEEN 1 AND 12"));
            e.ToTable(t => t.HasCheckConstraint("CK_SeasonalEvent_HarvestEnd", "[HarvestEnd] BETWEEN 1 AND 12"));
        });

        // ── WeatherAlert ───────────────────────────────────────────────────
        b.Entity<WeatherAlert>(e =>
        {
            e.HasKey(w => w.Id);
            e.Property(w => w.Biome).HasConversion<string>().HasMaxLength(20);
            e.Property(w => w.Region).HasConversion<string>().HasMaxLength(10);
            e.Property(w => w.Level).HasConversion<string>().HasMaxLength(10);
            e.HasIndex(w => w.Region);
            e.HasIndex(w => w.Biome);
        });

        // ── AppUser ────────────────────────────────────────────────────────
        b.Entity<AppUser>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Username).IsUnique();
        });
    }
}
