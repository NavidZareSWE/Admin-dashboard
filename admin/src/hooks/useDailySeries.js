import { useMemo } from "react";

// Backend shape: { success: true, SalesStats: { dailyData: [{ date, totalSales, totalUnits }] } }
// `date` arrives as "2021-01-02".

// new Date("2021-01-02") is parsed as UTC midnight, while the date picker
// hands back local midnight. West of UTC that shifts every row a day earlier
// and silently drops the boundary days of the selected range. Building the
// date from its parts keeps both sides on the same local calendar.
export const parseLocalISODate = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const toRows = (data) => {
  const daily = data?.SalesStats?.dailyData;
  if (!daily) return [];

  const list = Array.isArray(daily) ? daily : Object.values(daily);

  return list
    .map(({ date, totalSales = 0, totalUnits = 0 }) => ({
      date,
      totalSales,
      totalUnits,
      parsedDate: parseLocalISODate(date),
    }))
    .filter((row) => row.parsedDate)
    .sort((a, b) => a.parsedDate - b.parsedDate);
};

/**
 * The earliest and latest day present in the response, used to bound the
 * picker so a user cannot select a window the seed data has nothing in.
 */
export const getDailyBounds = (data) => {
  const rows = toRows(data);
  if (!rows.length) return { minDate: null, maxDate: null };
  return {
    minDate: rows[0].parsedDate,
    maxDate: rows[rows.length - 1].parsedDate,
  };
};

const MAX_TICKS = 8;

const useDailySeries = (data, view, startDate, endDate) => {
  const isSales = view === "sales";

  const rows = useMemo(() => toRows(data), [data]);

  const { salesSeries, unitsSeries, totals, tickValues } = useMemo(() => {
    const empty = {
      salesSeries: [],
      unitsSeries: [],
      totals: null,
      tickValues: [],
    };
    if (!rows.length) return empty;

    const from = startDate ? startOfDay(startDate) : null;
    const to = endDate ? startOfDay(endDate) : null;

    const inRange = rows.filter(
      ({ parsedDate }) =>
        (!from || parsedDate >= from) && (!to || parsedDate <= to)
    );
    if (!inRange.length) return empty;

    const salesPoints = [];
    const unitsPoints = [];
    let sumSales = 0;
    let sumUnits = 0;

    inRange.forEach(({ date, totalSales, totalUnits }) => {
      // Daily figures, not a running total: the Overview chart answers
      // "how far have we come", this one answers "what happened that day".
      salesPoints.push({ x: date, y: totalSales });
      unitsPoints.push({ x: date, y: totalUnits });
      sumSales += totalSales;
      sumUnits += totalUnits;
    });

    // A point scale draws one tick per datum, which is unreadable past a few
    // weeks, so hand nivo an explicit evenly spaced subset instead.
    const step = Math.max(1, Math.ceil(inRange.length / MAX_TICKS));
    const ticks = inRange
      .filter((_, index) => index % step === 0)
      .map(({ date }) => date);

    return {
      salesSeries: [{ id: "Daily revenue", data: salesPoints }],
      unitsSeries: [{ id: "Daily units", data: unitsPoints }],
      totals: {
        sales: sumSales,
        units: sumUnits,
        days: inRange.length,
        firstDay: inRange[0].date,
        lastDay: inRange[inRange.length - 1].date,
      },
      tickValues: ticks,
    };
  }, [rows, startDate, endDate]);

  const series = isSales ? salesSeries : unitsSeries;
  const hasData = series.length > 0 && series[0].data.length > 0;

  return { series, totals, hasData, isSales, tickValues };
};

export default useDailySeries;
