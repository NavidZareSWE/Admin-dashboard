import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import DailyChart from "../components/module/DailyChart";
import DateRangeField from "../components/module/DateRangeField";
import ViewToggle from "../components/module/ViewToggle";
import { useGetSalesQuery } from "../state/api";
import { getDailyBounds } from "../hooks/useDailySeries";

const DEFAULT_WINDOW_DAYS = 30;

const Daily = () => {
  const [view, setView] = useState("sales");
  // null until the user picks a range; until then the default window below
  // applies. Deriving it, rather than copying it into state from an effect,
  // means a refetch can never overwrite a range the user chose.
  const [pickedRange, setPickedRange] = useState(null);

  // RTK Query serves this from the same cache entry DailyChart subscribes to,
  // so reading it here for the picker bounds costs no extra request.
  const { data } = useGetSalesQuery();
  const { minDate, maxDate } = useMemo(() => getDailyBounds(data), [data]);

  const defaultRange = useMemo(() => {
    if (!minDate || !maxDate) return [null, null];
    const start = new Date(maxDate);
    start.setDate(start.getDate() - (DEFAULT_WINDOW_DAYS - 1));
    return [start < minDate ? minDate : start, maxDate];
  }, [minDate, maxDate]);

  const [startDate, endDate] = pickedRange ?? defaultRange;
  // While only the start is picked, keep drawing the previous full range.
  const [chartStart, chartEnd] =
    startDate && endDate ? [startDate, endDate] : defaultRange;

  return (
    <PageContainer>
      <Header
        title="Daily sales"
        subtitle="Day-by-day revenue and units for any date range"
        actions={<ViewToggle value={view} onChange={setView} />}
      />

      <Panel sx={{ mt: "24px", height: "calc(100vh - 230px)", minHeight: 500 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "stretch", sm: "flex-end" },
            mb: "0.5rem",
          }}
        >
          <DateRangeField
            startDate={startDate}
            endDate={endDate}
            onChange={(dates) => setPickedRange(dates)}
            minDate={minDate ?? undefined}
            maxDate={maxDate ?? undefined}
            disabled={!minDate}
          />
        </Box>
        <Box sx={{ height: "calc(100% - 3rem)" }}>
          <DailyChart view={view} startDate={chartStart} endDate={chartEnd} />
        </Box>
      </Panel>
    </PageContainer>
  );
};

export default Daily;
