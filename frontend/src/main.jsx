import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/glass-ui-kit.css";
import App from "./App.jsx";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state/globalSlice";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
