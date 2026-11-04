import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  ArrowForwardRounded,
  CalendarMonthOutlined,
  DownloadOutlined,
  Groups2Outlined,
  PointOfSaleOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Header from "../components/common/Header";
import PageContainer from "../components/common/PageContainer";
import Panel from "../components/common/Panel";
import StatusMessage from "../components/common/StatusMessage";
import { DataGridSurface } from "../components/common/CustomDataGrid";
import BreakdownChart from "../components/module/BreakdownChart";
import OverviewChart from "../components/module/OverviewChart";
import StatBox from "../components/module/StatBox";
import { useGetDashboardQuery } from "../state/api";
import { useDataGridColors } from "../hooks/useDataGridColors";
import { MONO } from "../components/grid/cells";
import CustomerDrawer from "../components/feature/CustomerDrawer";
import UserLinkCell from "../components/feature/UserLinkCell";
import TopProducts from "../components/feature/TopProducts";
import ProductDialog from "../components/feature/ProductDialog";
import {
  formatDateTime,
  formatMoney,
  fullMoney,
  fullNumber,
  percentChange,
} from "../utils/formatters";
import { buildCsv, downloadCsv } from "../utils/csv";

const span = (lg, md = 12) => ({
  gridColumn: { xs: "span 12", md: `span ${md}`, lg: `span ${lg}` },
});

