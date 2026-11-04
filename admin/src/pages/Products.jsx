import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  BarChartRounded,
  ExpandMoreRounded,
  Search,
} from "@mui/icons-material";
import { useGetProductsQuery } from "../state/api";
import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import StatusMessage from "../components/common/StatusMessage";
import ProductSkeletonCard from "../components/templates/ProductSkeletonCard";
import ProductDialog from "../components/feature/ProductDialog";
import { normalizeProducts } from "../utils/products";
import { formatMoney, fullMoney, fullNumber } from "../utils/formatters";

const LOW_SUPPLY = 500;

const SORTS = {
  name: {
    label: "Name (A–Z)",
    compare: (a, b) => a.name.localeCompare(b.name),
  },
  priceAsc: {
    label: "Price: low to high",
    compare: (a, b) => a.price - b.price,
  },
  priceDesc: {
    label: "Price: high to low",
    compare: (a, b) => b.price - a.price,
  },
  rating: { label: "Top rated", compare: (a, b) => b.rating - a.rating },
  sales: {
    label: "Best selling",
    compare: (a, b) => b.yearlySales - a.yearlySales,
  },
};

const gridSx = {
  mt: "20px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "20px",
};

const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      py: "4px",
    }}
  >
    <Typography sx={{ fontSize: "0.8rem", opacity: 0.8 }}>{label}</Typography>
    <Typography
      sx={{ fontSize: "0.8rem", fontWeight: 600, textAlign: "right" }}
    >
      {value}
    </Typography>
  </Box>
);

const Product = ({ product, onOpenAnalytics }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    yearlySales,
    yearlyUnits,
  } = product;
  const lowSupply = Number(supply) < LOW_SUPPLY;
  const detailsId = `product-details-${_id}`;
  const accent = theme.palette.secondary[300];
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      component="article"
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "16px",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        transition: "transform 150ms ease, box-shadow 150ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "0 10px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={category}
            size="small"
            sx={{
              textTransform: "capitalize",
              fontWeight: 600,
              color: isDark
                ? theme.palette.secondary[300]
                : theme.palette.secondary[100],
              backgroundColor: alpha(accent, isDark ? 0.12 : 0.2),
            }}
          />
          {lowSupply && (
            <Chip
              label="Low stock"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, color: theme.palette.secondary[100] }}
        >
          {name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: theme.palette.secondary[300],
            }}
          >
            {formatMoney(price)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Rating
              value={Number(rating) || 0}
              precision={0.5}
              readOnly
              size="small"
              aria-label={`Rated ${Number(rating || 0).toFixed(1)} out of 5`}
            />
            <Typography
              sx={{ fontSize: "0.75rem", color: theme.palette.secondary[300] }}
            >
              {Number(rating || 0).toFixed(1)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.secondary[200],
            // Clamp long descriptions so card heights stay comparable.
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: "16px", pt: 0, justifyContent: "space-between" }}>
        <Button
          size="small"
          color="secondary"
          onClick={() => setIsExpanded((open) => !open)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          endIcon={
            <ExpandMoreRounded
              sx={{
                transition: "transform 200ms ease",
                transform: isExpanded ? "rotate(180deg)" : "none",
              }}
            />
          }
        >
          {isExpanded ? "Hide details" : "Show details"}
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="outlined"
          startIcon={<BarChartRounded />}
          onClick={() => onOpenAnalytics(product)}
          aria-label={`Open analytics for ${name}`}
        >
          Analytics
        </Button>
      </CardActions>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit id={detailsId}>
        <CardContent sx={{ pt: 0, color: theme.palette.secondary[200] }}>
          <DetailRow
            label="In stock"
            value={fullNumber.format(Number(supply) || 0)}
          />
          <DetailRow
            label="Sales this year"
            value={yearlySales === null ? "—" : fullMoney.format(yearlySales)}
          />
          <DetailRow
            label="Units sold this year"
            value={yearlyUnits === null ? "—" : fullNumber.format(yearlyUnits)}
          />
          <DetailRow
            label="Product ID"
            value={
              <Box
                component="span"
                sx={{
                  fontFamily: "ui-monospace, Menlo, monospace",
                  fontSize: "0.72rem",
                }}
              >
                {_id}
              </Box>
            }
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const theme = useTheme();
  const { data, isLoading, isError, refetch } = useGetProductsQuery();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState("name");

  // utils/products.js flattens `stat`, which the API returns as an array.
  const products = useMemo(() => normalizeProducts(data), [data]);
  const [openProduct, setOpenProduct] = useState(null);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products
      .filter((p) => category === "all" || p.category === category)
      .filter(
        (p) =>
          !needle ||
          p.name?.toLowerCase().includes(needle) ||
          p.description?.toLowerCase().includes(needle),
      )
      .sort(SORTS[sortKey].compare);
  }, [products, query, category, sortKey]);

  const failed = isError || data?.success === false;

  return (
    <PageContainer>
      <Header
        title="Products"
        subtitle={
          data?.success
            ? `${products.length} products across ${categories.length} categories`
            : "Your product catalogue"
        }
      />

      {/* Filters */}
      <Box
        sx={{
          mt: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={failed}
          sx={{ flex: "1 1 240px", maxWidth: { sm: 360 } }}
          slotProps={{
            htmlInput: { "aria-label": "Search products" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl
          size="small"
          sx={{ minWidth: 160, flex: { xs: "1 1 140px", sm: "0 0 auto" } }}
          disabled={failed}
        >
          <InputLabel id="product-category-label">Category</InputLabel>
          <Select
            labelId="product-category-label"
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <MenuItem value="all">All categories</MenuItem>
            {categories.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{ textTransform: "capitalize" }}
              >
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          sx={{ minWidth: 180, flex: { xs: "1 1 140px", sm: "0 0 auto" } }}
          disabled={failed}
        >
          <InputLabel id="product-sort-label">Sort by</InputLabel>
          <Select
            labelId="product-sort-label"
            label="Sort by"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value)}
          >
            {Object.entries(SORTS).map(([key, { label }]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!isLoading && !failed && (
          <Typography
            aria-live="polite"
            sx={{
              ml: { sm: "auto" },
              fontSize: "0.8rem",
              color: theme.palette.secondary[300],
            }}
          >
            Showing {visible.length} of {products.length}
          </Typography>
        )}
      </Box>

      {failed ? (
        <Panel sx={{ mt: "20px" }}>
          <StatusMessage
            variant="error"
            title="Could not load products"
            message="The server did not respond as expected."
            onRetry={refetch}
            minHeight={320}
          />
        </Panel>
      ) : isLoading ? (
        <Box sx={gridSx} role="status" aria-label="Loading products">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeletonCard key={index} />
          ))}
        </Box>
      ) : visible.length === 0 ? (
        <Panel sx={{ mt: "20px" }}>
          <StatusMessage
            title="No products match"
            message="Try a different search term or category."
            action={
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            }
            minHeight={280}
          />
        </Panel>
      ) : (
        <Box sx={gridSx}>
          {visible.map((product) => (
            <Product
              key={product._id}
              product={product}
              onOpenAnalytics={setOpenProduct}
            />
          ))}
        </Box>
      )}
      <ProductDialog
        product={openProduct}
        open={Boolean(openProduct)}
        onClose={() => setOpenProduct(null)}
      />
    </PageContainer>
  );
};

export default Products;
