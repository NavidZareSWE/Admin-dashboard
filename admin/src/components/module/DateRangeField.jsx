import { forwardRef, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  GlobalStyles,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// react-datepicker joins the two formatted dates with this string, and the
// input component splits on it again to rebuild the MUI-style mask.
// (`rangeSeparator` is a documented DatePicker prop; the library default is
// " - ", MUI's single-input range field uses an en dash.)
const RANGE_SEPARATOR = " – ";
const DATE_FORMAT = "MM/dd/yyyy"; // date-fns tokens: react-datepicker v9 formats through date-fns v4
const DATE_MASK = "MM/DD/YYYY";

const CELL = 36; // px, matches MUI's day cell
const MONTHS_SHOWN = 2;

// 2021-08-01 was a Sunday, so formatting seven consecutive days from it
// yields the weekday initials in Sunday-first order - which is what
// `calendarStartDay={0}` below makes the grid use.
const WEEKDAY_INITIALS = Array.from({ length: 7 }, (_, index) =>
  new Intl.DateTimeFormat("en-US", { weekday: "narrow" }).format(
    new Date(2021, 7, 1 + index)
  )
);

const monthLabel = (date) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);

/**
 * The field react-datepicker clones its input props onto. It is deliberately
 * not a spread of `...rest`: the library injects `readOnly`, `form`, `title`
 * and `tabIndex` alongside real TextField props, and forwarding those blindly
 * puts invalid attributes on the FormControl root.
 */
