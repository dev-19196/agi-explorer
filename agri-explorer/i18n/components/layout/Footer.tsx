import Link from "next/link";
import { Sprout } from "lucide-react";
import { BIOMES } from "@/types/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getBiomeMeta } from "@/i18n/biome-labels";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const columns = [
    {
      title: dict.footer.exploreTitle,
      links: [
        { href: "plants", label: dict.nav.plants },
        { href: "animals", label: dict.nav.animals },
        { href: "media", label: dict.nav.media },
        { href: "knowledge", label: dict.nav.knowledge },
      ],
    },
    {
      title: dict.footer.biomeTitle,
      links: BIOMES.map((b) => ({
        href: `environment/${b.id}`,
        label: getBiomeMeta(b, lang).name,
      })),
    },
  ];

  return (
    <footer className="border-t border-line bg-pine-dark text-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <Sprout className="size-6" strokeWidth={1.8} />
              <span className="font-display text-lg">{dict.nav.brand}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-canvas/70">{dict.footer.tagline}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm text-canvas/60">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${lang}/${link.href}`}
                      className="text-sm text-canvas/85 transition-colors hover:text-honey"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="biome-spectrum-bg mt-10 h-px w-full opacity-60" />

        <p className="mt-6 text-xs text-canvas/50">
          © {new Date().getFullYear()} {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
