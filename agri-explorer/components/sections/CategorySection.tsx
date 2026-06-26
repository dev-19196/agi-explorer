"use client";

import { Link } from "@/i18n/Link";
import { Leaf, PawPrint, Image as ImageIcon, BookOpen, ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { useDictionary } from "@/i18n/use-dictionary";

export function CategorySection() {
  const dict = useDictionary();

  const CATEGORIES = [
    {
      href: "/plants",
      label: dict.nav.plants,
      desc: dict.categorySection.plantsDesc,
      icon: Leaf,
      color: "var(--biome-tropical)",
    },
    {
      href: "/animals",
      label: dict.nav.animals,
      desc: dict.categorySection.animalsDesc,
      icon: PawPrint,
      color: "var(--biome-mountain)",
    },
    {
      href: "/media",
      label: dict.nav.media,
      desc: dict.categorySection.mediaDesc,
      icon: ImageIcon,
      color: "var(--biome-wetland)",
    },
    {
      href: "/knowledge",
      label: dict.nav.knowledge,
      desc: dict.categorySection.knowledgeDesc,
      icon: BookOpen,
      color: "var(--honey)",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl text-ink sm:text-3xl">{dict.categorySection.title}</h2>

      <ScrollReveal className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CATEGORIES.map(({ href, label, desc, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-card"
          >
            <span
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: color }}
            />
            <div
              className="flex size-11 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}1f` }}
            >
              <Icon className="size-5" style={{ color }} />
            </div>
            <div>
              <p className="flex items-center gap-1 font-display text-base text-ink">
                {label}
                <ArrowUpRight className="size-4 -translate-y-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-sm text-ink-soft">{desc}</p>
            </div>
          </Link>
        ))}
      </ScrollReveal>
    </section>
  );
}
