# AgriExplorerApi — Backend .NET 8 (Flat Architecture, MSSQL)

## Setup

1. Cài MSSQL Server (Docker nhanh nhất):
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
     -p 1433:1433 --name agri-mssql -d mcr.microsoft.com/mssql/server:2022-latest
   ```
2. Sửa `appsettings.json` (hoặc `appsettings.Development.json` / user-secrets):
   - `ConnectionStrings:Default`
   - `Jwt:SigningKey` — chuỗi random ≥ 32 ký tự
   - `SeedAdmin:Username` / `SeedAdmin:Password` — tài khoản admin đầu tiên
   - `Cors:AllowedOrigins` — domain của FE Next.js
3. Restore + tạo migration đầu tiên (máy có mạng tới nuget.org):
   ```bash
   dotnet restore
   dotnet tool install --global dotnet-ef   # nếu chưa có
   dotnet ef migrations add Init
   ```
4. Chạy:
   ```bash
   dotnet run
   ```
   App tự `db.Database.Migrate()` lúc start (xem `Program.cs`) + seed 1 admin user
   nếu bảng `Users` rỗng — không cần chạy `dotnet ef database update` tay.

## Đăng nhập lấy JWT

```
POST /api/auth/login
{ "username": "admin", "password": "<SeedAdmin:Password>" }
→ { "token": "...", "username": "admin", "role": "admin" }
```

Gọi các endpoint ghi (`POST /api/plants`, `/api/animals`, ...) kèm
`Authorization: Bearer <token>`.

## Endpoint đọc (public, không cần token)

`GET /api/plants`, `/api/plants/{slug}`, `/api/animals`, `/api/animals/{slug}`,
`/api/articles`, `/api/media`, `/api/seasonal-events`, `/api/weather-alerts`.

## Ghi chú quan trọng — sandbox tạo project này KHÔNG build được

Mạng sandbox không cho phép truy cập `api.nuget.org`, nên **chưa restore/build/test
được project này**. Cần chạy `dotnet restore && dotnet build` trên máy bạn (có mạng
thật) để xác nhận biên dịch sạch trước khi deploy. Logic đã được viết và review kỹ
nhưng chưa qua compiler — báo lại nếu gặp lỗi build, sẽ sửa ngay.
