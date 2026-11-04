// Intl.DisplayNames turns an ISO 3166-1 alpha-2 code into a country name.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
let regionNames = null;
try {
  regionNames = new Intl.DisplayNames(["en"], { type: "region" });
} catch {
  /* very old browsers: fall back to the code */
}

export const countryName = (code) => {
  if (!code) return "";
  try {
    return regionNames?.of(String(code).toUpperCase()) ?? code;
  } catch {
    return code;
  }
};

/** "ID" -> 🇮🇩, built from Unicode regional indicator symbols. */
export const countryFlag = (code) =>
  /^[a-z]{2}$/i.test(code ?? "")
    ? String.fromCodePoint(
        ...[...code.toUpperCase()].map(
          (char) => 0x1f1e6 + char.charCodeAt(0) - 65,
        ),
      )
    : "";
