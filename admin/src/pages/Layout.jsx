import { Suspense, useEffect, useState } from "react";
import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { useGetUserQuery } from "../state/api";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import ShortcutsDialog from "../components/feature/ShortcutsDialog";

const DRAWER_WIDTH = 250;
const SIDEBAR_STORAGE_KEY = "ecomvision:sidebar-open";

// Desktop remembers whether the sidebar was collapsed; it starts open the
// first time. Mobile always starts closed, because there it covers the page.
const readDesktopPreference = () => {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

const Layout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
  const [desktopOpen, setDesktopOpen] = useState(readDesktopPreference);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSideBarOpen = isDesktop ? desktopOpen : mobileOpen;

  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUserQuery(userId);
  const user = data?.user || {};

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleSidebar = () => {
    if (!isDesktop) {
      setMobileOpen((open) => !open);
      return;
    }
    setDesktopOpen((open) => {
      try {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(!open));
      } catch {
        /* storage unavailable */
      }
      return !open;
    });
  };

  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onShowHelp: () => setShortcutsOpen(true),
  });

  const closeSidebar = () => {
    if (isDesktop) toggleSidebar();
    else setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Sidebar
        user={user}
        isDesktop={isDesktop}
        drawerWidth={DRAWER_WIDTH}
        isOpen={isSideBarOpen}
        onClose={closeSidebar}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar
          user={user}
          isSideBarOpen={isSideBarOpen}
          onToggleSidebar={toggleSidebar}
          onShowShortcuts={() => setShortcutsOpen(true)}
        />
        <Suspense
          fallback={
            <LinearProgress
              color="secondary"
              aria-label="Loading page"
              sx={{ height: 2 }}
            />
          }
        >
          <Outlet />
        </Suspense>
      </Box>
      <ShortcutsDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </Box>
  );
};

export default Layout;
