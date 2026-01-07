"use client";

import { useEffect, useState, useCallback } from "react";
import { getTranslations, type LanguageKey, type Translations, LANGUAGE_CHANGED_EVENT } from "./translations";

const LANGUAGE_STORAGE_KEY = "qos-et-language";

export function useTranslation() {
  const [language, setLanguageState] = useState<LanguageKey>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageKey | null;
      return stored || "en";
    }
    return "en";
  });

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageKey | null;
    if (stored && stored !== language) {
      setLanguageState(stored);
    }

    // Listen for language changes from other components
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageKey | null;
      if (newLang && newLang !== language) {
        setLanguageState(newLang);
      }
    };

    window.addEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);
    return () => window.removeEventListener(LANGUAGE_CHANGED_EVENT, handleLanguageChange);
  }, [language]);

  const setLanguage = useCallback((lang: LanguageKey) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event(LANGUAGE_CHANGED_EVENT));
  }, []);

  const t = getTranslations(language);

  return {
    t,
    language,
    setLanguage,
  };
}

