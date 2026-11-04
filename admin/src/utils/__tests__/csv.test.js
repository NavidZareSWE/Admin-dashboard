import { describe, expect, it } from "vitest";
import { buildCsv, csvCell } from "../csv";

describe("csv", () => {
  it("quotes separators, quotes and newlines", () => {
    expect(csvCell('say "hi", ok')).toBe('"say ""hi"", ok"');
    expect(csvCell("a\nb")).toBe('"a\nb"');
    expect(csvCell(42)).toBe("42");
    expect(csvCell(null)).toBe("");
  });

  it("neutralises spreadsheet formulas in text cells", () => {
    expect(csvCell("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)");
    expect(csvCell("@cmd")).toBe("'@cmd");
    // Negative numbers are data, not formulas.
    expect(csvCell(-12.5)).toBe("-12.5");
  });

  it("joins titled sections with a blank line", () => {
    const csv = buildCsv([
      { title: "A", header: ["x"], rows: [[1]] },
      { title: "B", header: ["y"], rows: [[2]] },
    ]);
    expect(csv).toBe("A\r\nx\r\n1\r\n\r\nB\r\ny\r\n2");
  });
});