const Dashboard = () => {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery();
  const c = useDataGridColors();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openProduct, setOpenProduct] = useState(null);
  const stats = data?.success ? data.salesStats : null;
  const failed = isError || data?.success === false;

  // Month-over-month change computed from the data itself, rather than a
  // hard-coded "+5%" that never changes.
  const monthDelta = useMemo(() => {
    const months = stats?.monthlyData ?? [];
    const index = months.findIndex(
      (m) => m.month === stats?.thisMonthStats?.month,
    );
    if (index < 1) return { delta: null, previous: null };
    return {
      delta: percentChange(
        stats.thisMonthStats.totalSales,
        months[index - 1].totalSales,
      ),
      previous: months[index - 1].month,
    };
  }, [stats]);

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
        renderCell: ({ value }) => (
          <UserLinkCell value={value} short onOpen={setSelectedUserId} />
        ),
      },
      {
        field: "products",
        headerName: "Products",
        flex: 0.5,
        minWidth: 90,
        sortable: false,
        valueGetter: (value) => value?.length ?? 0,
      },
      {
        field: "cost",
        headerName: "Amount",
        flex: 0.7,
        minWidth: 110,
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
    ],
    [c],
  );

  const downloadReport = () => {
    if (!stats) return;
    const csv = buildCsv([
      {
        title: "Summary",
        header: ["Metric", "Value"],
        rows: [
          ["Total customers", stats.totalCustomers],
          ["Sales today", stats.todayStats?.totalSales],
          ["Units sold today", stats.todayStats?.totalUnits],
          [
            `Sales in ${stats.thisMonthStats?.month ?? "this month"}`,
            stats.thisMonthStats?.totalSales,
          ],
          ["Yearly sales", stats.yearlySalesTotal],
          ["Yearly units sold", stats.yearlyTotalSoldUnits],
        ],
      },
      {
        title: "Monthly sales",
        header: ["Month", "Sales", "Units"],
        rows: (stats.monthlyData ?? []).map((m) => [
          m.month,
          m.totalSales,
          m.totalUnits,
        ]),
      },
      {
        title: "Sales by category",
        header: ["Category", "Sales"],
        rows: Object.entries(stats.salesByCategory ?? {}),
      },
      {
        title: "Recent transactions",
        header: ["Transaction ID", "User ID", "Created at", "Products", "Cost"],
        rows: (stats.transactions ?? []).map((t) => [
          t._id,
          t.userId,
          t.createdAt,
          t.products?.length ?? 0,
          t.cost,
        ]),
      },
    ]);
    downloadCsv(
      `ecomvision-report-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
    );
  };

  return (
    <PageContainer>
      <Header
        title="Dashboard"
        subtitle="Your store at a glance"
        actions={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadOutlined />}
            onClick={downloadReport}
            disabled={!stats}
            sx={{ px: "18px", py: "9px", boxShadow: "none" }}
          >
            Download report
          </Button>
        }
      />

      {failed ? (
        <Panel sx={{ mt: "24px" }}>
          <StatusMessage
            variant="error"
            title="Could not load the dashboard"
            message="The server did not respond as expected."
            onRetry={refetch}
            minHeight={360}
          />
        </Panel>
      ) : (
        <Box
          sx={{
            mt: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: { xs: "12px", md: "20px" },
          }}
        >
          {/* KPIs */}
          <StatBox
            sx={span(3, 6)}
            loading={isLoading}
            title="Total customers"
            value={stats && fullNumber.format(stats.totalCustomers ?? 0)}
            caption="Registered customers"
            icon={<Groups2Outlined />}
          />
          <StatBox
            sx={span(3, 6)}
            loading={isLoading}
            title="Sales today"
            value={
              stats && formatMoney(stats.todayStats?.totalSales, fullMoney)
            }
            caption={
              stats?.todayStats
                ? `${fullNumber.format(stats.todayStats.totalUnits ?? 0)} units sold`
                : "No sales recorded today"
            }
            icon={<PointOfSaleOutlined />}
          />
          <StatBox
            sx={span(3, 6)}
            loading={isLoading}
            title="Monthly sales"
            value={
              stats && formatMoney(stats.thisMonthStats?.totalSales, fullMoney)
            }
            delta={monthDelta.delta}
            caption={
              monthDelta.previous
                ? `vs. ${monthDelta.previous}`
                : stats?.thisMonthStats?.month
            }
            icon={<CalendarMonthOutlined />}
          />
          <StatBox
            sx={span(3, 6)}
            loading={isLoading}
            title="Yearly sales"
            value={stats && formatMoney(stats.yearlySalesTotal, fullMoney)}
            caption={
              stats
                ? `${fullNumber.format(stats.yearlyTotalSoldUnits ?? 0)} units this year`
                : ""
            }
            icon={<TrendingUpOutlined />}
          />

          {/* Charts */}
          <Panel
            title="Revenue this year"
            subtitle="Cumulative, by month"
            actions={
              <Button
                component={RouterLink}
                to="/overview"
                size="small"
                color="secondary"
                endIcon={<ArrowForwardRounded />}
              >
                Details
              </Button>
            }
            sx={{ ...span(8), height: 380 }}
          >
            <OverviewChart view="sales" isDashboard />
          </Panel>

          <Panel
            title="Sales by category"
            actions={
              <Button
                component={RouterLink}
                to="/breakdown"
                size="small"
                color="secondary"
                endIcon={<ArrowForwardRounded />}
              >
                Details
              </Button>
            }
            sx={{ ...span(4), height: { xs: 420, lg: 380 } }}
          >
            <BreakdownChart isDashboard />
          </Panel>

          {/* Recent transactions */}
          <Panel
            title="Recent transactions"
            subtitle="The latest 50 orders"
            actions={
              <Button
                component={RouterLink}
                to="/transactions"
                size="small"
                color="secondary"
                endIcon={<ArrowForwardRounded />}
              >
                View all
              </Button>
            }
            sx={{ ...span(8), height: 520 }}
          >
            <DataGridSurface
              height="100%"
              containerSx={{ boxShadow: "none", borderRadius: "12px" }}
              showToolbar={false}
              rowHeight={44}
              loading={isLoading}
              getRowId={(row) => row._id}
              rows={stats?.transactions ?? []}
              columns={columns}
              disableRowSelectionOnClick
              localeText={{ noRowsLabel: "No transactions yet" }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[10, 25, 50]}
            />
          </Panel>

          {/* Best sellers */}
          <Panel
            title="Top products"
            subtitle="By revenue this year"
            actions={
              <Button
                component={RouterLink}
                to="/products"
                size="small"
                color="secondary"
                endIcon={<ArrowForwardRounded />}
              >
                All
              </Button>
            }
            sx={{ ...span(4), height: { xs: "auto", lg: 520 } }}
            bodySx={{ overflowY: "auto" }}
          >
            <TopProducts onSelect={setOpenProduct} />
          </Panel>
        </Box>
      )}
      <CustomerDrawer
        userId={selectedUserId}
        open={Boolean(selectedUserId)}
        onClose={() => setSelectedUserId(null)}
      />
      <ProductDialog
        product={openProduct}
        open={Boolean(openProduct)}
        onClose={() => setOpenProduct(null)}
      />
    </PageContainer>
  );
};

export default Dashboard;
