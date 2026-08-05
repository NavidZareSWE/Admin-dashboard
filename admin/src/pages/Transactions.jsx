import { useState } from "react";
import { Tooltip, Box } from "@mui/material";
import { useGetTransactionsQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import DataGridCustomToolbar from "../components/module/DataGridCustomToolbar";

const Transactions = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "createdAt", headerName: "CreatedAt", flex: 1 },
    {
      field: "products",
      headerName: "Products",
      flex: 0.6,
      sortable: false,
      renderCell: (params) => {
        const items = params.value;
        const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

        return (
          <Tooltip
            title={
              <Box
                sx={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: "0.72rem",
                }}
              >
                {items.map((item) => (
                  <div key={item.productId}>
                    {item.productId}: {item.quantity}
                  </div>
                ))}
              </Box>
            }
          >
            <span>
              {items.length} product{items.length !== 1 ? "s" : ""} (
              {totalUnits} units)
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <CustomDataGrid
      title="TRANSACTIONS"
      subtitle="Entire list of transactions"
      height="80vh"
      loading={isLoading || !data}
      getRowId={(row) => row._id}
      rows={(data?.success && data?.transactions) || []}
      columns={columns}
      rowCount={(data?.success && data?.totalTransactions) || 0}
      pageSizeOptions={[20, 50, 100]}
      pagination
      paginationMode="server"
      sortingMode="server"
      paginationModel={{ page, pageSize }}
      onPaginationModelChange={(newModel) => {
        setPage(newModel.page);
        setPageSize(newModel.pageSize);
      }}
      onSortModelChange={(newSortModel) => setSort(newSortModel[0] ?? {})}
      slots={{ toolbar: DataGridCustomToolbar }}
      slotProps={{
        toolbar: { searchInput, setSearchInput, setSearch },
      }}
    />
  );
};

export default Transactions;
