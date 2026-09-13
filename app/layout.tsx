import type { Metadata } from "next";
import { Archivo, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { LanguageProvider, type Lang } from "@/components/LanguageProvider";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif4",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "A photography exhibition by Walter Gómez exploring how the Hispanic community in North Carolina takes up space — sin pedir permiso, without asking permission.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Sin Pedir Permiso — Walter Gómez",
  description,
  openGraph: {
    title: "Sin Pedir Permiso",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sin Pedir Permiso",
    description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const lang: Lang = store.get("spp_lang")?.value === "es" ? "es" : "en";

  return (
    <html lang={lang} className={`${archivo.variable} ${sourceSerif.variable} ${plexMono.variable}`}>
      <body>
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
