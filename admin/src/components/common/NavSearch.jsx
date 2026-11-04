import { useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  createFilterOptions,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { navItems } from "../../config/navigation";

const filterOptions = createFilterOptions({
  stringify: (option) => `${option.text} ${option.section} ${option.keywords}`,
});

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * "Jump to page" search. Type, arrow to a result, press Enter.
 * Ctrl/⌘ + K or "/" focuses it from anywhere outside a text field.
 */
const NavSearch = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const shortcutLabel = useMemo(() => (isMac ? "⌘K" : "Ctrl K"), []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const isShortcut =
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing);
      if (!isShortcut) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Autocomplete
      options={navItems}
      groupBy={(option) => option.section}
      getOptionLabel={(option) => option.text}
      filterOptions={filterOptions}
      isOptionEqualToValue={(a, b) => a.path === b.path}
      value={null}
      inputValue={inputValue}
      onInputChange={(_, value, reason) => {
        if (reason !== "reset") setInputValue(value);
      }}
      onChange={(_, option) => {
        if (!option) return;
        navigate(option.path);
        setInputValue("");
        inputRef.current?.blur();
      }}
      autoHighlight
      blurOnSelect
      clearOnBlur
      handleHomeEndKeys
      noOptionsText="No matching pages"
      popupIcon={null}
      sx={{ width: { xs: "100%", sm: 300, md: 340 }, maxWidth: "100%" }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...optionProps}
            sx={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <Box
              aria-hidden="true"
              sx={{ display: "flex", color: theme.palette.secondary[300] }}
            >
              {option.icon}
            </Box>
            {option.text}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={inputRef}
          placeholder="Search pages…"
          size="small"
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              "aria-label": "Search pages",
            },
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <Typography
                  component="kbd"
                  aria-hidden="true"
                  sx={{
                    display: { xs: "none", md: "inline-block" },
                    px: "6px",
                    py: "1px",
                    mr: "4px",
                    fontSize: "0.7rem",
                    fontFamily: "inherit",
                    borderRadius: "6px",
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.secondary[300],
                    whiteSpace: "nowrap",
                  }}
                >
                  {shortcutLabel}
                </Typography>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: theme.palette.background.alt,
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: theme.palette.divider },
            },
          }}
        />
      )}
    />
  );
};

export default NavSearch;