const MuiRangeInput = forwardRef(function MuiRangeInput(
  {
    value,
    onClick,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    id,
    name,
    disabled,
    label,
    fullWidth,
  },
  ref
) {
  // While only the start date is picked, react-datepicker emits
  // "01/02/2021 – ". Backfilling the empty half with the mask reproduces
  // MUI's placeholder behaviour instead of leaving a dangling separator.
  const displayValue = useMemo(() => {
    const [start = "", end = ""] = String(value ?? "").split(RANGE_SEPARATOR);
    if (!start && !end) return "";
    return `${start || DATE_MASK}${RANGE_SEPARATOR}${end || DATE_MASK}`;
  }, [value]);

  return (
    <TextField
      id={id}
      name={name}
      label={label}
      size="small"
      disabled={disabled}
      fullWidth={fullWidth}
      value={displayValue}
      placeholder={`${DATE_MASK}${RANGE_SEPARATOR}${DATE_MASK}`}
      onChange={onChange}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      inputRef={ref}
      slotProps={{
        // Shrunk unconditionally so the mask stays visible with an empty
        // value, the same way MUI's own range field behaves.
        inputLabel: { shrink: true },
        // Calendar-driven only. Note this is the *input's* readOnly, not
        // DatePicker's - DatePicker's `readOnly` prop makes `handleSelect`
        // return early, which would disable the calendar too.
        input: {
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                tabIndex={-1}
                disabled={disabled}
                aria-label="Open date range calendar"
                onClick={onClick}
              >
                <CalendarTodayOutlinedIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
        htmlInput: { sx: { cursor: "pointer" } },
      }}
      sx={{ minWidth: 260 }}
    />
  );
});

/**
 * Supplying `renderCustomHeader` suppresses react-datepicker's own navigation
 * buttons *and* its day-name row, so both are rebuilt here. `customHeaderCount`
 * is the zero-based index of the calendar this header belongs to, which is how
 * the arrows are kept on the outer edges the way MUI renders them.
 */
const CalendarHeader = ({
  monthDate,
  customHeaderCount,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "40px",
        px: "4px",
      }}
    >
      <IconButton
        size="small"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        aria-label="Previous month"
        sx={{ visibility: customHeaderCount === 0 ? "visible" : "hidden" }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
        {monthLabel(monthDate)}
      </Typography>

      <IconButton
        size="small"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        aria-label="Next month"
        sx={{
          visibility:
            customHeaderCount === MONTHS_SHOWN - 1 ? "visible" : "hidden",
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>

    <Box sx={{ display: "flex", mt: "4px" }} aria-hidden="true">
      {WEEKDAY_INITIALS.map((initial, index) => (
        <Box
          key={index}
          sx={{
            width: `${CELL}px`,
            height: `${CELL}px`,
            lineHeight: `${CELL}px`,
            textAlign: "center",
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {initial}
        </Box>
      ))}
    </Box>
  </Box>
);

const DateRangeField = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  label = "Date range",
  disabled = false,
}) => {
  const theme = useTheme();

  const styles = useMemo(() => {
    const accent = theme.palette.secondary.main;
    const onAccent = theme.palette.getContrastText(accent);
    const surface = theme.palette.background.alt;
    const band = alpha(accent, theme.palette.mode === "dark" ? 0.24 : 0.3);
    const preview = alpha(accent, theme.palette.mode === "dark" ? 0.14 : 0.18);

    // react-datepicker's stylesheet colours the range classes directly, at
    // specificity (0,3,0). Repeating the calendar class lifts these rules
    // above it without relying on stylesheet insertion order, which emotion
    // and Vite do not guarantee.
    const c = ".mui-drp-calendar.mui-drp-calendar.mui-drp-calendar";
    const p = ".mui-drp-popper.mui-drp-popper";

    return {
      [p]: {
        zIndex: theme.zIndex.modal,
        paddingTop: "8px",
      },

      [c]: {
        display: "flex",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        backgroundColor: surface,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[8],
        fontFamily: theme.typography.fontFamily,
        padding: "8px 0",
      },
      [`${c} .react-datepicker__month-container`]: {
        float: "none",
        padding: "0 12px",
      },
      [`${c} .react-datepicker__month-container + .react-datepicker__month-container`]:
        {
          borderLeft: `1px solid ${theme.palette.divider}`,
        },

      // The custom header supplies its own spacing and borders.
      [`${c} .react-datepicker__header`]: {
        backgroundColor: "transparent",
        borderBottom: "none",
        padding: 0,
      },

      [`${c} .react-datepicker__month`]: {
        margin: 0,
        textAlign: "center",
        // Establishes a stacking context so the range band drawn at
        // z-index -1 sits above this container but below each day's own
        // background and label.
        position: "relative",
        zIndex: 0,
      },
      [`${c} .react-datepicker__week`]: {
        display: "flex",
      },

      [`${c} .react-datepicker__day`]: {
        boxSizing: "border-box",
        width: `${CELL}px`,
        height: `${CELL}px`,
        lineHeight: `${CELL}px`,
        margin: 0,
        borderRadius: "50%",
        position: "relative",
        color: theme.palette.text.primary,
        fontSize: "0.8125rem",
        transition: theme.transitions.create(["background-color", "color"], {
          duration: theme.transitions.duration.shortest,
        }),
      },
      [`${c} .react-datepicker__day:hover`]: {
        borderRadius: "50%",
        backgroundColor: theme.palette.action.hover,
      },
      [`${c} .react-datepicker__day--today`]: {
        border: `1px solid ${theme.palette.text.secondary}`,
        fontWeight: 500,
      },
      // MUI omits adjacent-month days entirely rather than dimming them.
      [`${c} .react-datepicker__day--outside-month`]: {
        visibility: "hidden",
        pointerEvents: "none",
      },
      [`${c} .react-datepicker__day--disabled`]: {
        color: theme.palette.text.disabled,
        pointerEvents: "none",
        backgroundColor: "transparent",
      },
      // The library gives keyboard focus its own filled background; MUI uses
      // a ring instead so it cannot be mistaken for a selected endpoint.
      [`${c} .react-datepicker__day--keyboard-selected`]: {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
      },
      [`${c} .react-datepicker__day:focus-visible`]: {
        outline: `2px solid ${accent}`,
        outlineOffset: "-2px",
      },

      // Range band. `--in-range` is inclusive of both endpoints, so the
      // endpoints get a half-band and their solid circle paints on top of it.
      [`${c} .react-datepicker__day--in-range::before, ${c} .react-datepicker__day--in-selecting-range::before`]:
        {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: band,
          zIndex: -1,
        },
      [`${c} .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range)::before`]:
        {
          backgroundColor: preview,
        },
      [`${c} .react-datepicker__day--range-start::before, ${c} .react-datepicker__day--selecting-range-start::before`]:
        {
          borderRadius: "50% 0 0 50%",
        },
      [`${c} .react-datepicker__day--range-end::before, ${c} .react-datepicker__day--selecting-range-end::before`]:
        {
          borderRadius: "0 50% 50% 0",
        },

      // Endpoints.
      [`${c} .react-datepicker__day--selected, ${c} .react-datepicker__day--range-start, ${c} .react-datepicker__day--range-end`]:
        {
          backgroundColor: accent,
          color: onAccent,
          fontWeight: 500,
          borderRadius: "50%",
        },
      [`${c} .react-datepicker__day--selected:hover, ${c} .react-datepicker__day--range-start:hover, ${c} .react-datepicker__day--range-end:hover`]:
        {
          backgroundColor: accent,
        },

      // In-between days keep the band but no circle of their own.
      [`${c} .react-datepicker__day--in-range:not(.react-datepicker__day--range-start):not(.react-datepicker__day--range-end)`]:
        {
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          borderRadius: 0,
        },
      [`${c} .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--selecting-range-start):not(.react-datepicker__day--selecting-range-end)`]:
        {
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
          borderRadius: 0,
        },
    };
  }, [theme]);

  return (
    <Box className="react-datepicker-mui">
      <GlobalStyles styles={styles} />
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        monthsShown={MONTHS_SHOWN}
        calendarStartDay={0}
        dateFormat={DATE_FORMAT}
        rangeSeparator={RANGE_SEPARATOR}
        showPopperArrow={false}
        popperPlacement="bottom-end"
        popperClassName="mui-drp-popper"
        calendarClassName="mui-drp-calendar"
        renderCustomHeader={(headerProps) => <CalendarHeader {...headerProps} />}
        customInput={<MuiRangeInput label={label} />}
      />
    </Box>
  );
};

export default DateRangeField;
