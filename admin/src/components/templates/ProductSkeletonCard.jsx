import { Card, CardContent, CardActions, useTheme } from "@mui/material";

// Placeholder shapes mirror the real <Product> card layout
// (category tag, name, price, rating, description, "See More" button)
// so the grid doesn't jump when the real data replaces it.
// Shimmer/blur comes from the glass kit's .skeleton classes
// (style.css, section 25) — the kit's stylesheet must be imported globally.

const ProductSkeletonCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent className="skeleton-layout">
        {/* category */}
        <div className="skeleton skeleton--text" style={{ width: "30%" }} />

        {/* name */}
        <div className="skeleton skeleton--heading" style={{ width: "80%" }} />

        {/* price */}
        <div className="skeleton skeleton--text" style={{ width: "25%" }} />

        {/* rating */}
        <div className="skeleton-row" style={{ gap: "4px" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="skeleton skeleton--circle"
              style={{ width: "16px", height: "16px", flexShrink: 0 }}
            />
          ))}
        </div>

        {/* description */}
        <div className="skeleton skeleton--text" style={{ width: "100%" }} />
        <div className="skeleton skeleton--text" style={{ width: "90%" }} />
        <div className="skeleton skeleton--text" style={{ width: "60%" }} />
      </CardContent>

      <CardActions>
        <div
          className="skeleton skeleton--text"
          style={{
            width: "80px",
            height: "30px",
            borderRadius: "var(--radius-md)",
          }}
        />
      </CardActions>
    </Card>
  );
};

export default ProductSkeletonCard;
