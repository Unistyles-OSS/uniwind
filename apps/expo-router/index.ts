import { getStoredThemeSync } from "@/utils/use-stored-theme";
import "expo-router/entry";
import { Uniwind } from "uniwind";

const initialTheme = getStoredThemeSync();
Uniwind.setTheme(initialTheme ?? "system");

console.log("INITIAL_THEME:", initialTheme);
