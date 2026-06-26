"use client";

import { useEffect } from "react";
import { useUserActivity, type HistoryItem, type SpeciesKind } from "@/lib/hooks/useUserActivity";

interface HistoryTrackerProps {
  slug: string;
  kind: SpeciesKind;
  name: string;
  scientificName: string;
  biome: string;
  category?: string;
}

/**
 * Component vô hình — mount vào trang chi tiết để tự động
 * ghi lịch sử xem vào localStorage. Không render gì ra UI.
 */
export function HistoryTracker(props: HistoryTrackerProps) {
  const { addHistory } = useUserActivity();

  useEffect(() => {
    addHistory(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.slug, props.kind]);

  return null;
}
