import { Box, Typography } from "@mui/material";

const Stat = ({ label, value, textMuted, textStrong }) => (
  <Box>
    <Typography sx={{ fontSize: "0.8rem", color: textMuted }}>{label}</Typography>
    <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.15, color: textStrong }}>
      {value}
    </Typography>
  </Box>
);

// The chart answers "what shape"; this answers "how much", which is the
// question most people actually arrive with.
const ChartStatsHeader = ({ totals, isSales, formatFullValue, colors }) => (
  <Box sx={{ display: "flex", gap: "32px", mb: "8px", flexShrink: 0 }}>
    <Stat
      label={isSales ? "Revenue to date" : "Units to date"}
      value={formatFullValue(isSales ? totals.sales : totals.units)}
      textMuted={colors.textMuted}
      textStrong={colors.textStrong}
    />
    <Stat
      label="Months covered"
      value={totals.months}
      textMuted={colors.textMuted}
      textStrong={colors.textStrong}
    />
  </Box>
);

export default ChartStatsHeader;
