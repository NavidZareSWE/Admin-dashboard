// Spreadsheet apps execute cells that start with these characters as
// formulas, so such values are prefixed with an apostrophe (OWASP "CSV
// injection" guidance).
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export const csvCell = (value) => {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (typeof value === "string" && FORMULA_PREFIX.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const csvRow = (cells) => cells.map(csvCell).join(",");

/** Joins several titled tables into one CSV, separated by blank lines. */
export const buildCsv = (sections) =>
  sections
    .map(({ title, header, rows }) =>
      [title && csvRow([title]), header && csvRow(header), ...rows.map(csvRow)]
        .filter(Boolean)
        .join("\r\n"),
    )
    .join("\r\n\r\n");

export const downloadCsv = (filename, csv) => {
  // The BOM makes Excel read the file as UTF-8.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
