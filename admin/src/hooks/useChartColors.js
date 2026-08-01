import { useMemo } from "react";
import { useTheme } from "@mui/material";

// reverseTokens maps secondary.main to #cca752 in light mode, which is
// 2.0:1 against the light panel - the line was effectively invisible.
// These replacements keep the amber identity at 5.2:1.
const useChartColors = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const colors = useMemo(
    () => ({
      line: isDark ? "#ffd166" : "#8a5a00",
      grid: isDark ? "#3a4272" : "#d5d8de",
      axisLine: isDark ? "#4a5480" : "#c3c7cf",
      crosshair: isDark ? "#8b93bd" : "#8c9099",
      textStrong: isDark ? "#f2f4fa" : "#22262e",
      textMuted: isDark ? "#c3c9dd" : "#4a5060",
      surface: isDark ? theme.palette.background.alt : "#ffffff",
      panelBorder: theme.palette.secondary[300],
    }),
    [isDark, theme]
  );

  return { theme, isDark, colors };
};

export default useChartColors;
