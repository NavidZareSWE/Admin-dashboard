import { useMemo } from "react";
import {
  Box,
  ButtonBase,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetProductsQuery } from "../../state/api";
import { normalizeProducts } from "../../utils/products";
import { compactMoney, fullNumber } from "../../utils/formatters";
import StatusMessage from "../common/StatusMessage";

/** Best sellers by revenue this year, with bars relative to the leader. */
const TopProducts = ({ limit = 6, onSelect }) => {
  const theme = useTheme();
  const { data, isLoading, isError, refetch } = useGetProductsQuery();

  const top = useMemo(
    () =>
      normalizeProducts(data)
        .filter((p) => p.yearlySales !== null)
        .sort((a, b) => b.yearlySales - a.yearlySales)
        .slice(0, limit),
    [data, limit],
  );

  if (isLoading) {
    return (
      <Box
        sx={{ display: "grid", gap: "14px" }}
        role="status"
        aria-label="Loading top products"
      >
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 40 }} />
        ))}
      </Box>
    );
  }
  if (isError || data?.success === false) {
    return (
      <StatusMessage
        variant="error"
        title="Could not load products"
        onRetry={refetch}
        minHeight={200}
      />
    );
  }
  if (!top.length)
    return <StatusMessage title="No product sales yet" minHeight={200} />;

  const leader = top[0].yearlySales || 1;

  return (
    <Box
      component="ol"
      sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: "4px" }}
    >
      {top.map((product, index) => (
        <li key={product._id}>
          <ButtonBase
            onClick={() => onSelect?.(product)}
            aria-label={`${product.name}, ${compactMoney.format(product.yearlySales)} this year. Open analytics`}
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "24px minmax(0, 1fr) auto",
              alignItems: "center",
              columnGap: "10px",
              rowGap: "6px",
              p: "8px",
              borderRadius: "10px",
              textAlign: "left",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: theme.palette.secondary[300],
              }}
            >
              {index + 1}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: theme.palette.secondary[100],
                }}
              >
                {product.name}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: "0.72rem",
                  color: theme.palette.secondary[300],
                }}
              >
                <Box component="span" sx={{ textTransform: "capitalize" }}>
                  {product.category}
                </Box>{" "}
                · {fullNumber.format(product.yearlyUnits ?? 0)} units
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "0.88rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: theme.palette.secondary[100],
              }}
            >
              {compactMoney.format(product.yearlySales)}
            </Typography>
            <LinearProgress
              variant="determinate"
              color="secondary"
              value={(product.yearlySales / leader) * 100}
              aria-hidden="true"
              sx={{ gridColumn: "2 / 4", height: 4, borderRadius: 2 }}
            />
          </ButtonBase>
        </li>
      ))}
    </Box>
  );
};

export default TopProducts;
