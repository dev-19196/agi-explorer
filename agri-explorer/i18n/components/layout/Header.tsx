"use client";

import Link from "next/link";
import { useState } from "react";
import { Sprout, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export function Header({ lang, dict }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "plants", label: dict.nav.plants },
    { href: "animals", label: dict.nav.animals },
    { href: "compare", label: dict.nav.compare },
    { href: "map", label: dict.nav.map },
    { href: "quiz", label: dict.nav.quiz },
    { href: "media", label: dict.nav.media },
    { href: "knowledge", label: dict.nav.knowledge },
    { href: "calendar", label: dict.nav.calendar },
    { href: "collection", label: dict.nav.collection },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="biome-spectrum-bg h-1 w-full" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-pine">
          <Sprout className="size-6" strokeWidth={1.8} />
          <span className="font-display text-lg font-medium text-ink">{dict.nav.brand}</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${lang}/${link.href}`}
              className="whitespace-nowrap text-sm font-medium text-ink-soft transition-colors hover:text-pine"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} labels={dict.languageSwitcher} className="hidden sm:flex" />

          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link href={`/${lang}/search`} aria-label={dict.nav.search}>
              <Search />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={dict.nav.openMenu}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent title="Menu">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={`/${lang}/${link.href}`}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-ink-soft hover:bg-pine-soft hover:text-pine"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={`/${lang}/search`}
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-pine"
                >
                  <Search className="size-4.5" /> {dict.nav.search}
                </Link>
                <div className="mt-3 border-t border-line pt-3">
                  <LanguageSwitcher lang={lang} labels={dict.languageSwitcher} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
