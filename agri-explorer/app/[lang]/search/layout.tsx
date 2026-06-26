import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-canvas-deep" />
          <div className="mt-6 h-11 w-full max-w-xl animate-pulse rounded-[var(--radius-card)] bg-canvas-deep" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
