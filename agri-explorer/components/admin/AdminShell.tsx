"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sprout, LogOut, Leaf, PawPrint, BookOpen, Images, CalendarDays, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecimenBadgeIcon } from "@/components/admin/SpecimenChrome";
import { getCurrentUser, isAuthenticated, logout } from "@/lib/api/auth";

const NAV_ITEMS = [
  { href: "/admin/plants", label: "Thực vật", icon: Leaf },
  { href: "/admin/animals", label: "Động vật", icon: PawPrint },
  { href: "/admin/articles", label: "Bài viết", icon: BookOpen },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/seasonal-events", label: "Lịch nông vụ", icon: CalendarDays },
  { href: "/admin/weather-alerts", label: "Cảnh báo thời tiết", icon: CloudRain },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // `isAuthenticated()` đọc localStorage — không tồn tại lúc SSR, nên phải
  // chờ mount ở client rồi mới tính, tránh hydration mismatch (server luôn
  // render "chưa đăng nhập", client có thể khác ngay frame đầu tiên).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-detection pattern hợp lệ để né hydration mismatch (server không có localStorage)
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname === "/admin/login") return;
    if (!isAuthenticated()) {
      router.replace("/admin/login");
    }
  }, [mounted, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!mounted || !isAuthenticated()) return null;

  const user = getCurrentUser();

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-canvas-soft">
        <div className="biome-spectrum-bg h-1 w-full" />

        <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
          <SpecimenBadgeIcon>
            <Sprout className="size-5" strokeWidth={1.6} />
          </SpecimenBadgeIcon>
          <div>
            <span className="block font-display text-lg leading-tight text-ink">Agri Explorer</span>
            <span className="block font-display text-xs italic leading-tight text-ink-faint">
              Phòng lưu trữ dữ liệu
            </span>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-2.5 rounded-[var(--radius-card)] bg-pine px-3 py-2.5 text-sm font-medium text-canvas"
                    : "flex items-center gap-2.5 rounded-[var(--radius-card)] px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-pine-soft hover:text-pine"
                }
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-dashed border-line px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Đăng nhập với
          </p>
          <p className="mt-0.5 font-display text-sm text-ink">{user?.username ?? "—"}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 -ml-3 px-3 text-honey-dark hover:bg-honey-soft hover:text-honey-dark"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
          >
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      <main className="flex-1 px-10 py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
