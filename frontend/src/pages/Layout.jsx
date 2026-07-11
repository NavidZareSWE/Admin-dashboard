import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/common/Sidebar";

const Layout = () => {
  const isNoneMobile = useMediaQuery("(min-width: 600px");
  const [isSideBarOpen, setIseSideBarOpen] = useState(true);

  return (
    <Box display={isNoneMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNoneMobile={isNoneMobile}
        drawerWidth="250px"
        isSideBarOpen={isSideBarOpen}
        setIseSideBarOpen={setIseSideBarOpen}
      />
      <Box>
        <Navbar
          isSideBarOpen={isSideBarOpen}
          setIseSideBarOpen={setIseSideBarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
