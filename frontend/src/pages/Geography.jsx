import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useGetGeographyQuery } from "../state/api";
import Header from "../components/common/Header";
import NIVO_WORLD_COUNTRIES_CONFIG from "../assets/world_countries.json";
import GeographySkeleton from "../components/templates/GeographySkeleton";

/* ------------------------------------------------------------------ *
 * Static configuration
 * ------------------------------------------------------------------ */

/* Antarctica is a permanent no-data blob that eats roughly a fifth of the
   vertical space and drags the eye to the bottom of the panel. Dropping it
   lets the populated latitudes render much larger. */
const FEATURES = NIVO_WORLD_COUNTRIES_CONFIG.features.filter(
  (f) => f.id !== "ATA",
);

/* Bounds of the feature set above under geoNaturalEarth1 at scale 1,
   translate [0, 0]. Measured with d3-geo against this exact file, so the
   auto-fit below lands on the pixel rather than guessing a scale. */
const FIT = { width: 5.405, height: 2.3519, centerY: -0.2028 };
const FIT_PADDING = 20;

/* Used only until the panel reports its real size. */
const FALLBACK_SIZE = { width: 960, height: 500 };

/*
 * Four deliberately separated quantitative bins.
 *
 * Cool colors represent lower values and warm colors represent higher
 * values. This makes the ordering immediately recognizable while keeping
 * enough hue and luminance separation between adjacent countries.
 *
 * Dark mode:
 *   indigo -> blue -> amber -> coral
 *
 * Light mode:
 *   pale blue -> blue -> amber -> red
 *
 * No-data is intentionally neutral and therefore is not confused with
 * the lowest-value data bin.
 */
const RAMP_DARK = ["#5E81D1", "#3B4CC0", "#F2A93B", "#10B981"];

const RAMP_LIGHT = [
  "#78A6D8", // low — previously lower-mid (now darker)
  "#325984", // lower-mid — darker blue
  "#F2B544", // upper-mid — amber
  "#22C55E", // high — red
];
const COUNTRY_NAME_BY_ID = FEATURES.reduce((acc, f) => {
  acc[f.id] = f.properties?.name ?? f.id;
  return acc;
}, {});

const formatValue = (v) => Math.round(v).toLocaleString("en-US");

/* ------------------------------------------------------------------ *
 * Hooks
 * ------------------------------------------------------------------ */

/* nivo takes projectionScale as an absolute pixel value, so it never adapts
   to the container on its own. Measuring the panel lets the map fill it.
   Rendering must never *depend* on this, though — it is a refinement, not a
   precondition. See FALLBACK_SIZE below. */
