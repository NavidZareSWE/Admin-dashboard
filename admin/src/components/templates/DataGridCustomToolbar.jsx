import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import {
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "../common/FlexBetween";

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  return (
    <GridToolbarContainer
      sx={{ justifyContent: "space-between", width: "100%" }}
    >
      <FlexBetween gap="0.5rem">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </FlexBetween>
      <TextField
        label="Search..."
        sx={{ mb: "0.5rem", width: "15rem" }}
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        variant="standard"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;
