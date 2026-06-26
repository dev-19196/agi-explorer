"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/Link";
import { ArrowLeftRight } from "lucide-react";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import {
  COMPARE_ENTRIES,
  compareKey,
  findEntry,
  buildCompareRows,
  type CompareEntry,
} from "@/lib/compare";
import { SpecimenPlate } from "@/components/cards/SpecimenPlate";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";
import { translateSpecies } from "@/i18n/species-translations";
import type { Locale } from "@/i18n/config";

function EntryPicker({
  value,
  onChange,
  label,
  lang,
  groupPlants,
  groupAnimals,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  lang: Locale;
  groupPlants: string;
  groupAnimals: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[var(--radius-card)] border border-line bg-canvas-soft px-3 py-2.5 text-ink outline-none focus:border-pine"
      >
        <optgroup label={groupPlants}>
          {plants.map((p) => (
            <option key={p.slug} value={`plant:${p.slug}`}>
              {translateSpecies(p, lang).name}
            </option>
          ))}
        </optgroup>
        <optgroup label={groupAnimals}>
          {animals.map((a) => (
            <option key={a.slug} value={`animal:${a.slug}`}>
              {translateSpecies(a, lang).name}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

function EntryCard({ entry, lang }: { entry: CompareEntry; lang: Locale }) {
  const cover = entry.data.detail?.gallery.find((g) => g.kind === "image");
  const t = translateSpecies(entry.data, lang);
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {cover ? (
        <img
          src={cover.url}
          alt={t.name}
          className="aspect-square w-full max-w-48 rounded-[var(--radius-card)] border border-line object-cover"
        />
      ) : (
        <SpecimenPlate
          biome={entry.data.biome}
          icon={entry.kind === "plant" ? "plant" : "animal"}
          className="aspect-square w-full max-w-48"
        />
      )}
      <div>
        <p className="font-display text-xl text-ink">{t.name}</p>
        <p className="font-display text-sm italic text-ink-faint">{entry.data.scientificName}</p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const lang = useLocale();
  const d = useDictionary();
  const [keyA, setKeyA] = useState(compareKey(COMPARE_ENTRIES[0]));
  const [keyB, setKeyB] = useState(
    compareKey(COMPARE_ENTRIES.find((e) => e.kind === "animal") ?? COMPARE_ENTRIES[1])
  );

  const entryA = findEntry(keyA);
  const entryB = findEntry(keyB);

  const rows = useMemo(() => {
    if (!entryA || !entryB) return [];
    return buildCompareRows(entryA, entryB);
  }, [entryA, entryB]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">{d.compare.title}</h1>
      <p className="mt-2 text-ink-soft">{d.compare.subtitle}</p>

      <div className="mt-8 grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <EntryPicker
          value={keyA}
          onChange={setKeyA}
          label={d.compare.pickerFirst}
          lang={lang}
          groupPlants={d.compare.groupPlants}
          groupAnimals={d.compare.groupAnimals}
        />
        <div className="hidden justify-center pb-2.5 sm:flex">
          <ArrowLeftRight className="size-5 text-ink-faint" />
        </div>
        <EntryPicker
          value={keyB}
          onChange={setKeyB}
          label={d.compare.pickerSecond}
          lang={lang}
          groupPlants={d.compare.groupPlants}
          groupAnimals={d.compare.groupAnimals}
        />
      </div>

      {entryA && entryB && (
        <>
          <div className="mt-10 grid grid-cols-2 gap-6">
            <EntryCard entry={entryA} lang={lang} />
            <EntryCard entry={entryB} lang={lang} />
          </div>

          <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-line">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-canvas-soft" : "bg-canvas"}>
                    <td className="w-1/3 border-r border-line px-4 py-3 font-medium text-ink-faint">
                      {row.label}
                    </td>
                    <td className="border-r border-line px-4 py-3 text-ink-soft">{row.a}</td>
                    <td className="px-4 py-3 text-ink-soft">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm">
            <Link
              href={`/${entryA.kind === "plant" ? "plants" : "animals"}/${entryA.data.slug}`}
              className="text-pine underline"
            >
              {d.compare.viewDetail} {translateSpecies(entryA.data, lang).name}
            </Link>
            <Link
              href={`/${entryB.kind === "plant" ? "plants" : "animals"}/${entryB.data.slug}`}
              className="text-pine underline"
            >
              {d.compare.viewDetail} {translateSpecies(entryB.data, lang).name}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
