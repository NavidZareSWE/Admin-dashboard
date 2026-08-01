import { Box } from "@mui/material";

// Placeholder shapes mirror the real <OverviewChart> layout (summary strip,
// y-axis ticks, plot area, x-axis labels) so nothing shifts when the data
// arrives. Shimmer comes from the glass kit's .skeleton classes
// (glass-ui-kit.css, section 25) — the kit's stylesheet must be imported
// globally.
//
// data-theme is set on the root on purpose: the kit keys its light styling
// off `[data-theme="light"] .skeleton`, and without an ancestor carrying
// that attribute the placeholders keep their dark fill
// (rgba(255,255,255,0.12)), which is invisible on a light surface.

const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const OverviewChartSkeleton = ({ isDark, isDashboard = false }) => (
  <Box
    data-theme={isDark ? "dark" : "light"}
    role="status"
    aria-busy="true"
    aria-live="polite"
    sx={{ height: "100%", display: "flex", flexDirection: "column" }}
  >
    <Box sx={srOnly}>Loading sales data</Box>

    {/* Summary strip */}
    {!isDashboard && (
      <Box sx={{ display: "flex", gap: "32px", mb: "16px", flexShrink: 0 }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} style={{ display: "grid", gap: "8px" }}>
            <div
              className="skeleton skeleton--text"
              style={{ width: "104px", height: "12px" }}
            />
            <div
              className="skeleton skeleton--heading"
              style={{ width: "128px", height: "26px" }}
            />
          </div>
        ))}
      </Box>
    )}

    {/* Plot area with a y-axis gutter */}
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", gap: "12px" }}>
      <Box
        sx={{
          width: isDashboard ? "40px" : "56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: "8px",
          flexShrink: 0,
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="skeleton skeleton--text"
            style={{ width: "100%", height: "10px" }}
          />
        ))}
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className="skeleton"
          style={{
            flex: 1,
            minHeight: 0,
            borderRadius: "var(--radius-md)",
          }}
        />

        {/* X-axis labels */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            mt: "12px",
            height: "10px",
          }}
        >
          {Array.from({ length: isDashboard ? 6 : 12 }).map((_, index) => (
            <div
              key={index}
              className="skeleton skeleton--text"
              style={{ width: "24px", height: "10px", flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  </Box>
);

export default OverviewChartSkeleton;