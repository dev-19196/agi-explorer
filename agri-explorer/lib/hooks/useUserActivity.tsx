"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpeciesKind = "plant" | "animal";

export interface FavouriteItem {
  slug: string;
  kind: SpeciesKind;
  name: string;
  scientificName: string;
  biome: string;
  addedAt: number; // timestamp
}

export interface HistoryItem {
  slug: string;
  kind: SpeciesKind;
  name: string;
  scientificName: string;
  biome: string;
  category?: string; // plants only
  viewedAt: number;
}

export interface QuizStats {
  totalPlayed: number;
  highScore: number; // max score trong 1 lần chơi
  lastScore: number;
  badges: string[]; // e.g. ["first_play", "perfect_score", "played_5_times"]
}

export interface UserActivity {
  favourites: FavouriteItem[];
  history: HistoryItem[]; // max 50 items, LIFO
  quiz: QuizStats;
}

const DEFAULT: UserActivity = {
  favourites: [],
  history: [],
  quiz: { totalPlayed: 0, highScore: 0, lastScore: 0, badges: [] },
};

const STORAGE_KEY = "agri_user_activity";
const MAX_HISTORY = 50;

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserActivityContextValue {
  activity: UserActivity;
  hydrated: boolean;
  // Favourites
  toggleFavourite: (item: Omit<FavouriteItem, "addedAt">) => void;
  isFavourite: (slug: string, kind: SpeciesKind) => boolean;
  // History
  addHistory: (item: Omit<HistoryItem, "viewedAt">) => void;
  // Quiz
  recordQuizResult: (score: number, total: number) => string[]; // returns new badges
}

const Ctx = createContext<UserActivityContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserActivityProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<UserActivity>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate từ localStorage một lần duy nhất khi mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserActivity>;
        setActivity({ ...DEFAULT, ...parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist mỗi khi activity thay đổi (sau hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
    } catch {
      // ignore
    }
  }, [activity, hydrated]);

  // ── Favourites ──────────────────────────────────────────────────────────────

  const isFavourite = useCallback(
    (slug: string, kind: SpeciesKind) =>
      activity.favourites.some((f) => f.slug === slug && f.kind === kind),
    [activity.favourites]
  );

  const toggleFavourite = useCallback(
    (item: Omit<FavouriteItem, "addedAt">) => {
      setActivity((prev) => {
        const exists = prev.favourites.some(
          (f) => f.slug === item.slug && f.kind === item.kind
        );
        return {
          ...prev,
          favourites: exists
            ? prev.favourites.filter(
                (f) => !(f.slug === item.slug && f.kind === item.kind)
              )
            : [{ ...item, addedAt: Date.now() }, ...prev.favourites],
        };
      });
    },
    []
  );

  // ── History ─────────────────────────────────────────────────────────────────

  const addHistory = useCallback((item: Omit<HistoryItem, "viewedAt">) => {
    setActivity((prev) => {
      // Loại bỏ entry cũ cùng slug+kind, đẩy entry mới lên đầu
      const filtered = prev.history.filter(
        (h) => !(h.slug === item.slug && h.kind === item.kind)
      );
      const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
        0,
        MAX_HISTORY
      );
      return { ...prev, history: updated };
    });
  }, []);

  // ── Quiz ────────────────────────────────────────────────────────────────────

  const recordQuizResult = useCallback(
    (score: number, total: number): string[] => {
      const newBadges: string[] = [];
      setActivity((prev) => {
        const q = prev.quiz;
        const nextPlayed = q.totalPlayed + 1;
        const nextHigh = Math.max(q.highScore, score);

        // Badge logic
        if (q.totalPlayed === 0) newBadges.push("first_play");
        if (score === total) newBadges.push("perfect_score");
        if (nextPlayed === 5 && !q.badges.includes("played_5_times"))
          newBadges.push("played_5_times");
        if (nextPlayed === 10 && !q.badges.includes("played_10_times"))
          newBadges.push("played_10_times");

        const allBadges = [...new Set([...q.badges, ...newBadges])];

        return {
          ...prev,
          quiz: {
            totalPlayed: nextPlayed,
            highScore: nextHigh,
            lastScore: score,
            badges: allBadges,
          },
        };
      });
      return newBadges;
    },
    []
  );

  return (
    <Ctx.Provider
      value={{
        activity,
        hydrated,
        toggleFavourite,
        isFavourite,
        addHistory,
        recordQuizResult,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserActivity() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useUserActivity must be used inside <UserActivityProvider>");
  return ctx;
}
