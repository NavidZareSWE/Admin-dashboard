import { Box, Tooltip } from "@mui/material";

export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Long Mongo ids: shortened, full value on hover. */
export const IdCell = ({ value, c }) => (
  <Tooltip title={value ?? ""} placement="top-start">
    <Box
      component="span"
      sx={{ fontFamily: MONO, fontSize: "0.72rem", color: c.textDim }}
    >
      {value ? `…${String(value).slice(-8)}` : "—"}
    </Box>
  </Tooltip>
);

export const Pill = ({ children, tone = "neutral", c }) => {
  const accent = tone === "accent";
  return (
    <Box
      component="span"
      sx={{
        px: "9px",
        py: "2px",
        borderRadius: "20px",
        fontSize: "0.7rem",
        fontWeight: 600,
        lineHeight: 1.6,
        textTransform: "capitalize",
        backgroundColor: accent ? c.pillBg : c.pillNeutralBg,
        color: accent ? c.pillFg : c.pillNeutralFg,
        border: `1px solid ${accent ? c.pillBd : c.pillNeutralBd}`,
      }}
    >
      {children}
    </Box>
  );
};
