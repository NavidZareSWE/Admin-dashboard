import { useTheme } from "@mui/material";

export const useDataGridColors = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return isDark
    ? {
        // Dark Mode: Fully opaque header band to block scrolling cells
        surface: theme.palette.background.alt, // #21295c
        band: "#141937", // Solid dark primary color (tokensDark.primary[700]) - 100% opaque
        rowBg: "transparent",
        line: "rgba(255, 255, 255, 0.08)",
        rowLine: "rgba(255, 255, 255, 0.045)",
        hover: "rgba(255, 209, 102, 0.05)",
        textStrong: "#ffffff",
        text: "#c2c2c2",
        textDim: "#858585",
        accent: "#ffd166",
        accentDim: "#665429",
        shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        pillBg: "rgba(255, 209, 102, 0.12)",
        pillFg: "#ffd166",
        pillBd: "rgba(255, 209, 102, 0.25)",
        thumb: "rgba(255, 255, 255, 0.14)",
      }
    : {
        // Light Mode: Solid grey header band
        surface: "#e8e8e8",
        band: "#d4d4d4", // Solid opaque grey - blocks scrolling cells
        rowBg: "#f4f4f4",
        line: "#a3a3a3",
        rowLine: "#dbdbdb",
        hover: "#e2e2e2",
        textStrong: "#141414",
        text: "#3d3d3d",
        textDim: "#666666",
        accent: "#665429",
        accentDim: "#a3a3a3",
        shadow: "0px 10px 25px -4px rgba(0, 0, 0, 0.14)",
        pillBg: "#ffedc2",
        pillFg: "#665429",
        pillBd: "#ffe3a3",
        thumb: "rgba(0, 0, 0, 0.3)",
      };
};