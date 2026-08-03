import { useEffect, useMemo, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Header from "../components/common/Header";
import DailyChart from "../components/module/DailyChart";
import DateRangeField from "../components/module/DateRangeField";
import { useGetSalesQuery } from "../state/api";
import { getDailyBounds } from "../hooks/useDailySeries";

const DEFAULT_WINDOW_DAYS = 30;

const Daily = () => {
  const [view, setView] = useState("units");
  const [range, setRange] = useState([null, null]);
  const [startDate, endDate] = range;

  // RTK Query serves this from the same cache entry DailyChart subscribes to,
  // so reading it here for the picker bounds costs no extra request.
  const { data } = useGetSalesQuery();
  const { minDate, maxDate } = useMemo(() => getDailyBounds(data), [data]);

  // Seed the window once the response lands. The functional guard means a
  // refetch never clobbers a range the user has already chosen.
  useEffect(() => {
    if (!minDate || !maxDate) return;
    setRange((current) => {
      if (current[0] || current[1]) return current;
      const start = new Date(maxDate);
      start.setDate(start.getDate() - (DEFAULT_WINDOW_DAYS - 1));
      return [start < minDate ? minDate : start, maxDate];
    });
  }, [minDate, maxDate]);

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="DAILY SALES" subtitle="Day-by-day revenue and units" />

      <Box sx={{ height: "75vh" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
            mt: "1rem",
            mb: "0.5rem",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={view}
              label="View"
              onChange={(event) => setView(event.target.value)}
            >
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="units">Units</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ ml: "auto" }}>
            <DateRangeField
              startDate={startDate}
              endDate={endDate}
              onChange={(dates) => setRange(dates)}
              minDate={minDate ?? undefined}
              maxDate={maxDate ?? undefined}
              disabled={!minDate}
            />
          </Box>
        </Box>

        <Box sx={{ height: "calc(100% - 4.5rem)" }}>
          <DailyChart view={view} startDate={startDate} endDate={endDate} />
        </Box>
      </Box>
    </Box>
  );
};

export default Daily;
