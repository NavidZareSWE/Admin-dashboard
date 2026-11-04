import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tooltip, Box } from "@mui/material";
import { useGetTransactionsQuery } from "../state/api";
import CustomDataGrid from "../components/common/CustomDataGrid";
import DataGridCustomToolbar from "../components/module/DataGridCustomToolbar";
import { useDataGridColors } from "../hooks/useDataGridColors";
import { IdCell, MONO } from "../components/grid/cells";
import CustomerDrawer from "../components/feature/CustomerDrawer";
import UserLinkCell from "../components/feature/UserLinkCell";
import { formatDateTime, formatMoney } from "../utils/formatters";

const SEARCH_DEBOUNCE_MS = 400;

// The schema stores { productId, quantity }, while older seed data stored
// bare product ids. Normalising here keeps the cell correct for both.
const normaliseItems = (items) =>
  (Array.isArray(items) ? items : []).map((item) =>
    item && typeof item === "object"
      ? { productId: item.productId ?? item._id, quantity: item.quantity ?? 1 }
      : { productId: item, quantity: 1 },
  );

const Transactions = () => {
  const c = useDataGridColors();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [sort, setSort] = useState({});
  // ?search= pre-fills the search, so other pages (the customer drawer's
  // "All orders" link) can deep-link into a filtered view.
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // A link to /transactions?search=… while this page is already open does
  // not remount it, so adopt URL changes made from outside the search box.
  const [lastUrlSearch, setLastUrlSearch] = useState(initialSearch);
  if (initialSearch !== lastUrlSearch) {
    setLastUrlSearch(initialSearch);
    if (search !== initialSearch) setSearch(initialSearch);
    // Leave the box alone when it already says the same thing (for example
    // with a trailing space still being typed).
    if (searchInput.trim() !== initialSearch) setSearchInput(initialSearch);
  }

  // Keep the URL in step with the applied search, so the filtered view can
  // be bookmarked or shared and survives a reload.
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (current === search) return;
    setSearchParams(search ? { search } : {}, { replace: true });
  }, [search, searchParams, setSearchParams]);

  // Search as you type, without a request per keystroke.
  useEffect(() => {
    const id = setTimeout(
      () => setSearch(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [searchInput]);

  // A new query starts from page one; otherwise a narrow search can land on
  // a page past its last result and show an empty table.
  const [lastSearch, setLastSearch] = useState(search);
  if (search !== lastSearch) {
    setLastSearch(search);
    setPaginationModel((model) => ({ ...model, page: 0 }));
  }

  const { data, isLoading, isFetching, isError, refetch } =
    useGetTransactionsQuery({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      sort: JSON.stringify(sort),
      search,
    });

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
        headerName: "User ID",
        flex: 1,
        minWidth: 200,
        renderCell: ({ value }) => (
          <UserLinkCell value={value} onOpen={setSelectedUserId} />
        ),
      },
      {
        field: "products",
        headerName: "Products",
        flex: 0.7,
        minWidth: 150,
        sortable: false,
        renderCell: ({ value }) => {
          const items = normaliseItems(value);
          const totalUnits = items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          return (
            <Tooltip
              title={
                <Box sx={{ fontFamily: MONO, fontSize: "0.72rem" }}>
                  {items.map((item, index) => (
                    <div key={`${item.productId}-${index}`}>
                      {item.productId} × {item.quantity}
                    </div>
                  ))}
                </Box>
              }
            >
              <span>
                {items.length} product{items.length !== 1 ? "s" : ""} ·{" "}
                {totalUnits} unit{totalUnits !== 1 ? "s" : ""}
              </span>
            </Tooltip>
          );
        },
      },
      {
        field: "cost",
        headerName: "Amount",
        flex: 0.7,
        minWidth: 120,
        type: "number",
        renderCell: ({ value }) => (
          <Box
            component="span"
            sx={{ fontFamily: MONO, fontWeight: 500, color: c.textStrong }}
          >
            {formatMoney(value)}
          </Box>
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

  const total = (data?.success && data?.totalTransactions) || 0;

  return (
    <>
      <CustomDataGrid
        title="Transactions"
        subtitle={
          data?.success
            ? `${total.toLocaleString("en-US")} ${
                search ? `matching “${search}”` : "transactions"
              }`
            : "Every transaction, newest first"
        }
        isError={isError || data?.success === false}
        onRetry={refetch}
        loading={isLoading || isFetching}
        getRowId={(row) => row._id}
        rows={(data?.success && data?.transactions) || []}
        columns={columns}
        rowCount={total}
        pageSizeOptions={[20, 50, 100]}
        pagination
        paginationMode="server"
        sortingMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={(newSortModel) => setSort(newSortModel[0] ?? {})}
        disableRowSelectionOnClick
        localeText={{
          noRowsLabel: search
            ? `No transactions match “${search}”`
            : "No transactions yet",
        }}
        slots={{ toolbar: DataGridCustomToolbar }}
        slotProps={{
          toolbar: { searchInput, setSearchInput, setSearch },
        }}
      />
      <CustomerDrawer
        userId={selectedUserId}
        open={Boolean(selectedUserId)}
        onClose={() => setSelectedUserId(null)}
      />
    </>
  );
};

export default Transactions;
