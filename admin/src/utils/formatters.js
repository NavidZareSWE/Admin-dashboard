// Change if your seed data is not in USD.
const CURRENCY = "USD";

export const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const fullNumber = new Intl.NumberFormat("en-US");

export const compactMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  notation: "compact",
  maximumFractionDigits: 1,
});

export const fullMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

export const shortMonth = (value) => String(value).slice(0, 3);
