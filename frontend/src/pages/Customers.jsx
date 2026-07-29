import { Box, useTheme } from "@mui/material";
import { useGetCustomersQuery } from "../state/api";
import Header from "../components/common/Header";
import { DataGrid } from "@mui/x-data-grid";

const Customers = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data, isLoading } = useGetCustomersQuery();

  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

  const c = isDark
    ? {
        surface: theme.palette.background.alt,
        band: "rgba(0,0,0,0.22)",
        line: "rgba(255,255,255,0.07)",
        rowLine: "rgba(255,255,255,0.045)",
        hover: "rgba(255,255,255,0.035)",
        textStrong: "#f6f6f6",
        text: "#c2c2c2",
        textDim: "#8e93ad",
        accent: "#ffd166",
        accentDim: "#5c6180",
        pillBg: "rgba(255,209,102,0.12)",
        pillFg: "#ffd166",
        pillBd: "rgba(255,209,102,0.24)",
        pillNeutralBg: "rgba(255,255,255,0.07)",
        pillNeutralFg: "#c2c2c2",
        pillNeutralBd: "rgba(255,255,255,0.14)",
        thumb: "rgba(255,255,255,0.14)",
      }
    : {
        surface: "#ffffff",
        band: "#f4f4f4",
        line: "rgba(0,0,0,0.10)",
        rowLine: "rgba(0,0,0,0.07)",
        hover: "rgba(0,0,0,0.035)",
        textStrong: "#1a1a1a",
        text: "#3d3d3d",
        textDim: "#6b6b6b",
        accent: "#6b520f",
        accentDim: "#a0a0a0",
        pillBg: "#fdf3dc",
        pillFg: "#6b520f",
        pillBd: "#e3c98a",
        pillNeutralBg: "#ededed",
        pillNeutralFg: "#3d3d3d",
        pillNeutralBd: "#d0d0d0",
        thumb: "rgba(0,0,0,0.18)",
      };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{ fontFamily: mono, fontSize: "0.72rem", color: c.textDim }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      renderCell: (params) => (
        <Box component="span" sx={{ fontWeight: 500, color: c.textStrong }}>
          {params.value}
        </Box>
      ),
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => (
        <Box component="span" sx={{ fontFamily: mono, fontSize: "0.78rem" }}>
          {params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3")}
        </Box>
      ),
    },
    { field: "country", headerName: "Country", flex: 0.4 },
    { field: "occupation", headerName: "Occupation", flex: 1 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      renderCell: (params) => {
        const isAdmin = params.value === "admin";
        return (
          <Box
            component="span"
            sx={{
              px: "9px",
              py: "3px",
              borderRadius: "20px",
              fontSize: "0.7rem",
              lineHeight: 1.6,
              backgroundColor: isAdmin ? c.pillNeutralBg : c.pillBg,
              color: isAdmin ? c.pillNeutralFg : c.pillFg,
              border: `1px solid ${isAdmin ? c.pillNeutralBd : c.pillBd}`,
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ m: "1.5rem 2.5rem" }}>
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <Box
        sx={{
          mt: "40px",
          height: "75vh",
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid ${c.line}`,
          backgroundColor: c.surface,

          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "0.8rem",
            color: c.text,
          },

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: c.band,
            borderBottom: `1px solid ${c.line}`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: c.accent,
          },
          "& .MuiDataGrid-columnSeparator": { display: "none" },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            { outline: "none" },

          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${c.rowLine}`,
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },

          "& .MuiDataGrid-row": {
            transition: "background-color 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              backgroundColor: c.hover,
              boxShadow: `inset 2px 0 0 ${c.accent}`,
            },
          },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
          },

          "& .MuiDataGrid-footerContainer": {
            backgroundColor: c.band,
            borderTop: `1px solid ${c.line}`,
            minHeight: 46,
          },
          "& .MuiTablePagination-root": {
            color: c.text,
            fontSize: "0.72rem",
          },
          "& .MuiTablePagination-displayedRows": {
            color: c.textStrong,
          },
          "& .MuiTablePagination-actions .MuiIconButton-root": {
            color: c.accent,
            "&.Mui-disabled": { color: c.accentDim },
          },
          "& .MuiDataGrid-selectIcon, & .MuiSelect-icon": {
            color: c.textDim,
          },

          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${c.accent} !important`,
            fontSize: "0.72rem",
          },

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
        }}
      >
        <DataGrid
          loading={isLoading || data?.sucess}
          getRowId={(row) => row._id}
          rows={data?.customers || []}
          columns={columns}
          rowHeight={52}
          columnHeaderHeight={46}
          disableColumnMenu
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Customers;