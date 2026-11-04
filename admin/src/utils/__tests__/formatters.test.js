import { describe, expect, it } from "vitest";
import {
  formatDateTime,
  formatMoney,
  formatPhone,
  percentChange,
} from "../formatters";

describe("formatters", () => {
  it("formats 10-digit phone numbers and leaves others alone", () => {
    expect(formatPhone("5551234567")).toBe("(555) 123-4567");
    expect(formatPhone("+44 20 7946")).toBe("+44 20 7946");
    expect(formatPhone(undefined)).toBe("");
  });

  it("never renders $NaN", () => {
    expect(formatMoney(3584.18)).toBe("$3,584.18");
    expect(formatMoney("abc")).toBe("—");
    expect(formatMoney(null)).toBe("—");
  });

  it("returns a dash for missing or invalid dates", () => {
    expect(formatDateTime(undefined)).toBe("—");
    expect(formatDateTime("not a date")).toBe("—");
    expect(formatDateTime("2021-01-03T07:00:00Z")).toMatch(/2021/);
  });

  it("computes percentage change only when it is defined", () => {
    expect(percentChange(110, 100)).toBeCloseTo(10);
    expect(percentChange(5, 0)).toBeNull();
    expect(percentChange(undefined, 3)).toBeNull();
  });
});
