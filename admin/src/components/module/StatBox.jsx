import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";

/**
 * KPI tile. `delta` is a percentage change (number) or null when there is
 * nothing honest to compare against; no badge is shown in that case.
 */
const StatBox = ({
  title,
  value,
  icon,
  caption,
  delta = null,
  loading = false,
  sx,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = theme.palette.secondary[300];
  const up = delta !== null && delta >= 0;
  const deltaColor = up
    ? isDark
      ? "#4ade80"
      : "#15803d"
    : isDark
      ? "#f87171"
      : "#b91c1c";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "0.75rem",
        minWidth: 0,
        p: "1.1rem 1.25rem",
        borderRadius: "16px",
        backgroundColor: theme.palette.background.alt,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
        >
          {title}
        </Typography>
        <Box
          aria-hidden="true"
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: accent,
            backgroundColor: alpha(accent, isDark ? 0.12 : 0.18),
            "& svg": { fontSize: 20 },
          }}
        >
          {icon}
        </Box>
      </Box>

      {loading ? (
        <div
          className="skeleton skeleton--heading"
          style={{ width: "60%", height: 32 }}
        />
      ) : (
        <Typography
          sx={{
            fontSize: { xs: "1.6rem", sm: "1.75rem" },
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
            color: theme.palette.secondary[100],
          }}
        >
          {value ?? "—"}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          minHeight: 22,
        }}
      >
        {!loading && delta !== null && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              px: "6px",
              py: "1px",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: deltaColor,
              backgroundColor: alpha(deltaColor, 0.12),
            }}
          >
            {up ? (
              <ArrowUpwardRounded sx={{ fontSize: 14 }} />
            ) : (
              <ArrowDownwardRounded sx={{ fontSize: 14 }} />
            )}
            {Math.abs(delta).toFixed(1)}%
          </Box>
        )}
        <Typography
          noWrap
          sx={{ fontSize: "0.8rem", color: theme.palette.secondary[300] }}
        >
          {loading ? " " : caption}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
