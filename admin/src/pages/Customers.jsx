import { useMemo, useState } from "react";
import { useGetCustomersQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import { useDataGridColors } from "../hooks/useDataGridColors";
import { buildUserColumns } from "../components/grid/userColumns";
import CustomerDrawer from "../components/feature/CustomerDrawer";

const Customers = () => {
  const { data, isLoading, isFetching, isError, refetch } =
    useGetCustomersQuery();
  const c = useDataGridColors();
  const columns = useMemo(() => buildUserColumns(c), [c]);
  const [selectedId, setSelectedId] = useState(null);
  const rows = data?.customers ?? [];

  return (
    <>
      <CustomDataGrid
        title="Customers"
        subtitle={
          data?.success
            ? `${rows.length.toLocaleString("en-US")} customers`
            : "Your customer directory"
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
        localeText={{ noRowsLabel: "No customers yet" }}
        initialState={{
          pagination: { paginationModel: { pageSize: 25, page: 0 } },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
      <CustomerDrawer
        userId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
};

export default Customers;
