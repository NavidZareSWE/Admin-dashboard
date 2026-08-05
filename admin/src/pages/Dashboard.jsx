import FlexBetween from '../components/common/FlexBetween';
import Header from '../components/common/Header';
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from '@mui/icons-material';
import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { DataGridSurface } from '../components/common/CustomDataGrid';
import BreakdownChart from '../components/module/BreakdownChart';
import OverviewChart from '../components/module/OverviewChart';
import { useGetDashboardQuery } from '../state/api';
import StatBox from '../components/module/StatBox';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const { data, isLoading } = useGetDashboardQuery();

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'createdAt', headerName: 'CreatedAt', flex: 1 },
    {
      field: 'products',
      headerName: '# of Products',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value?.length ?? 0,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      flex: 1,
      renderCell: (params) =>
        Number.isFinite(Number(params.value))
          ? `$${Number(params.value).toFixed(2)}`
          : '-',
    },
  ];

  return (
    <Box sx={{ m: '1.5rem 2.5rem' }}>
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}
          >
            <DownloadOutlined sx={{ mr: '10px' }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        sx={{
          mt: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gridAutoRows: '160px',
          gap: '20px',
          '& > div': {
            minWidth: 0,
            minHeight: 0,
            gridColumn: isNonMediumScreens ? undefined : 'span 12',
          },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={data?.success && data?.salesStats?.totalCustomers}
          increase="+14%"
          description="Since last month"
          icon={<Email sx={{ color: theme.palette.secondary[300], fontSize: '26px' }} />}
        />

        <StatBox
          title="Sales Today"
          value={data?.success && data?.salesStats?.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale sx={{ color: theme.palette.secondary[300], fontSize: '26px' }} />
          }
        />

        <Box
          sx={{
            gridColumn: 'span 8',
            gridRow: 'span 2',
            backgroundColor: theme.palette.background.alt,
            p: '1rem',
            borderRadius: '0.55rem',
          }}
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>

        <StatBox
          title="Monthly Sales"
          value={data?.success && data?.salesStats?.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={<PersonAdd sx={{ color: theme.palette.secondary[300], fontSize: '26px' }} />}
        />

        <StatBox
          title="Yearly Sales"
          value={data?.success && data?.salesStats?.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={<Traffic sx={{ color: theme.palette.secondary[300], fontSize: '26px' }} />}
        />

        {/* ROW 2 */}
        <Box
          sx={{
            gridColumn: 'span 8',
            gridRow: 'span 3',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DataGridSurface
            height="100%"
            containerSx={{ flex: 1, minHeight: 0, borderRadius: '0.55rem' }}
            showToolbar={false}
            rowHeight={44}
            loading={isLoading}
            getRowId={(row) => row._id}
            rows={(data?.success && data?.salesStats?.transactions) || []}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 100, page: 0 } },
            }}
            pageSizeOptions={[25, 50, 100]}
          />
        </Box>

        <Box
          sx={{
            gridColumn: 'span 4',
            gridRow: 'span 3',
            backgroundColor: theme.palette.background.alt,
            p: '1.5rem',
            borderRadius: '0.55rem',
          }}
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales By Category
          </Typography>

          <BreakdownChart isDashboard={true} />

          <Typography
            sx={{
              p: '0 0.6rem',
              fontSize: '0.8rem',
              color: theme.palette.secondary[200],
            }}
          >
            Breakdown of real states and information via category for revenue made for this year
            and total sales.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;