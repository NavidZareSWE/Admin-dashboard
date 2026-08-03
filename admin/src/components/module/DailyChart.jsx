import { ResponsiveLine } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { Box, Typography } from "@mui/material";
import { useGetSalesQuery } from "../../state/api";
import OverviewChartSkeleton from "../templates/Overviewchartskeleton ";
import useChartColors from "../../hooks/useChartColors";
import useDailySeries, { parseLocalISODate } from "../../hooks/useDailySeries";
import SalesSliceTooltip from "./SalesSliceTooltip";
import ChartStatsHeader from "./ChartStatsHeader";
import {
  compactNumber,
  fullNumber,
  compactMoney,
  fullMoney,
} from "../../utils/formatters";

const axisDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const tooltipDayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatAxisDay = (iso) => {
  const date = parseLocalISODate(iso);
  return date ? axisDayFormatter.format(date) : String(iso);
};

const formatTooltipDay = (iso) => {
  const date = parseLocalISODate(iso);
  return date ? tooltipDayFormatter.format(date) : String(iso);
};

const DailyChart = ({ view, startDate, endDate }) => {
  const { theme, isDark, colors } = useChartColors();
  // Same cache entry the Daily page reads its bounds from, so this does not
  // issue a second request.
  const { data, isLoading, isError } = useGetSalesQuery();
  const { series, totals, hasData, isSales, tickValues } = useDailySeries(
    data,
    view,
    startDate,
    endDate
  );

  const formatAxisValue = (v) =>
    isSales ? compactMoney.format(v) : compactNumber.format(v);
  const formatFullValue = (v) =>
    isSales ? fullMoney.format(v) : `${fullNumber.format(v)} units`;

  if (isLoading) {
    return <OverviewChartSkeleton isDark={isDark} />;
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
        <Typography
          sx={{ color: isError ? theme.palette.error?.main : colors.textMuted }}
        >
          {isError
            ? "Could not load sales data. Refresh to try again."
            : "No sales recorded for the selected range."}
        </Typography>
      </Box>
    );
  }

  const pointCount = series[0].data.length;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {totals && (
        <ChartStatsHeader
          totals={totals}
          isSales={isSales}
          formatFullValue={formatFullValue}
          colors={colors}
          primaryLabel={isSales ? "Revenue in range" : "Units in range"}
          secondaryLabel="Days covered"
          secondaryValue={totals.days}
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
            grid: { line: { stroke: colors.grid, strokeWidth: 1, strokeDasharray: "4 4" } },
            crosshair: {
              line: { stroke: colors.crosshair, strokeWidth: 1, strokeDasharray: "4 4" },
            },
            legends: { text: { fill: colors.textMuted, fontSize: 12 } },
          }}
          margin={{ top: 24, right: 32, bottom: 60, left: 78 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: "auto", stacked: false, reverse: false }}
          // monotoneX cannot overshoot between points, so a quiet day never
          // renders as a dip below zero the way catmullRom would draw it.
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
          lineWidth={pointCount > 120 ? 2 : 3}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            // An explicit subset from the hook: a point scale would otherwise
            // print one label per day and collide past about three weeks.
            tickValues,
            format: formatAxisDay,
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            legend: "Day",
            legendOffset: 46,
            legendPosition: "middle",
          }}
          axisLeft={{
            format: formatAxisValue,
            tickValues: 5,
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: `Daily ${isSales ? "revenue" : "units"}`,
            legendOffset: -64,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY
          gridYValues={5}
          // Dots stop being markers and start being noise once they outnumber
          // the pixels between them.
          enablePoints={pointCount <= 45}
          pointSize={7}
          pointColor={colors.line}
          pointBorderWidth={2.5}
          pointBorderColor={colors.surface}
          enableSlices="x"
          sliceTooltip={({ slice }) => (
            <SalesSliceTooltip
              slice={slice}
              formatValue={formatFullValue}
              colors={colors}
              formatLabel={formatTooltipDay}
              caption={isSales ? "Revenue that day" : "Units sold that day"}
            />
          )}
          crosshairType="x"
          useMesh={false}
          legends={[]}
        />
      </Box>
    </Box>
  );
};

export default DailyChart;