const useMeasuredBox = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Measure once synchronously, so the first paint is already close.
    const rect = el.getBoundingClientRect();
    if (rect.width && rect.height) {
      setSize({ width: rect.width, height: rect.height });
    }

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ width, height });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, size];
};

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export const Geography = () => {
  const theme = useTheme();
  const { data, isLoading, isError } = useGetGeographyQuery();
  const [wrapperRef, size] = useMeasuredBox();

  const isDark = theme.palette.mode === "dark";

  /*
   * Map colors are intentionally resolved separately from the MUI palette.
   * The map needs colors that communicate quantitative ordering clearly,
   * rather than simply inheriting the application's semantic UI colors.
   */
  const c = useMemo(
    () => ({
      ramp: isDark ? RAMP_DARK : RAMP_LIGHT,

      /* Neutral gray keeps no-data visually separate from the data ramp. */
      noData: isDark ? "#252A36" : "#E7EAF0",

      surface: isDark ? theme.palette.background.alt : "#ffffff",

      /* Strong country boundaries without making the map feel busy. */
      outline: isDark ? "#171B24" : "#ffffff",

      noDataOutline: isDark ? "#4A5263" : "#C6CCD6",

      /* Subtle enough to provide geographic context without competing
         with the actual data colors. */
      graticule: isDark ? "#3E4657" : "#D6DBE3",

      textStrong: isDark ? "#F2F4F8" : "#22262E",
      textMuted: isDark ? "#B8C0CF" : "#555D6D",

      panelBorder: theme.palette.secondary[300],
    }),
    [isDark, theme],
  );

  /*
   * I have not seen the geography endpoint, so this checks the shapes your
   * code has implied rather than assuming one. Pin it to the real field once
   * you have confirmed it, and delete the rest.
   */
  const mapData = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.loc)) return data.loc;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  /* Derived from the data. A hard-coded ceiling flattens the map the moment
     one country exceeds it. */
  const maxValue = useMemo(
    () => mapData.reduce((max, d) => Math.max(max, d.value ?? 0), 0),
    [mapData],
  );

  const domain = useMemo(() => [0, Math.max(maxValue, 1)], [maxValue]);

  const projection = useMemo(() => {
    /*
     * Never return null: the chart must not wait on measurement. If the
     * panel has not reported yet, fit against a sane default and let the
     * observer refine it on the next frame.
     */
    const width = size.width || FALLBACK_SIZE.width;
    const height = size.height || FALLBACK_SIZE.height;

    const usableW = Math.max(width - FIT_PADDING * 2, 1);
    const usableH = Math.max(height - FIT_PADDING * 2, 1);

    const scale = Math.min(usableW / FIT.width, usableH / FIT.height);

    return {
      scale,
      translation: [0.5, 0.5 - (FIT.centerY * scale) / height],
    };
  }, [size]);

  /*
   * d3's quantize scale splits the domain into equal bins, one per colour,
   * so these bounds mirror the rendered fills exactly. Built high-to-low.
   */
  const legendBins = useMemo(() => {
    const step = domain[1] / c.ramp.length;

    return c.ramp
      .map((color, i) => ({
        color,
        label: `${formatValue(step * i)} – ${formatValue(step * (i + 1))}`,
      }))
      .reverse();
  }, [domain, c.ramp]);

  const binColorFor = (value) => {
    const step = domain[1] / c.ramp.length;
    const index = Math.min(Math.floor(value / step), c.ramp.length - 1);

    return c.ramp[Math.max(index, 0)];
  };

  const topCountries = useMemo(
    () =>
      [...mapData].sort((a, b) => (b.value ?? 0) - (a.value ?? 0)).slice(0, 5),
    [mapData],
  );

  /*
   * nivo's default tooltip renders nothing for unmatched features, which is
   * indistinguishable from a broken chart. This one always answers.
   */
  const renderTooltip = ({ feature }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        px: "14px",
        py: "10px",
        borderRadius: "8px",
        bgcolor: c.surface,
        border: `1px solid ${c.panelBorder}`,
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      }}
    >
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: "3px",
          flexShrink: 0,
          bgcolor: feature.data ? feature.color : c.noData,
          border: `1px solid ${c.noDataOutline}`,
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: c.textMuted,
          }}
        >
          {feature.properties?.name ?? feature.id}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.35rem",
            fontWeight: 700,
            lineHeight: 1.2,
            color: c.textStrong,
          }}
        >
          {feature.data ? `${feature.formattedValue} users` : "No data"}
        </Typography>
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ m: "1.5rem 2.5rem" }}>
        <Header
          title="GEOGRAPHY"
          subtitle="Find where your users are located."
        />

        <GeographySkeleton
          isDark={isDark}
          surface={c.surface}
          border={c.panelBorder}
        />
      </Box>
    );
  }

  return (
    /* data-theme lets the glass kit's light-mode rules reach the shimmer
       placeholder below; the kit keys them off [data-theme="light"]. */
    <Box data-theme={isDark ? "dark" : "light"} sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="GEOGRAPHY" subtitle="Find where your users are located." />

      {/* A choropleth is poor at ranking; small high-value countries are
          nearly invisible. This answers "who is biggest" directly. */}
      <Box
        sx={{
          mt: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {topCountries.map((d, i) => (
          <Box
            key={d.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              px: "16px",
              py: "12px",
              minWidth: "170px",
              borderRadius: "8px",
              bgcolor: c.surface,
              border: `1px solid ${
                i === 0 ? theme.palette.secondary.main : c.panelBorder
              }`,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 34,
                borderRadius: "3px",
                bgcolor: binColorFor(d.value ?? 0),
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: c.textMuted,
                }}
              >
                {i + 1}. {COUNTRY_NAME_BY_ID[d.id] ?? d.id}
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: c.textStrong,
                }}
              >
                {formatValue(d.value ?? 0)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: "16px",
          bgcolor: c.surface,
          border: `1px solid ${c.panelBorder}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Box
          ref={wrapperRef}
          sx={{
            height: "62vh",
            minHeight: "380px",
          }}
        >
          {/* Three states only: request failed, payload unusable, or draw.
              Nothing here waits on measurement. */}
          {isError && (
            <Typography
              sx={{
                color: theme.palette.error?.main,
                p: "1.25rem",
              }}
            >
              Could not load geography data. Refresh to try again.
            </Typography>
          )}

          {!isError && (
            <ResponsiveChoropleth
              data={mapData}
              features={FEATURES}
              match="id"
              label="properties.name"
              value="value"
              valueFormat={formatValue}
              margin={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
              /* Mercator, nivo's default, inflates Russia, Canada and
                 Greenland enough to misrepresent the data, since area reads
                 as importance on a choropleth. */
              projectionType="naturalEarth1"
              projectionScale={projection.scale}
              projectionTranslation={projection.translation}
              projectionRotation={[0, 0, 0]}
              /* Quantitative data uses an intentionally ordered palette:
                 low = cool, high = warm. */
              colors={c.ramp}
              domain={domain}
              /* Neutral no-data color prevents missing countries from
                 being mistaken for low-value countries. */
              unknownColor={c.noData}
              /* Countries with data get a stronger outline than those
                 without: a small push in the visual hierarchy. */
              borderWidth={(f) => (f.data ? 0.7 : 0.5)}
              borderColor={(f) => (f.data ? c.outline : c.noDataOutline)}
              enableGraticule={true}
              graticuleLineWidth={0.6}
              graticuleLineColor={c.graticule}
              theme={{
                text: {
                  fontFamily: theme.typography.fontFamily,
                },
              }}
              tooltip={renderTooltip}
              /* Legend lives in HTML below, not in the SVG. */
              legends={[]}
            />
          )}
        </Box>

        {/* HTML legend: scales with browser zoom and OS font size, which SVG
            text inside nivo does not. */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px 20px",
            px: "20px",
            py: "16px",
            borderTop: `1px solid ${c.panelBorder}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: c.textStrong,
            }}
          >
            Users per country
          </Typography>

          {/* Color temperature communicates ordering:
              cool = fewer, warm = more. */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: c.textMuted,
              }}
            >
              Fewer
            </Typography>

            {[...legendBins].reverse().map((bin) => (
              <Box
                key={bin.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "4px",
                    bgcolor: bin.color,
                    border: `1px solid ${c.outline}`,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: c.textStrong,
                    whiteSpace: "nowrap",
                  }}
                >
                  {bin.label}
                </Typography>
              </Box>
            ))}

            <Typography
              sx={{
                fontSize: "0.9rem",
                color: c.textMuted,
              }}
            >
              More
            </Typography>
          </Box>

          {/* Set apart: not a value, a gap in the data. */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              pl: "20px",
              ml: "auto",
              borderLeft: `1px solid ${c.panelBorder}`,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "4px",
                bgcolor: c.noData,
                border: `1px solid ${c.noDataOutline}`,
              }}
            />

            <Typography
              sx={{
                fontSize: "1rem",
                color: c.textStrong,
              }}
            >
              No data
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Geography;
