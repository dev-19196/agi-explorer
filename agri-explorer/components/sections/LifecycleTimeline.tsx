import type { LifecycleStage } from "@/types/content";

export function LifecycleTimeline({ stages }: { stages: LifecycleStage[] }) {
  return (
    <ol className="relative space-y-6 border-l border-line pl-6">
      {stages.map((stage) => (
        <li key={stage.label} className="relative">
          <span className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-canvas-soft bg-pine" />
          <p className="font-display text-base text-ink">{stage.label}</p>
          <p className="text-xs font-medium uppercase tracking-wide text-honey-dark">{stage.duration}</p>
          <p className="mt-1 text-sm text-ink-soft">{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}
