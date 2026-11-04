import { useMemo, useState } from "react";
import { useGetAdminsQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import { useDataGridColors } from "../hooks/useDataGridColors";
import { buildUserColumns } from "../components/grid/userColumns";
import CustomerDrawer from "../components/feature/CustomerDrawer";

const Admin = () => {
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminsQuery();
  const c = useDataGridColors();
  const columns = useMemo(() => buildUserColumns(c), [c]);
  const [selectedId, setSelectedId] = useState(null);
  const rows = data?.admins ?? [];

  return (
    <>
      <CustomDataGrid
        title="Admins"
        subtitle={
          data?.success
            ? `${rows.length.toLocaleString("en-US")} people with admin access`
            : "People with admin access"
        }
        isError={isError || data?.success === false}
        onRetry={refetch}
        loading={isLoading || isFetching}
        getRowId={(row) => row._id}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        onRowClick={({ id }) => setSelectedId(id)}
        onCellKeyDown={({ id }, event) => {
          if (event.key === "Enter") setSelectedId(id);
        }}
        containerSx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        localeText={{ noRowsLabel: "No admins found" }}
      />
      <CustomerDrawer
        userId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
};

export default Admin;
