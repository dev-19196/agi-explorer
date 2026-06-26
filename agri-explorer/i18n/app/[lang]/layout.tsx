import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserActivityProvider } from "@/lib/hooks/useUserActivity";
import { LOCALES, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import "../globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL("https://agri-explorer.example.com"),
    title: {
      default: dict.meta.titleDefault,
      template: "%s | Agri Explorer",
    },
    description: dict.meta.description,
    authors: [{ name: "Agri Explorer" }],
    openGraph: {
      type: "website",
      locale: lang === "vi" ? "vi_VN" : "en_US",
      title: dict.meta.titleDefault,
      description: dict.meta.description,
      siteName: "Agri Explorer",
    },
    alternates: {
      languages: { vi: "/vi", en: "/en" },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#28543f",
};

export default async function RootLayout({ children, params }: Readonly<RootLayoutProps>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <UserActivityProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-pine focus:px-4 focus:py-2 focus:text-canvas"
          >
            {dict.skipToContent}
          </a>
          <Header lang={lang as Locale} dict={dict} />
          <main id="main-content">{children}</main>
          <Footer lang={lang as Locale} dict={dict} />
        </UserActivityProvider>
      </body>
    </html>
  );
}
