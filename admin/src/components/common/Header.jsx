import { Typography, Box, useTheme } from "@mui/material";

/**
 * Page heading. `actions` renders on the right on wide screens and wraps
 * below the title on narrow ones. The <title> element is hoisted into
 * <head> by React 19, so each page also names its own browser tab.
 */
const Header = ({ title, subtitle, actions }) => {
  const theme = useTheme();
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: "space-between",
        gap: "1rem",
      }}
    >
      <title>{`${title} · EcomVision`}</title>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: "4px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontSize: { xs: "1.6rem", sm: "2rem" },
            color: theme.palette.secondary[100],
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: theme.palette.secondary[300],
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default Header;
