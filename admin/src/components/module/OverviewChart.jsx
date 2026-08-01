import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { Box, Typography } from "@mui/material";
import { useGetSalesQuery } from "../../state/api";
import OverviewChartSkeleton from "../templates/Overviewchartskeleton ";
import useChartColors from "../../hooks/useChartColors";
import useSalesSeries from "../../hooks/useSalesSeries";
import SalesSliceTooltip from "./SalesSliceTooltip";
import ChartStatsHeader from "./ChartStatsHeader";
import {
  compactNumber,
  fullNumber,
  compactMoney,
  fullMoney,
  shortMonth,
} from "../../utils/formatters";

const OverviewChart = ({ isDashboard = false, view }) => {
  const { theme, isDark, colors } = useChartColors();
  const { data, isLoading, isError } = useGetSalesQuery();
  const { series, totals, hasData, isSales } = useSalesSeries(data, view);

  const formatAxisValue = (v) =>
    isSales ? compactMoney.format(v) : compactNumber.format(v);
  const formatFullValue = (v) =>
    isSales ? fullMoney.format(v) : `${fullNumber.format(v)} units`;

  if (isLoading) {
    return <OverviewChartSkeleton isDark={isDark} isDashboard={isDashboard} />;
  }

  if (isError || !hasData) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "1.25rem",
        }}
      >
        <Typography sx={{ color: isError ? theme.palette.error?.main : colors.textMuted }}>
          {isError
            ? "Could not load sales data. Refresh to try again."
            : "No sales recorded for this period."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {!isDashboard && totals && (
        <ChartStatsHeader
          totals={totals}
          isSales={isSales}
          formatFullValue={formatFullValue}
          colors={colors}
        />
      )}

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveLine
          data={series}
          colors={[colors.line]}
          theme={{
            text: { fontFamily: theme.typography.fontFamily, fill: colors.textMuted },
            axis: {
              domain: { line: { stroke: colors.axisLine, strokeWidth: 1 } },
              ticks: {
                line: { stroke: colors.axisLine, strokeWidth: 1 },
                text: { fill: colors.textMuted, fontSize: 12 },
              },
              legend: { text: { fill: colors.textStrong, fontSize: 13, fontWeight: 600 } },
            },
            // Dashed and low-contrast: readable as a reference, never a
            // competitor to the line itself.
            grid: { line: { stroke: colors.grid, strokeWidth: 1, strokeDasharray: "4 4" } },
            crosshair: {
              line: { stroke: colors.crosshair, strokeWidth: 1, strokeDasharray: "4 4" },
            },
            legends: { text: { fill: colors.textMuted, fontSize: 12 } },
          }}
          margin={
            isDashboard
              ? { top: 16, right: 20, bottom: 44, left: 56 }
              : { top: 24, right: 32, bottom: 60, left: 78 }
          }
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto", stacked: false, reverse: false }}
          // catmullRom overshoots between points, so a cumulative total can
          // appear to dip - implying revenue was lost in a month where it
          // merely grew slowly. monotoneX cannot overshoot.
          curve="monotoneX"
          enableArea
          areaOpacity={isDark ? 0.18 : 0.12}
          areaBaselineValue={0}
          defs={[
            linearGradientDef("lineFade", [
              { offset: 0, color: "inherit", opacity: 0.55 },
              { offset: 100, color: "inherit", opacity: 0 },
            ]),
          ]}
          fill={[{ match: "*", id: "lineFade" }]}
          lineWidth={3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            // Three-letter months in both modes: full names collide at 12
            // ticks and forced rotation is harder to scan than truncation.
            format: shortMonth,
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            legend: isDashboard ? "" : "Month",
            legendOffset: 46,
            legendPosition: "middle",
          }}
          axisLeft={{
            format: formatAxisValue,
            tickValues: 5,
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: isDashboard ? "" : `Cumulative ${isSales ? "revenue" : "units"}`,
            legendOffset: -64,
            legendPosition: "middle",
          }}
          enableGridX={false}
          // Horizontal rules only: they carry value comparison, vertical
          // ones would only add noise on a 12-point axis.
          enableGridY
          gridYValues={5}
          enablePoints
          pointSize={isDashboard ? 6 : 9}
          pointColor={colors.line}
          pointBorderWidth={2.5}
          pointBorderColor={colors.surface}
          // Whole-column hit area instead of a 10px dot.
          enableSlices="x"
          sliceTooltip={({ slice }) => (
            <SalesSliceTooltip slice={slice} formatValue={formatFullValue} colors={colors} />
          )}
          crosshairType="x"
          useMesh={false}
          // One series is visible at a time, so a legend would only restate
          // the axis label.
          legends={[]}
        />
      </Box>
    </Box>
  );
};

export default OverviewChart;
