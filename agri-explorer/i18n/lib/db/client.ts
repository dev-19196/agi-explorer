/**
 * lib/db/client.ts
 *
 * Client gọi sang AgriExplorerApi (.NET, MSSQL) — thay cho Supabase SDK.
 * CHỈ dùng trong `scripts/*.mts` (seed/sync nội dung), không import từ
 * `app/` hay `components/` — giữ đúng nguyên tắc cũ của 6b (build-time
 * sync, không runtime fetch từ browser/Server Component).
 *
 * Biến môi trường bắt buộc (đặt trong `.env.local`, xem `.env.example`):
 *   AGRI_API_URL       — base URL của .NET API, ví dụ http://localhost:5080
 *   AGRI_API_USERNAME  — username admin (để login lấy JWT khi cần ghi)
 *   AGRI_API_PASSWORD  — password admin
 */

function getApiUrl(): string {
  const url = process.env.AGRI_API_URL;
  if (!url) {
    throw new Error(
      "Thiếu AGRI_API_URL. Tạo file .env.local từ .env.example và điền URL " +
        "của AgriExplorerApi (.NET) trước khi chạy script seed/sync.",
    );
  }
  return url.replace(/\/+$/, "");
}

let cachedToken: string | null = null;

/** Login lấy JWT (chỉ cần cho các request ghi — content:seed). */
async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const username = process.env.AGRI_API_USERNAME;
  const password = process.env.AGRI_API_PASSWORD;
  if (!username || !password) {
    throw new Error("Thiếu AGRI_API_USERNAME hoặc AGRI_API_PASSWORD trong .env.local.");
  }

  const res = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`Đăng nhập AgriExplorerApi thất bại: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { token: string };
  cachedToken = data.token;
  return cachedToken;
}

/** GET — đọc dữ liệu, không cần token (endpoint public). */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET ${path} thất bại: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** POST upsert — cần JWT role admin. */
export async function apiPost(path: string, body: unknown): Promise<void> {
  const token = await getAuthToken();
  const res = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST ${path} thất bại: ${res.status} ${await res.text()}`);
  }
}
