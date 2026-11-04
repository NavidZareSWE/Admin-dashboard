import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetUserPerformanceQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import { useDataGridColors } from "../hooks/useDataGridColors";
import { IdCell, MONO, Pill } from "../components/grid/cells";
import { formatDateTime, formatMoney, fullMoney } from "../utils/formatters";

const Performance = () => {
  const userId = useSelector((state) => state.global.userId);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetUserPerformanceQuery(userId);
  const c = useDataGridColors();
  const rows = useMemo(() => data?.stats ?? [], [data]);

  const total = useMemo(
    () => rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0),
    [rows],
  );

  const columns = useMemo(
    () => [
      {
        field: "createdAt",
        headerName: "Date",
        flex: 1,
        minWidth: 170,
        valueFormatter: (value) => formatDateTime(value),
      },
      {
        field: "userId",
        headerName: "Customer",
        flex: 0.8,
        minWidth: 120,
        renderCell: ({ value }) => <IdCell value={value} c={c} />,
      },
      {
        field: "products",
        headerName: "Products",
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        renderCell: ({ value }) => <Pill c={c}>{value?.length ?? 0}</Pill>,
      },
      {
        field: "cost",
        headerName: "Amount",
        flex: 0.7,
        minWidth: 120,
        type: "number",
        renderCell: ({ value }) => (
          <span
            style={{ fontFamily: MONO, fontWeight: 500, color: c.textStrong }}
          >
            {formatMoney(value)}
          </span>
        ),
      },
      {
        field: "_id",
        headerName: "Transaction",
        flex: 0.6,
        minWidth: 120,
        renderCell: ({ value }) => <IdCell value={value} c={c} />,
      },
    ],
    [c],
  );

  return (
    <CustomDataGrid
      title="Performance"
      subtitle={
        data?.success && rows.length
          ? `${rows.length} affiliate sales · ${fullMoney.format(total)} total`
          : "Your affiliate sales"
      }
      isError={isError || data?.success === false}
      onRetry={refetch}
      loading={isLoading || isFetching}
      getRowId={(row) => row._id}
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      localeText={{ noRowsLabel: "No affiliate sales recorded yet" }}
      initialState={{
        sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
      }}
    />
  );
};

export default Performance;
