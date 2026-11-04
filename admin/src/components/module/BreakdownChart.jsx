import { useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { Box, Typography } from "@mui/material";
import { useGetSalesQuery } from "../../state/api";
import useChartColors from "../../hooks/useChartColors";
import { compactMoney, fullMoney } from "../../utils/formatters";
import StatusMessage from "../common/StatusMessage";

// Four clearly distinct hues, so no two categories can be confused. (The
// previous palette repeated secondary[500] and secondary[300], which made two
// pairs of slices identical.) The light set is darkened to keep at least 3:1
// against a white panel.
const PALETTE = {
  dark: ["#ffd166", "#f4845f", "#4fd1c5", "#a78bfa", "#94a3b8"],
  light: ["#c27c0e", "#d9542b", "#0f8f84", "#7c4ddb", "#64748b"],
};

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const BreakdownTooltip = ({ datum, ui, total }) => (
  <Box
    sx={{
      px: "14px",
      py: "10px",
      borderRadius: "8px",
      bgcolor: ui.surface,
      border: `1px solid ${ui.panelBorder}`,
      boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "3px",
          flexShrink: 0,
          bgcolor: datum.color,
        }}
      />
      <Typography
        sx={{
          fontSize: "0.9rem",
          color: ui.textMuted,
          textTransform: "capitalize",
        }}
      >
        {datum.label}
      </Typography>
    </Box>
    <Typography
      sx={{
        fontSize: "1.25rem",
        fontWeight: 700,
        lineHeight: 1.25,
        color: ui.textStrong,
      }}
    >
      {fullMoney.format(datum.value)}
    </Typography>
    <Typography sx={{ fontSize: "0.8rem", color: ui.textMuted }}>
      {percentFormatter.format(datum.value / total)} of sales
    </Typography>
  </Box>
);

const BreakdownChart = ({ isDashboard = false }) => {
  const { data, isLoading, isError, refetch } = useGetSalesQuery();
  const { theme, isDark, colors: ui } = useChartColors();
  const [activeId, setActiveId] = useState(null);

  const { slices, total } = useMemo(() => {
    const byCategory = data?.SalesStats?.salesByCategory ?? {};
    const palette = isDark ? PALETTE.dark : PALETTE.light;
    const entries = Object.entries(byCategory)
      .map(([category, sales]) => [category, Number(sales) || 0])
      .sort((a, b) => b[1] - a[1]);
    return {
      total: entries.reduce((sum, [, value]) => sum + value, 0),
      slices: entries.map(([category, value], i) => ({
        id: category,
        label: category,
        value,
        color: palette[i % palette.length],
      })),
    };
  }, [data, isDark]);

  if (isLoading) {
    return (
      <Box
        role="status"
        aria-label="Loading sales by category"
        sx={{
          height: "100%",
          minHeight: 260,
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          className="skeleton skeleton--circle"
          style={{ width: "min(60%, 220px)", aspectRatio: "1" }}
        />
      </Box>
    );
  }

  if (isError || data?.success === false) {
    return (
      <StatusMessage
        variant="error"
        title="Could not load categories"
        onRetry={refetch}
      />
    );
  }

  if (!slices.length || total === 0) {
    return <StatusMessage title="No category sales yet" />;
  }

  // Draws the total inside the donut hole at the true centre of the pie,
  // whatever the container size.
  const CenterTotal = ({ centerX, centerY }) => (
    <g
      transform={`translate(${centerX}, ${centerY})`}
      style={{ pointerEvents: "none" }}
    >
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={isDashboard ? -9 : -14}
        style={{
          fontFamily: theme.typography.fontFamily,
          fontSize: isDashboard ? 11 : 13,
          fill: ui.textMuted,
        }}
      >
        Total
      </text>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        y={isDashboard ? 9 : 12}
        style={{
          fontFamily: theme.typography.fontFamily,
          fontSize: isDashboard ? 17 : 26,
          fontWeight: 700,
          fill: ui.textStrong,
        }}
      >
        {isDashboard ? compactMoney.format(total) : fullMoney.format(total)}
      </text>
    </g>
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: isDashboard ? "column" : { xs: "column", md: "row" },
        alignItems: "stretch",
        gap: isDashboard ? "0.5rem" : "1.5rem",
        // Arc labels are SVG <text>; a click-drag would otherwise select them.
        userSelect: "none",
      }}
    >
      <Box
        role="img"
        aria-label={`Sales by category, ${fullMoney.format(total)} in total`}
        sx={{
          position: "relative",
          flex: 1,
          minHeight: isDashboard ? 200 : 320,
          minWidth: 0,
        }}
      >
        <ResponsivePie
          data={slices}
          colors={{ datum: "data.color" }}
          valueFormat={(value) => fullMoney.format(value)}
          margin={
            isDashboard
              ? { top: 10, right: 10, bottom: 10, left: 10 }
              : { top: 30, right: 30, bottom: 30, left: 30 }
          }
          innerRadius={0.62}
          padAngle={1.2}
          cornerRadius={6}
          activeOuterRadiusOffset={8}
          activeId={activeId}
          onActiveIdChange={setActiveId}
          borderWidth={0}
          enableArcLinkLabels={false}
          arcLabel={(d) => percentFormatter.format(d.value / total)}
          arcLabelsSkipAngle={18}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2.4]] }}
          theme={{
            text: { fontFamily: theme.typography.fontFamily },
            labels: {
              text: { fontSize: isDashboard ? 11 : 13, fontWeight: 700 },
            },
          }}
          tooltip={({ datum }) => (
            <BreakdownTooltip datum={datum} ui={ui} total={total} />
          )}
          layers={["arcs", "arcLabels", CenterTotal]}
          legends={[]}
        />
      </Box>

      {/* HTML legend: wraps instead of clipping, and doubles as a data table. */}
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "grid",
          gridTemplateColumns: isDashboard
            ? "repeat(2, minmax(0, 1fr))"
            : { xs: "repeat(2, minmax(0, 1fr))", md: "1fr" },
          alignContent: "center",
          gap: isDashboard ? "6px 12px" : "10px 16px",
          minWidth: isDashboard ? 0 : { md: 240 },
          flexShrink: 0,
        }}
      >
        {slices.map((slice) => (
          <Box
            component="li"
            key={slice.id}
            onMouseEnter={() => setActiveId(slice.id)}
            onMouseLeave={() => setActiveId(null)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              p: isDashboard ? "4px 6px" : "8px 10px",
              borderRadius: "8px",
              transition: "background-color 150ms ease",
              backgroundColor:
                activeId === slice.id
                  ? isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)"
                  : "transparent",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "3px",
                flexShrink: 0,
                bgcolor: slice.color,
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                noWrap
                sx={{
                  fontSize: isDashboard ? "0.78rem" : "0.88rem",
                  textTransform: "capitalize",
                  color: ui.textStrong,
                  fontWeight: 600,
                }}
              >
                {slice.label}
              </Typography>
              <Typography
                noWrap
                sx={{
                  fontSize: isDashboard ? "0.72rem" : "0.8rem",
                  color: ui.textMuted,
                }}
              >
                {isDashboard
                  ? compactMoney.format(slice.value)
                  : fullMoney.format(slice.value)}{" "}
                · {percentFormatter.format(slice.value / total)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BreakdownChart;
