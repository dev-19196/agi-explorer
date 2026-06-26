"use client";

import { Link } from "@/i18n/Link";
import { Fragment, useMemo, useState } from "react";
import { Sprout, Wheat, AlertTriangle, Info, ChevronDown } from "lucide-react";
import type { SeasonalEvent, WeatherAlert, Plant, Region } from "@/types/content";
import { BIOMES } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/use-dictionary";

const MONTH_LABELS = [
  "Th1", "Th2", "Th3", "Th4", "Th5", "Th6",
  "Th7", "Th8", "Th9", "Th10", "Th11", "Th12",
];

/** Trả về danh sách tháng (1-12) nằm trong một MonthRange, có xử lý wrap-around qua năm. */
function monthsInRange(start: number, end: number): number[] {
  if (start <= end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  // Vòng qua năm mới, ví dụ 11 -> 2 nghĩa là [11, 12, 1, 2]
  const tail = Array.from({ length: 12 - start + 1 }, (_, i) => start + i);
  const head = Array.from({ length: end }, (_, i) => i + 1);
  return [...tail, ...head];
}

interface CalendarRow {
  event: SeasonalEvent;
  plant: Plant;
  plantingSet: Set<number>;
  harvestSet: Set<number>;
}

const LEVEL_STYLE: Record<WeatherAlert["level"], { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "border-pine/30 bg-pine-soft text-pine-dark" },
  caution: { icon: AlertTriangle, className: "border-honey/40 bg-honey-soft text-honey-dark" },
  warning: { icon: AlertTriangle, className: "border-red-300 bg-red-50 text-red-700" },
};

export function AgriculturalCalendar({
  events,
  plants,
  alerts,
  region,
}: {
  events: SeasonalEvent[];
  plants: Plant[];
  alerts: WeatherAlert[];
  region: Region;
}) {
  const dict = useDictionary();
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows: CalendarRow[] = useMemo(() => {
    return events
      .map((event) => {
        const plant = plants.find((p) => p.slug === event.plantSlug);
        if (!plant) return null;
        return {
          event,
          plant,
          plantingSet: new Set(monthsInRange(event.plantingMonths.start, event.plantingMonths.end)),
          harvestSet: new Set(monthsInRange(event.harvestMonths.start, event.harvestMonths.end)),
        };
      })
      .filter((r): r is CalendarRow => r !== null);
  }, [events, plants]);

  const regionAlerts = useMemo(
    () => alerts.filter((a) => a.region === region),
    [alerts, region]
  );

  if (rows.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-line p-8 text-center text-sm text-ink-soft">
        {dict.calendar.noData}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bảng lịch 12 tháng */}
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-canvas-soft">
              <th className="sticky left-0 z-10 bg-canvas-soft p-3 text-left font-medium text-ink-soft">
                {dict.calendar.plantColumn}
              </th>
              {MONTH_LABELS.map((m) => (
                <th key={m} className="p-2 text-center text-xs font-medium text-ink-faint">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ event, plant, plantingSet, harvestSet }) => {
              const biome = BIOMES.find((b) => b.id === plant.biome)!;
              const isOpen = expanded === event.id;
              return (
                <Fragment key={event.id}>
                  <tr
                    onClick={() => setExpanded(isOpen ? null : event.id)}
                    className="cursor-pointer border-b border-line last:border-0 hover:bg-canvas-soft/60"
                  >
                    <td className="sticky left-0 z-10 bg-canvas p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: biome.colorVar }}
                        />
                        <div>
                          <p className="font-medium text-ink">{plant.name}</p>
                          <p className="font-display text-xs italic text-ink-faint">
                            {plant.scientificName}
                          </p>
                        </div>
                        <ChevronDown
                          className={`size-3.5 text-ink-faint transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
                    </td>
                    {MONTH_LABELS.map((_, i) => {
                      const month = i + 1;
                      const isPlanting = plantingSet.has(month);
                      const isHarvest = harvestSet.has(month);
                      return (
                        <td key={month} className="p-1.5 text-center">
                          {isHarvest ? (
                            <span
                              className="mx-auto flex size-6 items-center justify-center rounded-md text-white"
                              style={{ backgroundColor: biome.colorVar }}
                              title={dict.calendar.harvestLabel}
                            >
                              <Wheat className="size-3.5" strokeWidth={2} />
                            </span>
                          ) : isPlanting ? (
                            <span
                              className="mx-auto flex size-6 items-center justify-center rounded-md border-2"
                              style={{ borderColor: biome.colorVar, color: biome.colorVar }}
                              title={dict.calendar.plantingLabel}
                            >
                              <Sprout className="size-3.5" strokeWidth={2.2} />
                            </span>
                          ) : (
                            <span className="mx-auto block size-6 rounded-md bg-canvas-soft/60" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-line bg-canvas-soft/50">
                      <td colSpan={13} className="p-4">
                        <div className="flex flex-wrap items-start gap-4">
                          <Badge variant="biome" dotColor={biome.colorVar}>
                            {biome.name}
                          </Badge>
                          <p className="max-w-2xl flex-1 text-sm text-ink-soft">
                            {event.note ?? dict.calendar.noNote}
                          </p>
                          <Link
                            href={`/plants/${plant.slug}`}
                            className="text-sm font-medium text-pine underline-offset-2 hover:underline"
                          >
                            {dict.calendar.viewPlantDetail}
                          </Link>
                        </div>
                        {plant.detail?.growthStages && plant.detail.growthStages.length > 0 && (
                          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {plant.detail.growthStages.map((stage) => (
                              <div
                                key={stage.label}
                                className="rounded-[var(--radius-card)] border border-line bg-canvas p-3"
                              >
                                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                                  {stage.duration}
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-ink">{stage.label}</p>
                                <p className="mt-1 text-xs text-ink-soft">{stage.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Chú giải */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="flex size-5 items-center justify-center rounded-md border-2 border-pine text-pine">
            <Sprout className="size-3" />
          </span>
          {dict.calendar.plantingLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex size-5 items-center justify-center rounded-md bg-pine text-white">
            <Wheat className="size-3" />
          </span>
          {dict.calendar.harvestLabel}
        </span>
        <span>{dict.calendar.legendHint}</span>
      </div>

      {/* Cảnh báo thời tiết theo vùng */}
      {regionAlerts.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
            {dict.calendar.weatherAlertsTitle}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {regionAlerts.map((alert) => {
              const style = LEVEL_STYLE[alert.level];
              const Icon = style.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex gap-3 rounded-[var(--radius-card)] border p-3 ${style.className}`}
                >
                  <Icon className="size-4.5 shrink-0" strokeWidth={1.8} />
                  <div>
                    <p className="text-sm font-medium">
                      {alert.title}{" "}
                      <span className="font-normal opacity-70">
                        (Th{alert.months[0]}–Th{alert.months[alert.months.length - 1]})
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs opacity-90">{alert.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
