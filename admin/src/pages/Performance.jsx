import { Box } from "@mui/material";
import { useGetUserPerformanceQuery } from "../state/api";
import { useSelector } from "react-redux";
import CustomDataGrid from "../components/common/CustomDataGrid";
import { useDataGridColors } from "../hooks/useDataGridColors";

const Performance = () => {
  const userId = useSelector((state) => state.global.userId);
  const { data, isLoading } = useGetUserPerformanceQuery(userId);
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
      field: "userId",
      headerName: "User ID",
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
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{
            px: "9px",
            py: "3px",
            borderRadius: "20px",
            fontSize: "0.7rem",
            lineHeight: 1.6,
            backgroundColor: c.pillNeutralBg,
            color: c.pillNeutralFg,
            border: `1px solid ${c.pillNeutralBd}`,
          }}
        >
          {params.value.length}
        </Box>
      ),
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Box
          component="span"
          sx={{ fontFamily: mono, fontWeight: 500, color: c.textStrong }}
        >
          {`$${Number(params.value).toFixed(2)}`}
        </Box>
      ),
    },
  ];

  return (
    <CustomDataGrid
      title="PERFORMANCE"
      subtitle="Track your Affiliate Sales Performance Here"
      height="75vh"
      loading={isLoading || !data.success}
      getRowId={(row) => row._id}
      rows={data?.stats || []}
      columns={columns}
      disableRowSelectionOnClick
    />
  );
};

export default Performance;