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

// Two decimals for individual amounts (a transaction cost, a unit price),
// where rounding to whole dollars would hide real differences.
export const preciseMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** "Jan 3, 2021, 7:00 AM", or an em dash for missing/invalid input. */
export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date);
};

/** Money with a dash fallback, so a bad value never renders as "$NaN". */
export const formatMoney = (value, formatter = preciseMoney) => {
  const number = Number(value);
  return value !== null && value !== undefined && Number.isFinite(number)
    ? formatter.format(number)
    : "—";
};

/** "(555) 123-4567" for a 10-digit string; anything else is returned as-is. */
export const formatPhone = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length === 10
    ? digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3")
    : String(value ?? "");
};

/** "+12.4%" / "−3.1%" between two numbers, or null when undefined. */
export const percentChange = (current, previous) => {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0)
    return null;
  return ((current - previous) / previous) * 100;
};
