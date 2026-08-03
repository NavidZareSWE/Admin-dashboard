import { Box, Typography } from "@mui/material";

// Slice tooltips beat point tooltips here: the hit area becomes the whole
// column rather than a 10px dot, so the value is reachable without
// precision aiming. Field names differ across nivo generations
// (serieId/serieColor before ~0.88, seriesId/seriesColor after), so both
// are read.
//
// `formatLabel` and `caption` are optional. Their defaults reproduce the
// previous behaviour for the Overview chart, whose x values are month names
// and whose y values are running totals; the Daily chart overrides both
// because its x values are ISO dates and its y values are not cumulative.
const SalesSliceTooltip = ({
  slice,
  formatValue,
  colors,
  formatLabel = String,
  caption = "Running total since January",
}) => {
  const point = slice.points[0];
  if (!point) return null;

  return (
    <Box
      sx={{
        px: "14px",
        py: "10px",
        borderRadius: "8px",
        bgcolor: colors.surface,
        border: `1px solid ${colors.panelBorder}`,
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      }}
    >
      <Typography sx={{ fontSize: "0.9rem", color: colors.textMuted }}>
        {formatLabel(point.data.x)}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "2px",
            flexShrink: 0,
            bgcolor: point.seriesColor ?? point.serieColor ?? colors.line,
          }}
        />
        <Typography
          sx={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.25, color: colors.textStrong }}
        >
          {formatValue(point.data.y)}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: "0.8rem", color: colors.textMuted }}>
        {caption}
      </Typography>
    </Box>
  );
};

export default SalesSliceTooltip;
