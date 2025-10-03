import { storage } from "@/utils/storage";

import { useCallback } from "react";
import { useMMKVString } from "react-native-mmkv";
import { Uniwind } from "uniwind";

const SELECTED_THEME_KEY = "SELECTED_THEME";
type ColorSchemeType = "light" | "dark" | "sepia" | "system";

export const useStoredTheme = () => {
  const [storedTheme, setStoredTheme] = useMMKVString(
    SELECTED_THEME_KEY,
    storage
  );

  const storeAndApplyUniwindTheme = useCallback(
    (t: ColorSchemeType) => {
      console.log("setSelectedTheme", t);
      Uniwind.setTheme(t);
      setStoredTheme(t);
    },
    [setStoredTheme]
  );

  return {
    storedTheme: (storedTheme ?? "system") as ColorSchemeType,
    storeAndApplyTheme: storeAndApplyUniwindTheme,
  } as const;
};

export const getStoredThemeSync = () => {
  const theme = storage.getString(SELECTED_THEME_KEY) as
    | "light"
    | "dark"
    | "sepia"
    | "system"
    | undefined;

  return theme ?? "system";
};
