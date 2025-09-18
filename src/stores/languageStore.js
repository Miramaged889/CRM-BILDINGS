import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n/config";

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: "en",
      direction: "ltr",
      setLanguage: (lang) => {
        const direction = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = direction;
        document.documentElement.lang = lang;
        document.body.dir = direction;
        i18n.changeLanguage(lang);
        set({ language: lang, direction });
      },
      toggleLanguage: (lang) => {
        const direction = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.dir = direction;
        document.documentElement.lang = lang;
        document.body.dir = direction;
        i18n.changeLanguage(lang);
        set({ language: lang, direction });
      },
    }),
    {
      name: "language-storage",
    }
  )
);
