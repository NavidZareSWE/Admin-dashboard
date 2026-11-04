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
        pillNeutralBg: "rgba(255, 255, 255, 0.06)",
        pillNeutralFg: "#c2c2c2",
        pillNeutralBd: "rgba(255, 255, 255, 0.12)",
        thumb: "rgba(255, 255, 255, 0.14)",
      }
    : {
        // Light Mode: white rows on a near-white, opaque header band
        surface: "#ffffff",
        band: "#f6f6f6", // opaque, so scrolling cells never show through
        rowBg: "#ffffff",
        line: "#e0e0e0",
        rowLine: "#eeeeee",
        hover: "#fbf6ea",
        textStrong: "#141414",
        text: "#3d3d3d",
        textDim: "#666666",
        accent: "#665429",
        accentDim: "#a3a3a3",
        shadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        pillBg: "#ffedc2",
        pillFg: "#665429",
        pillBd: "#ffe3a3",
        pillNeutralBg: "#ffffff",
        pillNeutralFg: "#3d3d3d",
        pillNeutralBd: "#c2c2c2",
        thumb: "rgba(0, 0, 0, 0.3)",
      };
};
