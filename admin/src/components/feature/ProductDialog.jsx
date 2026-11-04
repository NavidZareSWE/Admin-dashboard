import { useMemo, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import useChartColors from "../../hooks/useChartColors";
import ViewToggle from "../module/ViewToggle";
import StatusMessage from "../common/StatusMessage";
import {
  compactMoney,
  compactNumber,
  formatMoney,
  fullMoney,
  fullNumber,
} from "../../utils/formatters";

const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

const Kpi = ({ label, value, hint }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: "0.75rem 0.9rem",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        minWidth: 0,
      }}
    >
      <Typography
        sx={{ fontSize: "0.72rem", color: theme.palette.secondary[300] }}
      >
        {label}
      </Typography>
      <Typography
        noWrap
        sx={{
          fontSize: "1.15rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          color: theme.palette.secondary[100],
        }}
      >
        {value}
      </Typography>
      {hint && (
        <Typography
          noWrap
          sx={{ fontSize: "0.72rem", color: theme.palette.secondary[300] }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
};

/** Product analytics: headline numbers plus a month-by-month chart. */
const ProductDialog = ({ product, open, onClose }) => {
  const theme = useTheme();
  const { colors } = useChartColors();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState("sales");
  const isSales = view === "sales";

  const months = useMemo(
    () =>
      (product?.monthlyData ?? []).map((m) => ({
        month: capitalize(m.month).slice(0, 3),
        fullMonth: capitalize(m.month),
        value: Number(isSales ? m.totalSales : m.totalUnits) || 0,
      })),
    [product, isSales],
  );

  const best = months.reduce(
    (top, m) => (!top || m.value > top.value ? m : top),
    null,
  );
  const formatValue = (v) =>
    isSales ? fullMoney.format(v) : `${fullNumber.format(v)} units`;

  if (!product) return null;

  const avgUnitPrice =
    product.yearlySales && product.yearlyUnits
      ? product.yearlySales / product.yearlyUnits
      : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      aria-labelledby="product-dialog-title"
    >
      <DialogTitle
        id="product-dialog-title"
        component="div"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          pr: "0.75rem",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={product.category}
              size="small"
              sx={{ textTransform: "capitalize", fontWeight: 600 }}
            />
            <Rating
              value={product.rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography
              sx={{ fontSize: "0.75rem", color: theme.palette.secondary[300] }}
            >
              {product.rating.toFixed(1)}
            </Typography>
          </Box>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mt: "0.5rem",
              fontWeight: 700,
              color: theme.palette.secondary[100],
            }}
          >
            {product.name}
          </Typography>
          <Typography
            sx={{ mt: "0.25rem", color: theme.palette.secondary[200] }}
          >
            {product.description}
          </Typography>
        </Box>
        <Tooltip title="Close">
          <IconButton onClick={onClose} aria-label="Close product analytics">
            <CloseRounded />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: "12px",
          }}
        >
          <Kpi label="Price" value={formatMoney(product.price)} />
          <Kpi
            label="In stock"
            value={fullNumber.format(product.supply)}
            hint={product.supply < 500 ? "Running low" : undefined}
          />
          <Kpi
            label="Sales this year"
            value={
              product.yearlySales === null
                ? "—"
                : fullMoney.format(product.yearlySales)
            }
            hint={
              avgUnitPrice ? `${formatMoney(avgUnitPrice)} per unit` : undefined
            }
          />
          <Kpi
            label="Units this year"
            value={
              product.yearlyUnits === null
                ? "—"
                : fullNumber.format(product.yearlyUnits)
            }
          />
        </Box>

        <Box
          sx={{
            mt: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
            >
              Monthly {isSales ? "revenue" : "units"}
            </Typography>
            {best && best.value > 0 && (
              <Typography
                sx={{ fontSize: "0.8rem", color: theme.palette.secondary[300] }}
              >
                Best month: {best.fullMonth} ({formatValue(best.value)})
              </Typography>
            )}
          </Box>
          <ViewToggle value={view} onChange={setView} />
        </Box>

        <Box sx={{ height: 300, mt: "0.5rem" }}>
          {months.length === 0 ? (
            <StatusMessage
              title="No monthly data for this product"
              minHeight={280}
            />
          ) : (
            <ResponsiveBar
              data={months}
              keys={["value"]}
              indexBy="month"
              margin={{ top: 16, right: 8, bottom: 36, left: 56 }}
              padding={0.3}
              borderRadius={4}
              colors={({ data }) =>
                best && data.month === best.month
                  ? colors.line
                  : `${colors.line}99`
              }
              enableLabel={false}
              enableGridY
              gridYValues={4}
              axisLeft={{
                tickValues: 4,
                tickSize: 0,
                tickPadding: 8,
                format: (v) =>
                  isSales ? compactMoney.format(v) : compactNumber.format(v),
              }}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                // Every other month on phones, where twelve labels collide.
                tickValues: fullScreen
                  ? months.filter((_, i) => i % 2 === 0).map((m) => m.month)
                  : undefined,
              }}
              theme={{
                text: {
                  fontFamily: theme.typography.fontFamily,
                  fill: colors.textMuted,
                  fontSize: 12,
                },
                grid: { line: { stroke: colors.grid, strokeDasharray: "4 4" } },
              }}
              tooltip={({ data }) => (
                <Box
                  sx={{
                    px: "12px",
                    py: "8px",
                    borderRadius: "8px",
                    bgcolor: colors.surface,
                    border: `1px solid ${colors.panelBorder}`,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.8rem", color: colors.textMuted }}
                  >
                    {data.fullMonth}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 700, color: colors.textStrong }}
                  >
                    {formatValue(data.value)}
                  </Typography>
                </Box>
              )}
              role="img"
              ariaLabel={`Monthly ${isSales ? "revenue" : "units"} for ${product.name}`}
            />
          )}
        </Box>

        <Typography
          sx={{
            mt: "1rem",
            fontSize: "0.72rem",
            color: theme.palette.secondary[300],
          }}
        >
          Product ID:{" "}
          <span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>
            {product._id}
          </span>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
