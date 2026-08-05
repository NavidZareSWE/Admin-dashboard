import { Box } from "@mui/material";
import { useGetAdminsQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import { useDataGridColors } from "../hooks/useDataGridColors";

const Admin = () => {
  const { data, isLoading } = useGetAdminsQuery();
  const c = useDataGridColors();

  const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

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
              backgroundColor: isAdmin ? c.pillBg : c.pillNeutralBg,
              color: isAdmin ? c.pillFg : c.pillNeutralFg,
              border: `1px solid ${isAdmin ? c.pillBd : c.pillNeutralBd}`,
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
  ];

  return (
    <CustomDataGrid
      title="ADMINS"
      subtitle="Managing admins and list of admins"
      height="75vh"
      loading={isLoading || !data.success}
      getRowId={(row) => row._id}
      rows={data?.admins || []}
      columns={columns}
      disableRowSelectionOnClick
    />
  );
};

export default Admin;
