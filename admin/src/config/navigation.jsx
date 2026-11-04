import {
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
} from "@mui/icons-material";

// Single source for the sidebar, the navbar's page search and the "g then
// <shortcut>" keyboard navigation, so they never disagree about what pages
// exist or what they are called.
export const navSections = [
  {
    title: null,
    items: [
      {
        text: "Dashboard",
        path: "/dashboard",
        shortcut: "d",
        icon: <HomeOutlined />,
        keywords: "home kpi summary",
      },
    ],
  },
  {
    title: "Client Facing",
    items: [
      {
        text: "Products",
        path: "/products",
        shortcut: "p",
        icon: <ShoppingCartOutlined />,
        keywords: "catalogue catalog items inventory",
      },
      {
        text: "Customers",
        path: "/customers",
        shortcut: "c",
        icon: <Groups2Outlined />,
        keywords: "users clients people",
      },
      {
        text: "Transactions",
        path: "/transactions",
        shortcut: "t",
        icon: <ReceiptLongOutlined />,
        keywords: "orders payments purchases",
      },
      {
        text: "Geography",
        path: "/geography",
        shortcut: "g",
        icon: <PublicOutlined />,
        keywords: "map countries location world",
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        text: "Overview",
        path: "/overview",
        shortcut: "o",
        icon: <PointOfSaleOutlined />,
        keywords: "revenue yearly annual",
      },
      {
        text: "Daily",
        path: "/daily",
        shortcut: "y",
        icon: <TodayOutlined />,
        keywords: "day range",
      },
      {
        text: "Monthly",
        path: "/monthly",
        shortcut: "m",
        icon: <CalendarMonthOutlined />,
        keywords: "month",
      },
      {
        text: "Breakdown",
        path: "/breakdown",
        shortcut: "b",
        icon: <PieChartOutlined />,
        keywords: "category pie share",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        text: "Admin",
        path: "/admin",
        shortcut: "a",
        icon: <AdminPanelSettingsOutlined />,
        keywords: "admins administrators staff",
      },
      {
        text: "Performance",
        path: "/performance",
        shortcut: "f",
        icon: <TrendingUpOutlined />,
        keywords: "affiliate my sales",
      },
    ],
  },
];

export const navItems = navSections.flatMap(({ title, items }) =>
  items.map((item) => ({ ...item, section: title ?? "General" })),
);
