import { Box, Typography, useTheme } from "@mui/material";

/**
 * The card surface used across the dashboard and chart pages: one radius,
 * one border, one padding scale, an optional title row with actions.
 */
const Panel = ({ title, subtitle, actions, children, sx, bodySx, ...rest }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        p: { xs: "1rem", sm: "1.25rem" },
        borderRadius: "16px",
        backgroundColor: theme.palette.background.alt,
        border: `1px solid ${
          isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
        }`,
        ...sx,
      }}
      {...rest}
    >
      {(title || actions) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "0.75rem",
            mb: "0.75rem",
            flexShrink: 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                sx={{ fontSize: "0.8rem", color: theme.palette.secondary[300] }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions}
        </Box>
      )}
      <Box sx={{ flex: 1, minHeight: 0, ...bodySx }}>{children}</Box>
    </Box>
  );
};

export default Panel;
