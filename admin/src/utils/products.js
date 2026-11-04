// The products endpoint joins product stats with $lookup, so `stat` arrives
// as an array (one entry per year). This flattens the first entry and
// coerces numeric fields once, so every view reads the same shape.
export const normalizeProduct = (product) => {
  const stat = Array.isArray(product.stat) ? product.stat[0] : product.stat;
  return {
    ...product,
    price: Number(product.price) || 0,
    rating: Number(product.rating) || 0,
    supply: Number(product.supply) || 0,
    yearlySales: stat?.yearlySalesTotal ?? null,
    yearlyUnits: stat?.yearlyTotalSoldUnits ?? null,
    monthlyData: stat?.monthlyData ?? [],
  };
};

export const normalizeProducts = (data) =>
  (data?.productsWithStat ?? []).map(normalizeProduct);
