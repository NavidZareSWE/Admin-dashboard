import { useMemo } from "react";

// Backend shape: { success: true, SalesStats: { monthlyData: [...] } }
const useSalesSeries = (data, view) => {
  const isSales = view === "sales";

  const { salesSeries, unitsSeries, totals } = useMemo(() => {
    const empty = { salesSeries: [], unitsSeries: [], totals: null };
    const monthly = data?.SalesStats?.monthlyData;
    if (!monthly) return empty;

    const rows = Array.isArray(monthly) ? monthly : Object.values(monthly);
    if (!rows.length) return empty;

    const salesPoints = [];
    const unitsPoints = [];
    let cumulativeSales = 0;
    let cumulativeUnits = 0;

    rows.forEach(({ month, totalSales = 0, totalUnits = 0 }) => {
      cumulativeSales += totalSales;
      cumulativeUnits += totalUnits;
      salesPoints.push({ x: month, y: cumulativeSales });
      unitsPoints.push({ x: month, y: cumulativeUnits });
    });

    return {
      salesSeries: [{ id: "Total revenue", data: salesPoints }],
      unitsSeries: [{ id: "Total units", data: unitsPoints }],
      totals: {
        sales: cumulativeSales,
        units: cumulativeUnits,
        months: rows.length,
        lastMonth: rows[rows.length - 1]?.month,
      },
    };
  }, [data]);

  const series = isSales ? salesSeries : unitsSeries;
  // salesSeries/unitsSeries are always either [] or [{ id, data }], so this
  // is enough to know whether there's anything worth plotting.
  const hasData = series.length > 0 && series[0].data.length > 0;

  return { series, totals, hasData, isSales };
};

export default useSalesSeries;
