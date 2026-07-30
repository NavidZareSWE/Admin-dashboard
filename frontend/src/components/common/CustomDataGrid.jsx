import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "./Header";
import { useDataGridColors } from "../../hooks/useDataGridColors";

const CustomDataGrid = ({
  title,
  subtitle,
  height = "75vh",
  containerSx,
  rowHeight = 52,
  columnHeaderHeight = 48,
  slots,
  slotProps,
  ...dataGridProps
}) => {
  const c = useDataGridColors();

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title={title} subtitle={subtitle} />

      <Box
        sx={{
          mt: "32px",
          height,
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: c.surface,
          border: `1px solid ${c.line}`,
          boxShadow: c.shadow,
          transition: "box-shadow 200ms ease, border-color 200ms ease",

          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "0.82rem",
            color: c.text,
          },

          /* Toolbar styling */
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: `${c.band} !important`,
            borderBottom: `1px solid ${c.line}`,
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            "& .MuiButton-root": {
              color: c.accent,
              fontSize: "0.75rem",
              fontWeight: 600,
            },
            "& .MuiInputBase-root": {
              color: c.textStrong,
              fontSize: "0.8rem",
            },
            "& .MuiSvgIcon-root": {
              color: c.accent,
            },
          },

          /* Header Styling */
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderRow":
            {
              backgroundColor: `${c.band} !important`,
              borderBottom: `1px solid ${c.line}`,
            },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: c.accent,
          },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            { outline: "none" },

          /* Cell & Row Styling */
          "& .MuiDataGrid-cell": {
            backgroundColor: c.rowBg,
            borderBottom: `1px solid ${c.rowLine}`,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          "& .MuiDataGrid-row": {
            backgroundColor: c.rowBg,
            transition: "background-color 150ms ease",
            "&:hover": {
              backgroundColor: c.hover,
              "& .MuiDataGrid-cell": {
                backgroundColor: c.hover,
              },
            },
          },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: c.surface,
          },

          /* Footer Pagination Styling */
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: `${c.band} !important`,
            borderTop: `1px solid ${c.line}`,
            minHeight: 48,
          },
          "& .MuiTablePagination-root": {
            color: c.text,
            fontSize: "0.75rem",
          },
          "& .MuiTablePagination-displayedRows": {
            color: c.textStrong,
            fontWeight: 600,
          },
          "& .MuiTablePagination-actions .MuiIconButton-root": {
            color: c.accent,
            "&.Mui-disabled": { color: c.accentDim },
          },

          /* Custom Scrollbar */
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: 6,
            height: 6,
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: c.thumb,
            borderRadius: 3,
          },
          ...containerSx,
        }}
      >
        <DataGrid
          rowHeight={rowHeight}
          columnHeaderHeight={columnHeaderHeight}
          slots={slots}
          slotProps={slotProps}
          showToolbar
          {...dataGridProps}
        />
      </Box>
    </Box>
  );
};

export default CustomDataGrid;
