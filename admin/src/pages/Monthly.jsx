import { useMemo, useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import DailyChart from "../components/module/DailyChart";
import ViewToggle from "../components/module/ViewToggle";
import { useGetSalesQuery } from "../state/api";
import { getDailyBounds } from "../hooks/useDailySeries";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
].map((label, index) => ({ value: index + 1, label }));

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

// Months are compared as year * 12 + (month - 1).
const toIndex = (year, month) => year * 12 + (month - 1);

const Monthly = () => {
  const [view, setView] = useState("sales");
  // null until the user picks; the latest month with data applies until then.
  const [picked, setPicked] = useState(null);

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
    return Array.from(
      { length: last - first + 1 },
      (_, index) => first + index,
    );
  }, [minDate, maxDate]);

  const selection =
    picked ??
    (maxDate
      ? { year: maxDate.getFullYear(), month: maxDate.getMonth() + 1 }
      : null);
  const year = selection?.year ?? null;
  const month = selection?.month ?? null;
  const ready = Boolean(year && month);

  const [startDate, endDate] = useMemo(
    () => (year && month ? monthRange(year, month) : [null, null]),
    [year, month],
  );

  const minIndex = minDate
    ? toIndex(minDate.getFullYear(), minDate.getMonth() + 1)
    : null;
  const maxIndex = maxDate
    ? toIndex(maxDate.getFullYear(), maxDate.getMonth() + 1)
    : null;
  const currentIndex = ready ? toIndex(year, month) : null;

  const step = (delta) => {
    const next = currentIndex + delta;
    setPicked({ year: Math.floor(next / 12), month: (next % 12) + 1 });
  };

  const selectedLabel = MONTHS.find(({ value }) => value === month)?.label;

  return (
    <PageContainer>
      <Header
        title="Monthly sales"
        subtitle={
          ready
            ? `Daily breakdown for ${selectedLabel} ${year}`
            : "Daily breakdown by month"
        }
        actions={<ViewToggle value={view} onChange={setView} />}
      />

      <Panel sx={{ mt: "24px", height: "calc(100vh - 230px)", minHeight: 500 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            gap: "0.5rem",
            mb: "0.5rem",
          }}
        >
          <Tooltip title="Previous month">
            <span>
              <IconButton
                aria-label="Previous month"
                onClick={() => step(-1)}
                disabled={!ready || currentIndex <= minIndex}
              >
                <ChevronLeft />
              </IconButton>
            </span>
          </Tooltip>

          <FormControl size="small" sx={{ minWidth: 140 }} disabled={!ready}>
            <InputLabel id="monthly-month-label">Month</InputLabel>
            <Select
              labelId="monthly-month-label"
              // `?? ""` keeps the field controlled before the query resolves.
              value={month ?? ""}
              label="Month"
              onChange={(event) =>
                setPicked({ year, month: event.target.value })
              }
            >
              {MONTHS.map(({ value, label }) => (
                <MenuItem
                  key={value}
                  value={value}
                  disabled={
                    ready &&
                    (toIndex(year, value) < minIndex ||
                      toIndex(year, value) > maxIndex)
                  }
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }} disabled={!ready}>
            <InputLabel id="monthly-year-label">Year</InputLabel>
            <Select
              labelId="monthly-year-label"
              value={year ?? ""}
              label="Year"
              onChange={(event) =>
                setPicked({ year: event.target.value, month })
              }
            >
              {years.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Next month">
            <span>
              <IconButton
                aria-label="Next month"
                onClick={() => step(1)}
                disabled={!ready || currentIndex >= maxIndex}
              >
                <ChevronRight />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Box sx={{ height: "calc(100% - 3rem)" }}>
          <DailyChart view={view} startDate={startDate} endDate={endDate} />
        </Box>
      </Panel>
    </PageContainer>
  );
};

export default Monthly;
