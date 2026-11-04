import { createSlice } from "@reduxjs/toolkit";

export const MODE_STORAGE_KEY = "ecomvision:mode";

const PREFERENCES = ["light", "dark", "system"];

// Storage can throw (private windows, blocked site data), so every access is
// guarded and the app falls back to following the operating system.
const readPreference = () => {
  try {
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (PREFERENCES.includes(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "system";
};

export const readSystemMode = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

const resolve = (preference, systemMode) =>
  preference === "system" ? systemMode : preference;

const initialPreference = readPreference();
const initialSystemMode = readSystemMode();

const initialState = {
  // What the user chose: "light", "dark" or "system".
  themePreference: initialPreference,
  // What the OS currently prefers; only used while the choice is "system".
  systemMode: initialSystemMode,
  // The palette actually in use. Everything else reads this.
  mode: resolve(initialPreference, initialSystemMode),
  userId: "63701cc1f03239b7f700000e",
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    /** Quick toggle: flips the visible palette and pins that choice. */
    setMode: (state) => {
      state.themePreference = state.mode === "light" ? "dark" : "light";
      state.mode = state.themePreference;
    },
    setThemePreference: (state, action) => {
      if (!PREFERENCES.includes(action.payload)) return;
      state.themePreference = action.payload;
      state.mode = resolve(state.themePreference, state.systemMode);
    },
    setSystemMode: (state, action) => {
      state.systemMode = action.payload;
      state.mode = resolve(state.themePreference, state.systemMode);
    },
  },
});

export const { setMode, setThemePreference, setSystemMode } =
  globalSlice.actions;

export default globalSlice.reducer;
