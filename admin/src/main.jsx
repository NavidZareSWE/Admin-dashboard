import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/glass-ui-kit.css";
import App from "./App.jsx";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer, {
  MODE_STORAGE_KEY,
  setSystemMode,
} from "./state/globalSlice";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./state/api";

const store = configureStore({
  reducer: {
    global: globalReducer,

    // It automatically manages API state like cached data, loading, and errors.
    [api.reducerPath]: api.reducer,
  },

  // This middleware is responsible for:
  // - sending API requests
  // - caching responses
  // - deduplicating identical requests
  // - automatically refetching data when needed
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

// Enables useful RTK Query behaviors such as:
// - refetching data when the browser regains focus
// - refetching when the internet reconnects
// It listens for browser events and dispatches Redux actions when they happen.
setupListeners(store.dispatch);

// Expose the palette on <html> (the glass kit keys its light styles off
// [data-theme="light"], and native form controls follow color-scheme) and
// persist the user's theme preference.
let lastMode;
let lastPreference;
const syncMode = () => {
  const { mode, themePreference } = store.getState().global;
  if (mode !== lastMode) {
    lastMode = mode;
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }
  if (themePreference !== lastPreference) {
    lastPreference = themePreference;
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, themePreference);
    } catch {
      /* storage unavailable: the choice simply is not remembered */
    }
  }
};
syncMode();
store.subscribe(syncMode);

// Follow OS theme changes live while the preference is "system".
const colorSchemeQuery = window.matchMedia?.("(prefers-color-scheme: light)");
colorSchemeQuery?.addEventListener?.("change", (event) =>
  store.dispatch(setSystemMode(event.matches ? "light" : "dark")),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
