import { ResponsivePie } from "@nivo/pie";
import { Box, Typography } from "@mui/material";
import { useGetSalesQuery } from "../../state/api";
import useChartColors from "../../hooks/useChartColors";
import { fullMoney } from "../../utils/formatters";

const BreakdownTooltip = ({ datum, ui }) => (
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
          borderRadius: "2px",
          flexShrink: 0,
          bgcolor: datum.color,
        }}
      />
      <Typography
        sx={{ fontSize: "0.9rem", color: ui.textMuted, textTransform: "capitalize" }}
      >
        {datum.label}
      </Typography>
    </Box>
    <Typography
      sx={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.25, color: ui.textStrong }}
    >
      {fullMoney.format(datum.value)}
    </Typography>
  </Box>
);

const BreakdownChart = ({ isDashboard = false }) => {
  const { data, isLoading } = useGetSalesQuery();
  // `ui` is only used for the tooltip, the legend hover and the centre total.
  // The arcs are left entirely to nivo.
  const { theme, colors: ui } = useChartColors();

  if (!data || isLoading) return "Loading...";

  const colors = [
    theme.palette.secondary[500],
    theme.palette.secondary[300],
    theme.palette.secondary[300],
    theme.palette.secondary[500],
  ];

  const formattedData = Object.entries(data?.SalesStats?.salesByCategory).map(
    ([category, sales], i) => ({
      id: category,
      label: category,
      value: sales,
      color: colors[i],
    }),
  );

  return (
    <Box
      sx={{
        height: isDashboard ? "400px" : "100%",
        width: undefined,
        minHeight: isDashboard ? "325px" : undefined,
        minWidth: isDashboard ? "325px" : undefined,
        position: "relative",
        // Arc labels are SVG <text>, so a click-drag across the chart selects
        // them and paints the browser's blue selection highlight over the
        // label. They are not meant to be selectable content.
        userSelect: "none",
      }}
    >
      <ResponsivePie
        data={formattedData}
        theme={{
          labels: {
            text: {
              fontSize: "1.3rem",
            },
          },
          axis: {
            domain: {
              line: { stroke: theme.palette.secondary[200] },
            },
            legend: {
              text: { fill: theme.palette.secondary[200] },
            },
            ticks: {
              line: {
                stroke: theme.palette.secondary[200],
                strokeWidth: 1,
              },
              text: {
                fill: theme.palette.secondary[200],
              },
            },
          },
          legends: {
            text: {
              fill: theme.palette.secondary[200],
              fontSize: "1.3rem",
            },
          },
          tooltip: {
            // Unused while the custom `tooltip` prop below is set - nivo's
            // TooltipWrapper omits `container` from the styles it applies, so
            // only BasicTooltip reads this. Kept correct so reverting to the
            // default tooltip does not reintroduce white-on-white text.
            container: {
              background: ui.surface,
              color: ui.textStrong,
            },
          },
        }}
        margin={
          isDashboard
            ? { top: 40, right: 80, bottom: 100, left: 50 }
            : { top: 40, right: 80, bottom: 80, left: 80 }
        }
        sortByValue
        innerRadius={0.45}
        cornerRadius={7}
        activeOuterRadiusOffset={10}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={!isDashboard}
        arcLinkLabelsTextColor={theme.palette.secondary[200]}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        tooltip={({ datum }) => <BreakdownTooltip datum={datum} ui={ui} />}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: isDashboard ? 20 : 0,
            translateY: isDashboard ? 50 : 56,
            itemsSpacing: 70,
            itemWidth: 85,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                // Was theme.palette.primary[500], which reverseTokens resolves
                // to #21295c in dark mode - the panel colour itself, 1.16:1.
                style: { itemTextColor: ui.textStrong },
              },
            ],
          },
        ]}
      />

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          // Was theme.palette.secondary[400], which is #ffd166 in light mode:
          // 1.44:1 on a white page.
          color: ui.textStrong,
          textAlign: "center",
          pointerEvents: "none",
          transform: isDashboard
            ? "translate(-75%, -170%)"
            : "translate(-50%, -100%)",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
          {!isDashboard && "Total: "} ${data?.SalesStats?.yearlySalesTotal}
        </Typography>
      </Box>
    </Box>
  );
};

export default BreakdownChart;