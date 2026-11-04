import { Close, Search } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";

/**
 * Server-side search for the Transactions grid. The parent debounces
 * `searchInput` into the query; Enter applies it immediately and Escape or
 * the clear button resets it. The text stays in the box after searching, so
 * it is always clear what the table is filtered by.
 */
const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const clear = () => {
    setSearchInput("");
    setSearch("");
  };

  return (
    <GridToolbarContainer
      sx={{ justifyContent: "space-between", width: "100%", flexWrap: "wrap" }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
      <TextField
        placeholder="Search by user ID or amount"
        size="small"
        variant="standard"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") setSearch(searchInput.trim());
          if (event.key === "Escape") clear();
        }}
        sx={{ width: { xs: "100%", sm: "18rem" } }}
        slotProps={{
          htmlInput: { "aria-label": "Search transactions" },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchInput ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={clear}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      />
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
