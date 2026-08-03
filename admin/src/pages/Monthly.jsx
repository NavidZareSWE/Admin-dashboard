import { useEffect, useMemo, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Header from "../components/common/Header";
import DailyChart from "../components/module/DailyChart";
import { useGetSalesQuery } from "../state/api";
import { getDailyBounds } from "../hooks/useDailySeries";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

/**
 * First and last day of a 1-based month, as local Date objects.
 *
 * The end is day 0 of the *following* month, which JavaScript resolves to the
 * last day of the one before it. A literal 31 does not clamp: `new Date(2021,
 * 1, 31)` is March 3rd, so a February selection would quietly include the
 * start of March. This form is also correct for 30-day months and leap years.
 */
const monthRange = (year, month) => [
  new Date(year, month - 1, 1),
  new Date(year, month, 0),
];

const Monthly = () => {
  const [view, setView] = useState("units");
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  // Same cache entry DailyChart subscribes to, so this is not a second request.
  const { data } = useGetSalesQuery();
  const { minDate, maxDate } = useMemo(() => getDailyBounds(data), [data]);

  // Derived rather than hardcoded to 2021: if the seed script is ever re-run
  // over a different span, the dropdown follows the data instead of offering
  // years that return an empty chart.
  const years = useMemo(() => {
    if (!minDate || !maxDate) return [];
    const first = minDate.getFullYear();
    const last = maxDate.getFullYear();
    return Array.from({ length: last - first + 1 }, (_, index) => first + index);
  }, [minDate, maxDate]);

  // Land on the most recent month that actually has data. The `?? current`
  // guard keeps a refetch from resetting a selection the user has made.
  useEffect(() => {
    if (!maxDate) return;
    setYear((current) => current ?? maxDate.getFullYear());
    setMonth((current) => current ?? maxDate.getMonth() + 1);
  }, [maxDate]);

  const [startDate, endDate] = useMemo(
    () => (year && month ? monthRange(year, month) : [null, null]),
    [year, month]
  );

  const selectedLabel = MONTHS.find(({ value }) => value === month)?.label;
  const ready = Boolean(year && month);

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header
        title="MONTHLY SALES"
        subtitle={
          ready
            ? `Daily breakdown for ${selectedLabel} ${year}`
            : "Daily breakdown by month"
        }
      />

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

          <Box sx={{ display: "flex", gap: "1rem", ml: "auto" }}>
            <FormControl size="small" sx={{ minWidth: 140 }} disabled={!ready}>
              <InputLabel>Month</InputLabel>
              <Select
                // `?? ""` keeps the field controlled during the first render,
                // before the query resolves and the effect seeds it.
                value={month ?? ""}
                label="Month"
                onChange={(event) => setMonth(event.target.value)}
              >
                {MONTHS.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 110 }} disabled={!ready}>
              <InputLabel>Year</InputLabel>
              <Select
                value={year ?? ""}
                label="Year"
                onChange={(event) => setYear(event.target.value)}
              >
                {years.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ height: "calc(100% - 4.5rem)" }}>
          <DailyChart view={view} startDate={startDate} endDate={endDate} />
        </Box>
      </Box>
    </Box>
  );
};

export default Monthly;