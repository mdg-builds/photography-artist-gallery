"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "es";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T extends string>(en: T, es: T) => T;
};

const LanguageContext = createContext<Ctx | null>(null);

const COOKIE_NAME = "spp_lang";

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (en, es) => (lang === "es" ? es : en),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export { COOKIE_NAME as LANGUAGE_COOKIE_NAME };
