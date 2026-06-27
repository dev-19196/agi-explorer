"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpecimenBadgeIcon, Eyebrow } from "@/components/admin/SpecimenChrome";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      router.replace("/admin/plants");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card"
      >
        <div className="biome-spectrum-bg h-1.5 w-full" />

        <div className="p-8">
          <SpecimenBadgeIcon size={52}>
            <Sprout className="size-6" strokeWidth={1.6} />
          </SpecimenBadgeIcon>

          <Eyebrow>Phòng lưu trữ</Eyebrow>
          <h1 className="mt-1 font-display text-2xl text-ink">Agri Explorer</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Đăng nhập để chỉnh sửa tiêu bản, bài viết và lịch nông vụ.
          </p>

          <label className="mt-6 mb-1.5 block text-sm font-medium text-ink">Tên đăng nhập</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />

          <label className="mt-4 mb-1.5 block text-sm font-medium text-ink">Mật khẩu</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="mt-4 rounded-[var(--radius-card)] border border-dashed border-honey-dark/40 bg-honey-soft px-3 py-2 text-sm text-honey-dark">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>
      </form>
    </div>
  );
}
