import { Box } from "@mui/material";

// Placeholder shapes mirror the real <Geography> layout (five ranked cards,
// the fitted map footprint, the legend strip) so nothing shifts when the
// data arrives. Shimmer comes from the glass kit's .skeleton classes
// (glass-ui-kit.css, section 25) — the kit's stylesheet must be imported
// globally.
//
// data-theme is set on the root here on purpose: the kit's light styling is
// keyed off `[data-theme="light"] .skeleton`, and without an ancestor
// carrying that attribute the placeholders keep their dark-theme fill
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

// Matches FIT.width / FIT.height in Geography.jsx, so the placeholder covers
// the same footprint the projection will fill.
const MAP_ASPECT = 5.405 / 2.3519;

const GeographySkeleton = ({ isDark, surface, border }) => {
  const panelSx = {
    bgcolor: surface,
    border: `1px solid ${border}`,
  };

  return (
    <Box
      data-theme={isDark ? "dark" : "light"}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Box sx={srOnly}>Loading geography data</Box>

      {/* Ranked country cards */}
      <Box sx={{ mt: "24px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              ...panelSx,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              px: "16px",
              py: "12px",
              minWidth: "170px",
              borderRadius: "8px",
            }}
          >
            <div
              className="skeleton"
              style={{
                width: "10px",
                height: "34px",
                borderRadius: "3px",
                flexShrink: 0,
              }}
            />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {/* rank + country name */}
              <div
                className="skeleton skeleton--text"
                style={{ width: "92px", height: "12px" }}
              />
              {/* value */}
              <div
                className="skeleton skeleton--heading"
                style={{ width: "56px", height: "22px" }}
              />
            </div>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          ...panelSx,
          mt: "16px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Map footprint */}
        <Box
          sx={{
            height: "62vh",
            minHeight: "380px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: "20px",
          }}
        >
          <div
            className="skeleton"
            style={{
              width: "100%",
              maxWidth: `calc((62vh - 40px) * ${MAP_ASPECT})`,
              aspectRatio: `${MAP_ASPECT}`,
              borderRadius: "var(--radius-xl)",
            }}
          />
        </Box>

        {/* Legend strip */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px 20px",
            px: "20px",
            py: "16px",
            borderTop: `1px solid ${border}`,
          }}
        >
          {/* "Users per country" */}
          <div
            className="skeleton skeleton--text"
            style={{ width: "132px", height: "14px" }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* "Fewer" */}
            <div
              className="skeleton skeleton--text"
              style={{ width: "44px", height: "12px" }}
            />

            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  className="skeleton"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "4px",
                    flexShrink: 0,
                  }}
                />
                <div
                  className="skeleton skeleton--text"
                  style={{ width: "58px", height: "14px" }}
                />
              </Box>
            ))}

            {/* "More" */}
            <div
              className="skeleton skeleton--text"
              style={{ width: "38px", height: "12px" }}
            />
          </Box>

          {/* "No data" */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              pl: "20px",
              ml: "auto",
              borderLeft: `1px solid ${border}`,
            }}
          >
            <div
              className="skeleton"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "4px",
                flexShrink: 0,
              }}
            />
            <div
              className="skeleton skeleton--text"
              style={{ width: "62px", height: "14px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GeographySkeleton;